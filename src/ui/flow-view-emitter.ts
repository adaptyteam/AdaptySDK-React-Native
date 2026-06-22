import type { FlowEventHandlers } from './types';
import { $bridge } from '@/bridge';
import { EmitterSubscription } from 'react-native';
import {
  FlowEventId,
  ParsedFlowEvent,
  FlowEventIdType,
} from '@/types/flow-events';
import { LogContext, LogScope } from '@/logger';
import { Req } from '@/types/schema';
import {
  NATIVE_EVENT_RESOLVER,
  HANDLER_TO_NATIVE_EVENT,
  extractFlowCallbackArgs,
  type FlowPermissionStatus,
} from '@adapty/core';

type EventName = keyof FlowEventHandlers;

// Emitting view ID is passed in JSON["_view_id"]
// So that no all visible views would emit this event
// Must be in every callback response in the form of UUID string
// const KEY_VIEW = 'view_id';

/**
 * FlowViewEmitter manages event handlers for flow view events.
 * Each event type can have only one handler - new handlers replace existing ones.
 *
 * @remarks
 * View emitter wraps NativeEventEmitter
 * and provides several modifications:
 * - Synthetic type restrictions to avoid misspelling
 * - Safe data deserialization with SDK decoders
 * - Logging emitting and deserialization processes
 * - Filters out events for other views by _id
 *
 * @internal
 */
export class FlowViewEmitter {
  private viewId: string;
  private eventListeners: Map<string, EmitterSubscription> = new Map();
  private handlers: Map<
    EventName,
    {
      handler: FlowEventHandlers[EventName];
      onRequestClose: () => Promise<void>;
    }
  > = new Map();
  private internalHandlers: Map<
    EventName,
    {
      handler: (event: ParsedFlowEvent) => void;
    }
  > = new Map();

  constructor(viewId: string) {
    this.viewId = viewId;
  }

  public addListener(
    event: EventName,
    callback: FlowEventHandlers[EventName],
    onRequestClose: () => Promise<void>,
  ): EmitterSubscription {
    const nativeEvent = HANDLER_TO_NATIVE_EVENT[event];

    if (!nativeEvent) {
      throw new Error(`No native event mapping found for handler: ${event}`);
    }

    // Replace existing handler for this event type
    this.handlers.set(event, {
      handler: callback,
      onRequestClose,
    });

    // If no subscription to native event exists - create one
    if (!this.eventListeners.has(nativeEvent)) {
      const subscription = $bridge.addEventListener(
        nativeEvent,
        this.createEventHandler(nativeEvent),
      );
      this.eventListeners.set(nativeEvent, subscription);
    }

    return this.eventListeners.get(nativeEvent)!;
  }

  /**
   * Adds an internal event handler.
   * Internal handlers:
   * - Are called AFTER client handlers
   * - Do NOT return boolean (don't affect auto-dismiss)
   * - Are used for internal SDK logic (e.g., cleanup)
   * @internal
   */
  public addInternalListener(
    event: EventName,
    callback: (event: ParsedFlowEvent) => void,
  ): void {
    const nativeEvent = HANDLER_TO_NATIVE_EVENT[event];

    if (!nativeEvent) {
      throw new Error(`No native event mapping found for handler: ${event}`);
    }

    // Replace existing internal handler for this event
    this.internalHandlers.set(event, {
      handler: callback,
    });

    // If no subscription to native event exists - create one
    if (!this.eventListeners.has(nativeEvent)) {
      const subscription = $bridge.addEventListener(
        nativeEvent,
        this.createEventHandler(nativeEvent),
      );
      this.eventListeners.set(nativeEvent, subscription);
    }
  }

