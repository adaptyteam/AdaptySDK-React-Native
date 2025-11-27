import type { AdaptyPrice } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyPrice;
type Serializable = Def['AdaptyPrice'];
export declare class AdaptyPriceCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-price.d.ts.map