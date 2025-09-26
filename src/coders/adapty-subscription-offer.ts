import type { AdaptySubscriptionOffer } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptySubscriptionOfferIdCoder } from '@/coders/adapty-subscription-offer-identifier';
import { ArrayCoder } from '@/coders/array';
import { AdaptyDiscountPhaseCoder } from '@/coders/adapty-discount-phase';

type Model = AdaptySubscriptionOffer;
type Serializable = Def['AdaptySubscriptionOffer'];

export class AdaptySubscriptionOfferCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    identifier: {
      key: 'offer_identifier',
      required: true,
      type: 'object',
      converter: new AdaptySubscriptionOfferIdCoder(),
    },
    phases: {
      key: 'phases',
      required: true,
      type: 'array',
      converter: new ArrayCoder(AdaptyDiscountPhaseCoder),
    },
    android: {
      offerTags: {
        key: 'offer_tags',
        required: false,
        type: 'array',
      },
    },
  };

  override decode(data: Serializable): Model {
    const baseResult = super.decode(data);
    if (!data.offer_tags) {
      const { android, ...partialData } = baseResult;
      return partialData;
    }
    return baseResult;
  }
}
