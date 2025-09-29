import { EmitterSubscription, NativeEventEmitter, NativeModules } from 'react-native';
import { LogContext } from '../logger';
import { AdaptyType } from '../coders/parse';
export declare class NativeRequestHandler<Method extends string, Params extends string> {
    _module: (typeof NativeModules)[string];
    _request: (method: Method, params: Record<string, string>) => Promise<string>;
    _emitter: NativeEventEmitter;
    _listeners: Set<EmitterSubscription>;
    constructor(moduleName: string);
    request<T>(method: Method, params: Params, resultType: AdaptyType, ctx?: LogContext): Promise<T>;
    addRawEventListener<Event extends string, Cb extends (event: any) => void | Promise<void>>(event: Event, cb: Cb): EmitterSubscription;
    addEventListener<Event extends string, CallbackData>(event: Event, cb: (this: {
        rawValue: any;
    }, data: CallbackData) => void | Promise<void>): EmitterSubscription;
    removeAllEventListeners(): void;
}
//# sourceMappingURL=native-request-handler.d.ts.map