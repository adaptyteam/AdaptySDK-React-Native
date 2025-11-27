import type { Properties } from './types';
import type { ProductReference } from '../types';
import type { Def } from '@/types/schema';
import { SimpleCoder } from './coder';
type Model = ProductReference;
type Serializable = Def['AdaptyPaywall.ProductReference'];
export declare class ProductReferenceCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=product-reference.d.ts.map