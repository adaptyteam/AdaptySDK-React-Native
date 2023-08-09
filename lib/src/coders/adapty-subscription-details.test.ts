import type { AdaptyDiscountPhase, AdaptySubscriptionDetails } from '@/types';
import type { Schema } from '@/types/schema';
import { AdaptySubscriptionDetailsCoder } from './adapty-subscription-details';
import { AdaptySubscriptionPeriodCoder } from './adapty-subscription-period';
import { AdaptyDiscountPhaseCoder } from './adapty-discount-phase';
import { ArrayCoder } from './array';

type Model = AdaptySubscriptionDetails;
const mocks: Required<
  Schema['Output.AdaptyPaywallProduct']
>['subscription_details'][] = [
  {
    subscription_group_identifier: 'group1',
    android_base_plan_id: 'androidPlan1',
    introductory_offer_eligibility: 'eligible',
    android_offer_tags: ['tag1', 'tag2'],
    renewal_type: 'autorenewable',
    subscription_period: {
      unit: 'year',
      number_of_units: 1,
    },
    localized_subscription_period: '1 year',
    introductory_offer_phases: [
      {
        price: {
          amount: 49.99,
          currency_code: 'USD',
          currency_symbol: '$',
          localized_string: '$49.99',
        },
        number_of_periods: 2,
        payment_mode: 'pay_as_you_go',
        subscription_period: {
          unit: 'month',
          number_of_units: 3,
        },
        localized_subscription_period: '3 months',
        localized_number_of_periods: '2',
      },
    ],
    promotional_offer: {
      price: {
        amount: 29.99,
        currency_code: 'USD',
        currency_symbol: '$',
        localized_string: '$29.99',
      },
      number_of_periods: 1,
      payment_mode: 'free_trial',
      subscription_period: {
        unit: 'month',
        number_of_units: 1,
      },
      localized_subscription_period: '1 month',
      localized_number_of_periods: '1',
    },
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _period = new AdaptySubscriptionPeriodCoder();
  const _discount = new AdaptyDiscountPhaseCoder();
  const _discounts = new ArrayCoder<
    AdaptyDiscountPhase,
    AdaptyDiscountPhaseCoder
  >(AdaptyDiscountPhaseCoder);

  return {
    subscriptionPeriod: _period.decode(mock.subscription_period),
    ...(mock.localized_subscription_period && {
      localizedSubscriptionPeriod: mock.localized_subscription_period,
    }),
    ...(mock.introductory_offer_phases && {
      introductoryOffers: _discounts.decode(mock.introductory_offer_phases),
    }),
    ios: {
      subscriptionGroupIdentifier: mock.subscription_group_identifier,
      ...(mock.promotional_offer && {
        promotionalOffer: _discount.decode(mock.promotional_offer),
      }),
    },
    android: {
      basePlanId: mock.android_base_plan_id,
      introductoryOfferEligibility: mock.introductory_offer_eligibility,
      ...(mock.android_offer_id && {
        offerId: mock.android_offer_id,
      }),
      offerTags: mock.android_offer_tags,
      renewalType: mock.renewal_type,
    },
  };
}

describe('AdaptySubscriptionDetailsCoder', () => {
  let coder: AdaptySubscriptionDetailsCoder;

  beforeEach(() => {
    coder = new AdaptySubscriptionDetailsCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock);

    expect(decoded).toStrictEqual(toModel(mock));
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toStrictEqual(mock);
  });
});
