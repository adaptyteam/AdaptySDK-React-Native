import { AdaptySubscriptionOfferId } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptySubscriptionOfferId;
type Serializable = Def['AdaptySubscriptionOffer.Identifier'];
export declare class AdaptySubscriptionOfferIdCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-subscription-offer-identifier.d.ts.map