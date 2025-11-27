import type { AdaptySubscription } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptySubscription;
type Serializable = Def['AdaptyProfile.Subscription'];
export declare class AdaptySubscriptionCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-subscription.d.ts.map