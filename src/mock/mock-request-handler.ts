import { EmitterSubscription } from 'react-native';
import { LogContext } from '@/logger';
import type { AdaptyType } from '@/coders/parse';
import { MockStore } from './mock-store';
import type { AdaptyMockConfig } from './types';
import { createMockPurchaseResult } from './mock-data';
import type { AdaptyPaywallProduct } from '@/types';
import { generateId } from '@/utils/generate-id';

type EventCallback = (...args: any[]) => void | Promise<void>;

/**
 * Simple event emitter for mock events
 */
class SimpleEventEmitter {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  addListener(event: string, callback: EventCallback): EmitterSubscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return {
      remove: () => {
        this.listeners.get(event)?.delete(callback);
      },
    } as EmitterSubscription;
  }

  emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          const ctx = new LogContext();
          const log = ctx.event({ methodName: `mock/${event}` });
          log.failed({ error });
        }
      });
    }
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

/**
 * Mock implementation of NativeRequestHandler
 * Returns mock data instead of calling native modules
 */
export class MockRequestHandler<Method extends string, Params extends string> {
  private store: MockStore;
  private emitter: SimpleEventEmitter;
  private listeners: Set<EmitterSubscription>;

  constructor(config: AdaptyMockConfig = {}) {
    this.store = new MockStore(config);
    this.emitter = new SimpleEventEmitter();
    this.listeners = new Set();
  }

  /**
   * Mock request handler that returns appropriate mock data
   */
  async request<T>(
    method: Method,
    params: Params,
    _resultType: AdaptyType,
    ctx?: LogContext,
  ): Promise<T> {
    const log = ctx?.bridge({ methodName: `mock/${method}` });
    log?.start({ method, params });

    try {
      let result: any;
      const parsedParams = JSON.parse(params as string);

      switch (method) {
        case 'activate':
          this.store.setActivated(true);
          result = undefined; // void
          break;

        case 'is_activated':
          result = this.store.getIsActivated();
          break;

        case 'get_profile':
          result = this.store.getProfile();
          break;

        case 'get_paywall':
        case 'get_paywall_for_default_audience':
          const paywallPlacementId = parsedParams.placement_id;
          result = this.store.getPaywall(paywallPlacementId);
          break;

        case 'get_paywall_products':
          const paywall = parsedParams.paywall;
          const placementId: string =
            paywall?.placement?.developer_id || 'default';
          const variationId: string =
            paywall?.variation_id || 'mock_variation_id';
          result = this.store.getPaywallProducts(placementId, variationId);
          break;

        case 'get_onboarding':
        case 'get_onboarding_for_default_audience':
          const onboardingPlacementId = parsedParams.placement_id;
          result = this.store.getOnboarding(onboardingPlacementId);
          break;

        case 'make_purchase':
          const product = parsedParams.product as AdaptyPaywallProduct;
          const updatedProfile = this.store.makePurchase(product);
          result = createMockPurchaseResult(updatedProfile);

          // Emit profile update event
          setTimeout(() => {
            this.emitter.emit(
              'did_load_latest_profile',
              JSON.stringify(updatedProfile),
            );
          }, 100);
          break;

        case 'restore_purchases':
          result = this.store.getProfile();
          break;

        case 'identify':
          const customerUserId = parsedParams.customer_user_id;
          this.store.identify(customerUserId);
          result = undefined; // void
          break;

        case 'logout':
          this.store.logout();
          result = undefined; // void
          break;

        case 'update_profile':
          const profileParams = parsedParams.params;
          this.store.updateProfile(profileParams);
          result = undefined; // void
          break;

        case 'log_show_paywall':
        case 'set_log_level':
        case 'update_attribution_data':
        case 'set_fallback':
        case 'set_integration_identifiers':
        case 'report_transaction':
        case 'present_code_redemption_sheet':
        case 'update_collecting_refund_data_consent':
        case 'update_refund_preference':
        case 'open_web_paywall':
          // These methods don't return anything meaningful in mock mode
          result = undefined; // void
          break;

        case 'create_web_paywall_url':
          result = 'https://mock-web-paywall-url.adapty.io';
          break;

        case 'get_current_installation_status':
          result = {
            status: 'determined',
            details: {
              installTime: new Date(),
              appLaunchCount: 1,
            },
          };
          break;

        // UI methods
        case 'adapty_ui_create_paywall_view':
          result = { id: `mock-paywall-${generateId()}` };
          break;
        case 'adapty_ui_create_onboarding_view':
          result = { id: `mock-onboarding-${generateId()}` };
          break;
        case 'adapty_ui_present_paywall_view':
        case 'adapty_ui_present_onboarding_view':
        case 'adapty_ui_dismiss_paywall_view':
        case 'adapty_ui_dismiss_onboarding_view':
        case 'adapty_ui_activate':
          result = undefined; // void
          break;
        case 'adapty_ui_show_dialog':
          result = 'primary';
          break;

        default:
          result = undefined;
      }

      log?.success({ result });
      return result as T;
    } catch (error) {
      log?.success({ error });
      throw error;
    }
  }

  /**
   * Add event listener for mock events
   */
  addRawEventListener<
    Event extends string,
    Cb extends (event: any) => void | Promise<void>,
  >(event: Event, cb: Cb): EmitterSubscription {
    const subscription = this.emitter.addListener(event, cb);
    this.listeners.add(subscription);
    return subscription;
  }

  /**
   * Add typed event listener
   */
  addEventListener<Event extends string, CallbackData>(
    event: Event,
    cb: (this: { rawValue: any }, data: CallbackData) => void | Promise<void>,
  ): EmitterSubscription {
    const wrappedCallback = (data: string) => {
      const ctx = new LogContext();
      const log = ctx.event({ methodName: `mock/${event}` });
      log.start({ data });

      try {
        const parsed = JSON.parse(data);
        cb.call({ rawValue: parsed }, parsed);
      } catch (error) {
        log.failed({ error });
        cb.call({ rawValue: data }, data as any);
      }
    };

    const subscription = this.emitter.addListener(event, wrappedCallback);
    this.listeners.add(subscription);
    return subscription;
  }

  /**
   * Remove all event listeners
   */
  removeAllEventListeners(): void {
    this.listeners.forEach(listener => listener.remove());
    this.listeners.clear();
    this.emitter.removeAllListeners();
  }
}
