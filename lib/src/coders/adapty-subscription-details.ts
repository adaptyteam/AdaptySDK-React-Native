import type { AdaptySubscriptionDetails } from '@/types';
import type { Schema } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';
import { AdaptySubscriptionPeriodCoder } from './adapty-subscription-period';
import { AdaptyDiscountPhaseCoder } from './adapty-discount-phase';
import { ArrayCoder } from './array';

type Model = AdaptySubscriptionDetails;
type Serializable = Required<
  Schema['Output.AdaptyPaywallProduct']
>['subscription_details'];

export class AdaptySubscriptionDetailsCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    subscriptionPeriod: {
      key: 'subscription_period',
      required: true,
      type: 'object',
      converter: new AdaptySubscriptionPeriodCoder(),
    },
    localizedSubscriptionPeriod: {
      key: 'localized_subscription_period',
      required: false,
      type: 'string',
    },
    introductoryOffers: {
      key: 'introductory_offer_phases',
      required: false,
      type: 'array',
      converter: new ArrayCoder(AdaptyDiscountPhaseCoder),
    },
    ios: {
      subscriptionGroupIdentifier: {
        key: 'subscription_group_identifier',
        required: false,
        type: 'string',
      },
      promotionalOffer: {
        key: 'promotional_offer',
        required: false,
        type: 'object',
        converter: new AdaptyDiscountPhaseCoder(),
      },
    },
    android: {
      introductoryOfferEligibility: {
        key: 'introductory_offer_eligibility',
        required: true,
        type: 'string',
      },
      basePlanId: {
        key: 'android_base_plan_id',
        required: true,
        type: 'string',
      },
      offerTags: {
        key: 'android_offer_tags',
        required: false,
        type: 'array',
      },
      renewalType: {
        key: 'renewal_type',
        required: false,
        type: 'string',
      },
      offerId: {
        key: 'android_offer_id',
        required: false,
        type: 'string',
      },
    },
  };
}
