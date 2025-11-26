import type { AdaptyPaywallProduct } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyPaywallProduct;
type Serializable = Def['AdaptyPaywallProduct.Response'];
export declare class AdaptyPaywallProductCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
    getInput(data: Serializable): Def['AdaptyPaywallProduct.Request'];
}
export {};
//# sourceMappingURL=adapty-paywall-product.d.ts.map