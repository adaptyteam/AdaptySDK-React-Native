import type { AdaptySubscriptionDetails } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptySubscriptionDetails;
type Serializable = Def['AdaptyPaywallProduct.Subscription'];
export declare class AdaptySubscriptionDetailsCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
    decode(data: Serializable): Model;
}
export {};
//# sourceMappingURL=adapty-subscription-details.d.ts.map