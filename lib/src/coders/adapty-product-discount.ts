import type { AdaptyProductDiscount } from '../types';
import { Coder } from './coder';
import { AdaptyProductSubscriptionPeriodCoder } from './adapty-product-subscription-period';
import { Properties } from './types';

type Model = AdaptyProductDiscount;
type Serializable = Record<string, any>;

export class AdaptyProductDiscountCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    price: {
      key: 'price',
      required: true,
      type: 'number',
    },
    subscriptionPeriod: {
      key: 'subscription_period',
      required: true,
      type: 'object',
      converter: new AdaptyProductSubscriptionPeriodCoder(),
    },
    numberOfPeriods: {
      key: 'number_of_periods',
      required: true,
      type: 'number',
    },
    localizedPrice: {
      key: 'localized_price',
      required: false,
      type: 'string',
    },
    localizedSubscriptionPeriod: {
      key: 'localized_subscription_period',
      required: false,
      type: 'string',
    },
    localizedNumberOfPeriods: {
      key: 'localized_number_of_periods',
      required: false,
      type: 'string',
    },
    ios: {
      identifier: {
        key: 'identifier',
        required: false,
        type: 'string',
      },
      paymentMode: {
        key: 'payment_mode',
        required: true,
        type: 'string',
      },
    },
  };
}
