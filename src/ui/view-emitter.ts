import type { EventHandlers } from './types';
import { $bridge } from '@/bridge';
import { EmitterSubscription } from 'react-native';
import {
  ParsedPaywallEvent,
  PaywallEventId,
  PaywallEventIdType,
} from '@/types/paywall-events';
import { LogContext } from '@/logger';

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
        const callbackArgs = extractCallbackArgs(handlerName, parsedEvent);
        const callback = handler as (
          ...args: ExtractedArgs<typeof handlerName>
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

/**
 * Resolves native event to handler name based on event data
 */
const NATIVE_EVENT_RESOLVER: Record<
  PaywallEventIdType,
  (event: ParsedPaywallEvent) => EventName | null
> = {
  paywall_view_did_perform_action: event => {
    if (event.id !== PaywallEventId.DidPerformAction) return null;

    const actionMap: Record<string, EventName> = {
      close: 'onCloseButtonPress',
      system_back: 'onAndroidSystemBack',
      open_url: 'onUrlPress',
      custom: 'onCustomAction',
    };

    return actionMap[event.action.type] || null;
  },
  paywall_view_did_appear: () => 'onPaywallShown',
  paywall_view_did_disappear: () => 'onPaywallClosed',
  paywall_view_did_select_product: () => 'onProductSelected',
  paywall_view_did_start_purchase: () => 'onPurchaseStarted',
  paywall_view_did_finish_purchase: () => 'onPurchaseCompleted',
  paywall_view_did_fail_purchase: () => 'onPurchaseFailed',
  paywall_view_did_start_restore: () => 'onRestoreStarted',
  paywall_view_did_finish_restore: () => 'onRestoreCompleted',
  paywall_view_did_fail_restore: () => 'onRestoreFailed',
  paywall_view_did_fail_rendering: () => 'onRenderingFailed',
  paywall_view_did_fail_loading_products: () => 'onLoadingProductsFailed',
  paywall_view_did_finish_web_payment_navigation: () =>
    'onWebPaymentNavigationFinished',
};

/**
 * Maps handler name to native event name
 * Used in addListener/addInternalListener to subscribe to correct native event
 */
const HANDLER_TO_NATIVE_EVENT: Record<EventName, PaywallEventIdType> = {
  onCloseButtonPress: 'paywall_view_did_perform_action',
  onAndroidSystemBack: 'paywall_view_did_perform_action',
  onUrlPress: 'paywall_view_did_perform_action',
  onCustomAction: 'paywall_view_did_perform_action',
  onPaywallShown: 'paywall_view_did_appear',
  onPaywallClosed: 'paywall_view_did_disappear',
  onProductSelected: 'paywall_view_did_select_product',
  onPurchaseStarted: 'paywall_view_did_start_purchase',
  onPurchaseCompleted: 'paywall_view_did_finish_purchase',
  onPurchaseFailed: 'paywall_view_did_fail_purchase',
  onRestoreStarted: 'paywall_view_did_start_restore',
  onRestoreCompleted: 'paywall_view_did_finish_restore',
  onRestoreFailed: 'paywall_view_did_fail_restore',
  onRenderingFailed: 'paywall_view_did_fail_rendering',
  onLoadingProductsFailed: 'paywall_view_did_fail_loading_products',
  onWebPaymentNavigationFinished:
    'paywall_view_did_finish_web_payment_navigation',
};

type ExtractedArgs<T extends keyof EventHandlers> = Parameters<
  EventHandlers[T]
>;

function extractCallbackArgs<T extends keyof EventHandlers>(
  handlerName: T,
  event: ParsedPaywallEvent,
): ExtractedArgs<T> {
  switch (event.id) {
    case PaywallEventId.DidSelectProduct:
      return [event.productId] as ExtractedArgs<T>;

    case PaywallEventId.DidStartPurchase:
      return [event.product] as ExtractedArgs<T>;

    case PaywallEventId.DidFinishPurchase:
      return [event.purchaseResult, event.product] as ExtractedArgs<T>;

    case PaywallEventId.DidFailPurchase:
      return [event.error, event.product] as ExtractedArgs<T>;

    case PaywallEventId.DidFinishRestore:
      return [event.profile] as ExtractedArgs<T>;

    case PaywallEventId.DidFailRestore:
    case PaywallEventId.DidFailRendering:
    case PaywallEventId.DidFailLoadingProducts:
      return [event.error] as ExtractedArgs<T>;

    case PaywallEventId.DidPerformAction:
      // For DidPerformAction, different handlers need different arguments
      if (handlerName === 'onUrlPress' || handlerName === 'onCustomAction') {
        return [event.action.value ?? ''] as ExtractedArgs<T>;
      }
      // onCloseButtonPress, onAndroidSystemBack don't take arguments
      return [] as ExtractedArgs<T>;

    case PaywallEventId.DidFinishWebPaymentNavigation:
      return [event.product, event.error] as unknown as ExtractedArgs<T>;

    case PaywallEventId.DidAppear:
    case PaywallEventId.DidDisappear:
    case PaywallEventId.DidStartRestore:
      return [] as ExtractedArgs<T>;
  }
}
