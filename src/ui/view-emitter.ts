import type { EventHandlers } from './types';
import { $bridge } from '@/bridge';
import { EmitterSubscription } from 'react-native';
import {
  ParsedPaywallEvent,
  PaywallEventIdType,
} from '@/types/paywall-events';
import { LogContext } from '@/logger';
import {
  NATIVE_EVENT_RESOLVER,
  HANDLER_TO_NATIVE_EVENT,
  extractPaywallCallbackArgs,
} from '@adapty/core';

type EventName = keyof EventHandlers;

// Emitting view ID is passed in JSON["_view_id"]
// So that no all visible views would emit this event
// Must be in every callback response in the form of UUID string
// const KEY_VIEW = 'view_id';

/**
 * ViewEmitter manages event handlers for paywall view events.
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
export class ViewEmitter {
  private viewId: string;
  private eventListeners: Map<string, EmitterSubscription> = new Map();
  private handlers: Map<
    EventName,
    {
      handler: EventHandlers[EventName];
      onRequestClose: () => Promise<void>;
    }
  > = new Map();
  private internalHandlers: Map<
    EventName,
    {
      handler: (event: ParsedPaywallEvent) => void;
    }
  > = new Map();

  constructor(viewId: string) {
    this.viewId = viewId;
  }

  public addListener(
    event: EventName,
    callback: EventHandlers[EventName],
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
    callback: (event: ParsedPaywallEvent) => void,
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

  private createEventHandler(nativeEvent: PaywallEventIdType) {
    return (parsedEvent: ParsedPaywallEvent | null) => {
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

      let hasError = false;

      // 1. Client handlers
      const handlerData = this.handlers.get(handlerName);
      if (handlerData) {
        const { handler, onRequestClose } = handlerData;
        const callbackArgs = extractPaywallCallbackArgs(handlerName, parsedEvent);
        const callback = handler as (
          ...args: Parameters<EventHandlers[typeof handlerName]>
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

  public removeAllListeners() {
    this.eventListeners.forEach(subscription => subscription.remove());
    this.eventListeners.clear();
    this.handlers.clear();
    this.internalHandlers.clear();
  }
}

