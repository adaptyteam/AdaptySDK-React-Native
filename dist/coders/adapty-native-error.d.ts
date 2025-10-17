import type { AdaptyNativeError } from '../types/bridge';
import type { ErrorConverter } from './error-coder';
import type { Properties } from './types';
import type { Def } from '@/types/schema';
import { SimpleCoder } from './coder';
import { AdaptyError } from '../adapty-error';
type Model = AdaptyNativeError;
type Serializable = Def['AdaptyError'];
export declare class AdaptyNativeErrorCoder extends SimpleCoder<Model, Serializable> implements ErrorConverter<Model> {
    type: 'error';
    protected properties: Properties<Model, Serializable>;
    getError(data: Model): AdaptyError;
}
export {};
//# sourceMappingURL=adapty-native-error.d.ts.map