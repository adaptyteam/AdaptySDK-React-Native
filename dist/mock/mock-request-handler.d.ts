import { EmitterSubscription } from 'react-native';
import type { LogContext } from '../logger';
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