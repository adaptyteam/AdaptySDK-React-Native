import type { AdaptyNonSubscription } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyNonSubscription;
type Serializable = Def['AdaptyProfile.NonSubscription'];
export declare class AdaptyNonSubscriptionCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-non-subscription.d.ts.map