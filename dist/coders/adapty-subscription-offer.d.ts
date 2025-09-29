import type { AdaptySubscriptionOffer } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptySubscriptionOffer;
type Serializable = Def['AdaptySubscriptionOffer'];
export declare class AdaptySubscriptionOfferCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
    decode(data: Serializable): Model;
}
export {};
//# sourceMappingURL=adapty-subscription-offer.d.ts.map