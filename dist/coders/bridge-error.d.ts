import { AdaptyBridgeError } from '../types/bridge';
import { SimpleCoder } from './coder';
import { Properties } from './types';
import { ErrorConverter } from './error-coder';
import { AdaptyError } from '../adapty-error';
type Model = AdaptyBridgeError;
type Serializable = Record<string, any>;
export declare class BridgeErrorCoder extends SimpleCoder<Model, Serializable> implements ErrorConverter<Model> {
    type: 'error';
    protected properties: Properties<Model, Serializable>;
    getError(data: Model): AdaptyError;
}
export {};
//# sourceMappingURL=bridge-error.d.ts.map