  private createEventHandler(nativeEvent: FlowEventIdType) {
    return (parsedEvent: ParsedFlowEvent | null) => {
      if (!parsedEvent) {
        return;
      }

      const eventViewId = parsedEvent.view.id;
      if (eventViewId !== this.viewId) {
        return; // Event for different view
      }

      const ctx = new LogContext();
      const log = ctx.event({ methodName: nativeEvent });
      log.start(() => ({ viewId: eventViewId, eventId: parsedEvent.id }));

      // Resolve handler name from event
      const resolver = NATIVE_EVENT_RESOLVER[nativeEvent];
      if (!resolver) {
        log.failed(() => ({ reason: 'no_resolver', nativeEvent }));
        return;
      }

      const resolvedHandler = resolver(parsedEvent);
      if (!resolvedHandler) {
        // Event doesn't match any handler (e.g., unknown action type)
        return;
      }

      // TypeScript doesn't narrow the type after the null check, so we assert it
      const handlerName = resolvedHandler as EventName;

      // Permission is an async round-trip handler: it returns a Promise and
      // must NOT go through the synchronous boolean/close path.
      if (handlerName === 'onRequestPermission') {
        void this.handlePermissionRequest(parsedEvent, ctx, log);
        return;
      }

      let hasError = false;

      // 1. Client handlers
      const handlerData = this.handlers.get(handlerName);
      if (handlerData) {
        const { handler, onRequestClose } = handlerData;
        const callbackArgs = extractFlowCallbackArgs(handlerName, parsedEvent);
        const callback = handler as (
          ...args: Parameters<FlowEventHandlers[typeof handlerName]>
        ) => boolean;

        try {
          const shouldClose = callback(...callbackArgs);

          if (shouldClose) {
            onRequestClose().catch(error => {
              log.failed(() => ({
                error,
                handlerName,
                viewId: eventViewId,
                eventId: parsedEvent.id,
                reason: 'on_request_close_failed',
              }));
            });
          }
        } catch (error) {
          hasError = true;
          log.failed(() => ({
            error,
            handlerName,
            viewId: eventViewId,
            eventId: parsedEvent.id,
            reason: 'handler_error',
          }));
        }
      }

      // 2. Internal handlers
      const internalHandlerData = this.internalHandlers.get(handlerName);
      if (internalHandlerData) {
        try {
          internalHandlerData.handler(parsedEvent);
        } catch (error) {
          hasError = true;
          log.failed(() => ({
            error,
            handlerName: `${handlerName} (internal)`,
            viewId: eventViewId,
            eventId: parsedEvent.id,
            reason: 'internal_handler_failed',
          }));
        }
      }

      if (!hasError) {
        log.success(() => ({ viewId: eventViewId, eventId: parsedEvent.id }));
      }
    };
  }

  private async handlePermissionRequest(
    event: ParsedFlowEvent,
    ctx: LogContext,
    log: LogScope,
  ): Promise<void> {
    if (event.id !== FlowEventId.DidRequestPermission) {
      return;
    }

    const handlerData = this.handlers.get('onRequestPermission');
    if (!handlerData) {
      return;
    }

    const handler =
      handlerData.handler as FlowEventHandlers['onRequestPermission'];

    let status: FlowPermissionStatus = 'unavailable';
    let detail: string | undefined;
    try {
      const response = await handler(event.permission, event.customArgs);
      status = response.status;
      detail = response.detail;
    } catch (error) {
      log.failed(() => ({
        error,
        viewId: event.view.id,
        eventId: event.id,
        reason: 'permission_handler_failed',
      }));
    }

    const body = JSON.stringify({
      method: 'did_request_permission_response',
      request_id: event.requestId,
      status,
      detail,
    } satisfies Req['DidRequestPermissionResponse.Request']);

    try {
      await $bridge.request(
        'did_request_permission_response',
        body,
        'Void',
        ctx,
      );
      log.success(() => ({ requestId: event.requestId, status }));
    } catch (error) {
      log.failed(() => ({
        error,
        viewId: event.view.id,
        eventId: event.id,
        reason: 'permission_response_failed',
      }));
    }
  }

  public removeAllListeners() {
    this.eventListeners.forEach(subscription => subscription.remove());
    this.eventListeners.clear();
    this.handlers.clear();
    this.internalHandlers.clear();
  }
}
