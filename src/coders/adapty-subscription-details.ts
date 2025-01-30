import type { AdaptySubscriptionDetails } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptySubscriptionPeriodCoder } from './adapty-subscription-period';
import { AdaptySubscriptionOfferCoder } from '@/coders/adapty-subscription-offer';

type Model = AdaptySubscriptionDetails;
type Serializable = Def['AdaptyPaywallProduct.Subscription'];

export class AdaptySubscriptionDetailsCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    subscriptionPeriod: {
      key: 'period',
      required: true,
      type: 'object',
      converter: new AdaptySubscriptionPeriodCoder(),
    },
    localizedSubscriptionPeriod: {
      key: 'localized_period',
      required: false,
      type: 'string',
    },
    offer: {
      key: 'offer',
      required: false,
      type: 'object',
      converter: new AdaptySubscriptionOfferCoder(),
    },
    ios: {
      subscriptionGroupIdentifier: {
        key: 'group_identifier',
        required: false,
        type: 'string',
      },
    },
    android: {
      basePlanId: {
        key: 'base_plan_id',
        required: true,
        type: 'string',
      },
      renewalType: {
        key: 'renewal_type',
        required: false,
        type: 'string',
      },
    },
  };

  override decode(data: Serializable): Model {
    const baseResult = super.decode(data);
    const propToRemove = data.base_plan_id ? 'ios' : 'android';
    const { [propToRemove]: _, ...partialData } = baseResult;
    return partialData;
  }
}
