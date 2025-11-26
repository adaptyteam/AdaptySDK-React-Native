import type { AdaptyPurchaseResult } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyPurchaseResult;
type Serializable = Def['AdaptyPurchaseResult'];
export declare class AdaptyPurchaseResultCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
    decode(data: Serializable): Model;
    encode(data: Model): Serializable;
}
export {};
//# sourceMappingURL=adapty-purchase-result.d.ts.map