import type { AdaptyDiscountPhase, AdaptySubscriptionOffer } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptyDiscountPhaseCoder } from './adapty-discount-phase';
import { ArrayCoder } from './array';
import { AdaptySubscriptionOfferCoder } from '@/coders/adapty-subscription-offer';
import { AdaptySubscriptionOfferIdCoder } from '@/coders/adapty-subscription-offer-identifier';

type Model = AdaptySubscriptionOffer;
const mocks: Def['AdaptySubscriptionOffer'][] = [
  {
    offer_identifier: {
      type: 'introductory',
      id: 'test_intro_offer',
    },
    phases: [
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
    offer_tags: ['tag1', 'tag2'],
  },
  {
    offer_identifier: {
      type: 'promotional',
      id: 'test_promo_offer',
    },
    phases: [
      {
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
    ],
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _offerId = new AdaptySubscriptionOfferIdCoder();
  const _discounts = new ArrayCoder<
    AdaptyDiscountPhase,
    AdaptyDiscountPhaseCoder
  >(AdaptyDiscountPhaseCoder);

  return {
    identifier: _offerId.decode(mock.offer_identifier),
    phases: _discounts.decode(mock.phases),
    ...(mock.offer_tags && {
      android: {
        offerTags: mock.offer_tags,
      },
    }),
  };
}

describe('AdaptySubscriptionOfferCoder', () => {
  let coder: AdaptySubscriptionOfferCoder;

  beforeEach(() => {
    coder = new AdaptySubscriptionOfferCoder();
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
