import type { AdaptyProduct } from '../types';
import { Coder } from './coder';
import { AdaptyProductSubscriptionPeriodCoder } from './adapty-product-subscription-period';
import { AdaptyProductDiscountCoder } from './adapty-product-discount';
import { Properties } from './types';
import { ArrayCoder } from './array';

type Model = AdaptyProduct;
type Serializable = Record<string, any>;

export class AdaptyProductCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    // version: {
    //   key: 'version',
    //   required: true,
    //   type: 'string',
    // },
    vendorProductId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    localizedDescription: {
      key: 'localized_description',
      required: true,
      type: 'string',
    },
    localizedTitle: {
      key: 'localized_title',
      required: true,
      type: 'string',
    },
    price: {
      key: 'price',
      required: true,
      type: 'number',
    },
    currencyCode: {
      key: 'currency_code',
      required: false,
      type: 'string',
    },
    currencySymbol: {
      key: 'currency_symbol',
      required: false,
      type: 'string',
    },
    subscriptionPeriod: {
      key: 'subscription_period',
      required: false,
      type: 'object',
      converter: new AdaptyProductSubscriptionPeriodCoder(),
    },
    introductoryDiscount: {
      key: 'introductory_discount',
      required: false,
      type: 'object',
      converter: new AdaptyProductDiscountCoder(),
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
    variationId: {
      key: 'variation_id',
      required: false,
      type: 'string',
    },
    paywallABTestName: {
      key: 'paywall_ab_test_name',
      required: false,
      type: 'string',
    },
    paywallName: {
      key: 'paywall_name',
      required: false,
      type: 'string',
    },
    ios: {
      regionCode: {
        key: 'region_code',
        required: false,
        type: 'string',
      },
      promotionalOfferId: {
        key: 'promotional_offer_id',
        required: false,
        type: 'string',
      },
      promotionalOfferEligibility: {
        key: 'promotional_offer_eligibility',
        required: false,
        type: 'boolean',
      },
      isFamilyShareable: {
        key: 'is_family_shareable',
        required: false,
        type: 'boolean',
      },
      subscriptionGroupIdentifier: {
        key: 'subscription_group_identifier',
        required: false,
        type: 'string',
      },
      discounts: {
        key: 'discounts',
        required: false,
        type: 'array',
        converter: new ArrayCoder(AdaptyProductDiscountCoder as any),
      },
    },
    android: {
      freeTrialPeriod: {
        key: 'free_trial_period',
        required: false,
        type: 'object',
        converter: new AdaptyProductSubscriptionPeriodCoder(),
      },
      localizedFreeTrialPeriod: {
        key: 'localized_free_trial_period',
        required: false,
        type: 'string',
      },
    },
  };
}
