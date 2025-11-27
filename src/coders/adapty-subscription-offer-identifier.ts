import { AdaptySubscriptionOfferId } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';

type Model = AdaptySubscriptionOfferId;
type Serializable = Def['AdaptySubscriptionOffer.Identifier'];

export class AdaptySubscriptionOfferIdCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    type: {
      key: 'type',
      required: true,
      type: 'string',
    },
    id: {
      key: 'id',
      required: false,
      type: 'string',
    },
  };
}
