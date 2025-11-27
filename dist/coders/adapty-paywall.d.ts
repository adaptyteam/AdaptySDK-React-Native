import type { AdaptyPaywall } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';
type Model = AdaptyPaywall;
type CodableModel = Omit<Model, 'hasViewConfiguration' | 'productIdentifiers'>;
type Serializable = Def['AdaptyPaywall'];
export declare class AdaptyPaywallCoder extends Coder<Model, CodableModel, Serializable> {
    protected properties: Properties<CodableModel, Serializable>;
    decode(data: Serializable): Model;
    encode(data: Model): Serializable;
}
export {};
//# sourceMappingURL=adapty-paywall.d.ts.map