import type { Def } from '@/types/schema';
import type { Properties } from './types';
import type { AdaptyProfileParameters } from '../types';
import { SimpleCoder } from './coder';
type Model = AdaptyProfileParameters;
type Serializable = Def['AdaptyProfileParameters'];
export declare class AdaptyProfileParametersCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-profile-parameters.d.ts.map