import type { AdaptyDiscountPhase } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptySubscriptionPeriodCoder } from './adapty-subscription-period';
import { AdaptyPriceCoder } from './adapty-price';

type Model = AdaptyDiscountPhase;
type Serializable = Def['AdaptySubscriptionOffer.Phase'];

export class AdaptyDiscountPhaseCoder extends SimpleCoder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    localizedNumberOfPeriods: {
      key: 'localized_number_of_periods',
      required: false,
      type: 'string',
    },
    localizedSubscriptionPeriod: {
      key: 'localized_subscription_period',
      required: false,
      type: 'string',
    },
    numberOfPeriods: {
      key: 'number_of_periods',
      required: true,
      type: 'number',
    },
    paymentMode: { key: 'payment_mode', required: true, type: 'string' },
    price: {
      key: 'price',
      required: true,
      type: 'object',
      converter: new AdaptyPriceCoder(),
    },
    subscriptionPeriod: {
      key: 'subscription_period',
      required: true,
      type: 'object',
      converter: new AdaptySubscriptionPeriodCoder(),
    },
  };
}
