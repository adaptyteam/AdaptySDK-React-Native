import type { EventHandlers } from './types';
import { $bridge } from '@/bridge';
import { EmitterSubscription } from 'react-native';
import {
  ParsedPaywallEvent,
  PaywallEventId,
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
      config: (typeof HANDLER_TO_EVENT_CONFIG)[EventName];
      onRequestClose: () => Promise<void>;
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
    return (parsedEvent: ParsedPaywallEvent | null) => {
      if (!parsedEvent) {
        return;
      }

      const eventViewId = parsedEvent.view.id;
      if (this.viewId !== eventViewId) {
        return;
      }

      const ctx = new LogContext();
      const log = ctx.event({ methodName: config.nativeEvent });
      log.start({ viewId: eventViewId, eventId: parsedEvent.id });

      // Get all possible handler names for this native event
      const possibleHandlers =
        NATIVE_EVENT_TO_HANDLERS[config.nativeEvent] || [];

      let hasError = false;
      for (const handlerName of possibleHandlers) {
        const handlerData = this.handlers.get(handlerName);
        if (!handlerData) {
          continue; // Handler not registered for this view
        }

        const {
          handler,
          config: handlerConfig,
          onRequestClose,
        } = handlerData;

        // Filter by action type for DidPerformAction events
        if (
          handlerConfig.propertyMap &&
          parsedEvent.id === PaywallEventId.DidPerformAction &&
          parsedEvent.action.type !== handlerConfig.propertyMap['action']
        ) {
          continue;
        }

        const callbackArgs = extractCallbackArgs(handlerName, parsedEvent);
        const callback = handler as (
          ...args: ExtractedArgs<typeof handlerName>
        ) => boolean;
        let shouldClose = false;
        try {
          shouldClose = callback(...callbackArgs);
        } catch (error) {
          hasError = true;
          shouldClose = true;
          log.failed({
            error,
            handlerName,
            viewId: eventViewId,
            eventId: parsedEvent.id,
            reason: 'user_handler_failed',
          });
        }

        if (shouldClose) {
          onRequestClose().catch(error => {
            log.failed({
              error,
              handlerName,
              viewId: eventViewId,
              eventId: parsedEvent.id,
              reason: 'on_request_close_failed',
            });
          });
        }
      }

      if (!hasError) {
        log.success({ viewId: eventViewId, eventId: parsedEvent.id });
      }
    };
  }

  public removeAllListeners() {
    this.eventListeners.forEach(subscription => subscription.remove());
    this.eventListeners.clear();
    this.handlers.clear();
  }
}

type UiEventMapping = {
  [nativeEventId: string]: {
    handlerName: keyof EventHandlers;
    propertyMap?: {
      [key: string]: string;
    };
  }[];
};

const UI_EVENT_MAPPINGS: UiEventMapping = {
  paywall_view_did_perform_action: [
    {
      handlerName: 'onCloseButtonPress',
      propertyMap: {
        action: 'close',
      },
    },
    {
      handlerName: 'onAndroidSystemBack',
      propertyMap: {
        action: 'system_back',
      },
    },
    {
      handlerName: 'onUrlPress',
      propertyMap: {
        action: 'open_url',
      },
    },
    {
      handlerName: 'onCustomAction',
      propertyMap: {
        action: 'custom',
      },
    },
  ],
  paywall_view_did_select_product: [{ handlerName: 'onProductSelected' }],
  paywall_view_did_start_purchase: [{ handlerName: 'onPurchaseStarted' }],
  paywall_view_did_finish_purchase: [{ handlerName: 'onPurchaseCompleted' }],
  paywall_view_did_fail_purchase: [{ handlerName: 'onPurchaseFailed' }],
  paywall_view_did_start_restore: [{ handlerName: 'onRestoreStarted' }],
  paywall_view_did_appear: [{ handlerName: 'onPaywallShown' }],
  paywall_view_did_disappear: [{ handlerName: 'onPaywallClosed' }],
  paywall_view_did_finish_web_payment_navigation: [
    { handlerName: 'onWebPaymentNavigationFinished' },
  ],
  paywall_view_did_finish_restore: [{ handlerName: 'onRestoreCompleted' }],
  paywall_view_did_fail_restore: [{ handlerName: 'onRestoreFailed' }],
  paywall_view_did_fail_rendering: [{ handlerName: 'onRenderingFailed' }],
  paywall_view_did_fail_loading_products: [
    { handlerName: 'onLoadingProductsFailed' },
  ],
};

const HANDLER_TO_EVENT_CONFIG: Record<
  EventName,
  {
    nativeEvent: string;
    propertyMap?: { [key: string]: string };
    handlerName: EventName;
  }
> = Object.entries(UI_EVENT_MAPPINGS).reduce(
  (acc, [nativeEvent, mappings]) => {
    mappings.forEach(({ handlerName, propertyMap }) => {
      acc[handlerName] = {
        nativeEvent,
        propertyMap,
        handlerName,
      };
    });
    return acc;
  },
  {} as Record<
    EventName,
    {
      nativeEvent: string;
      propertyMap?: { [key: string]: string };
      handlerName: EventName;
    }
  >,
);

// Reverse mapping: nativeEvent -> EventName[]
const NATIVE_EVENT_TO_HANDLERS: Record<string, EventName[]> = Object.entries(
  HANDLER_TO_EVENT_CONFIG,
).reduce(
  (acc, [handlerName, config]) => {
    if (!acc[config.nativeEvent]) {
      acc[config.nativeEvent] = [];
    }
    const handlers = acc[config.nativeEvent];
    if (handlers) {
      handlers.push(handlerName as EventName);
    }
    return acc;
  },
  {} as Record<string, EventName[]>,
);

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
      if (
        handlerName === 'onUrlPress' ||
        handlerName === 'onCustomAction'
      ) {
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
