import type { AdaptyDiscountPhase } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyDiscountPhase;
type Serializable = Def['AdaptySubscriptionOffer.Phase'];
export declare class AdaptyDiscountPhaseCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-discount-phase.d.ts.map