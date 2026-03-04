import { EmitterSubscription } from 'react-native';
import { LogContext } from '../logger';
import type { AdaptyType } from '../coders/parse';
import type { AdaptyMockConfig } from './types';
/**
 * Mock implementation of NativeRequestHandler
 * Returns mock data instead of calling native modules
 */
export declare class MockRequestHandler<Method extends string, Params extends string> {
    private store;
    private emitter;
    private listeners;
    constructor(config?: AdaptyMockConfig);
    /**
     * Mock request handler that returns appropriate mock data
     *
     * @param method - The SDK method name (e.g., 'make_purchase', 'get_paywall_products')
     * @param params - JSON string containing request parameters in cross_platform.yaml format
     * @param _resultType - Expected result type (not used in mock)
     * @param ctx - Log context for debugging
     *
     * @remarks
     * The `params` argument contains JSON-stringified data that follows the request format
     * defined in `cross_platform.yaml`. For example, for 'make_purchase' method, it contains
     * `MakePurchase.Request` structure with `product` field in `AdaptyPaywallProduct.Request`
     * format (snake_case, minimal field set).
     *
     * @returns Promise resolving to mock data in the expected format
     */
    request<T>(method: Method, params: Params, _resultType: AdaptyType, ctx?: LogContext): Promise<T>;
    /**
     * Add event listener for mock events
     */
    addRawEventListener<Event extends string, Cb extends (event: any) => void | Promise<void>>(event: Event, cb: Cb): EmitterSubscription;
    /**
     * Add typed event listener
     */
    addEventListener<Event extends string, CallbackData>(event: Event, cb: (this: {
        rawValue: any;
    }, data: CallbackData) => void | Promise<void>): EmitterSubscription;
    /**
     * Remove all event listeners
     */
    removeAllEventListeners(): void;
}
//# sourceMappingURL=mock-request-handler.d.ts.map