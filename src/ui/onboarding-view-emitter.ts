import type { OnboardingEventHandlers } from './types';
import { $bridge } from '@/bridge';
import { EmitterSubscription } from 'react-native';
import { ParsedOnboardingEvent } from '@/types/onboarding-events';
import { LogContext } from '@/logger';
import {
  HANDLER_TO_EVENT_CONFIG,
  NATIVE_EVENT_TO_HANDLERS,
  extractOnboardingCallbackArgs,
} from '@adapty/core';

type EventName = keyof OnboardingEventHandlers;

// Emitting view ID is passed in JSON["_view_id"]
// So that no all visible views would emit this event
// Must be in every callback response in the form of UUID string
// const KEY_VIEW = 'view_id';

/**
 * OnboardingViewEmitter manages event handlers for onboarding view events.
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
export class OnboardingViewEmitter {
  private viewId: string;
  private eventListeners: Map<string, EmitterSubscription> = new Map();
  private handlers: Map<
    EventName,
    {
      handler: OnboardingEventHandlers[EventName];
      config: (typeof HANDLER_TO_EVENT_CONFIG)[EventName];
      onRequestClose: () => Promise<void>;
    }
  > = new Map();

  constructor(viewId: string) {
    this.viewId = viewId;
  }

  public addListener(
    event: EventName,
    callback: OnboardingEventHandlers[EventName],
    onRequestClose: () => Promise<void>,
  ): EmitterSubscription {
    const config = HANDLER_TO_EVENT_CONFIG[event];

    if (!config) {
      throw new Error(`No event config found for handler: ${event}`);
    }

    // Replace existing handler for this event type
    this.handlers.set(event, {
      handler: callback,
      config,
      onRequestClose,
    });

    if (!this.eventListeners.has(config.nativeEvent)) {
      const subscription = $bridge.addEventListener(
        config.nativeEvent,
        this.createEventHandler(config),
      );
      this.eventListeners.set(config.nativeEvent, subscription);
    }

    return this.eventListeners.get(config.nativeEvent)!;
  }

  private createEventHandler(
    config: (typeof HANDLER_TO_EVENT_CONFIG)[EventName],
  ) {
    return (parsedEvent: ParsedOnboardingEvent) => {
      const eventViewId = parsedEvent.view.id;
      if (this.viewId !== eventViewId) {
        return;
      }

      const ctx = new LogContext();
      const log = ctx.event({ methodName: config.nativeEvent });
      log.start(() => ({ viewId: eventViewId, eventId: parsedEvent.id }));

      // Get all possible handler names for this native event
      const possibleHandlers =
        NATIVE_EVENT_TO_HANDLERS[config.nativeEvent] || [];

      let hasError = false;
      for (const handlerName of possibleHandlers) {
        const handlerData = this.handlers.get(handlerName);
        if (!handlerData) {
          continue; // Handler not registered for this view
        }

        const { handler, onRequestClose } = handlerData;

        const callbackArgs = extractOnboardingCallbackArgs(
          handlerName,
          parsedEvent,
        );
        const callback = handler as (
          ...args: Parameters<OnboardingEventHandlers[typeof handlerName]>
        ) => boolean;
        let shouldClose = false;
        try {
          shouldClose = callback(...callbackArgs);
        } catch (error) {
          hasError = true;
          shouldClose = true;
          log.failed(() => ({
            error,
            handlerName,
            viewId: eventViewId,
            eventId: parsedEvent.id,
            reason: 'user_handler_failed',
          }));
        }

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
  }
}
