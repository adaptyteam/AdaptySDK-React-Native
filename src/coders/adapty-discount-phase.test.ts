import type { AdaptyDiscountPhase, OfferType } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptyDiscountPhaseCoder } from './adapty-discount-phase';
import { AdaptyPriceCoder } from './adapty-price';
import { AdaptySubscriptionPeriodCoder } from './adapty-subscription-period';

type Model = AdaptyDiscountPhase;
const mocks: Def['AdaptySubscriptionOffer.Phase'][] = [
  {
    localized_number_of_periods: '6 months',
    localized_subscription_period: '1 month',
    number_of_periods: 6,
    payment_mode: 'pay_as_you_go',
    price: {
      amount: 9.99,
      currency_code: 'USD',
      currency_symbol: '$',
      localized_string: '$9.99',
    },
    subscription_period: { unit: 'month', number_of_units: 1 },
  },
  {
    number_of_periods: 2,
    payment_mode: 'pay_up_front',
    price: {
      amount: 59.99,
      currency_code: 'EUR',
      currency_symbol: '€',
      localized_string: '€59.99',
    },
    subscription_period: { unit: 'year', number_of_units: 1 },
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _price = new AdaptyPriceCoder();
  const _subscription = new AdaptySubscriptionPeriodCoder();

  return {
    numberOfPeriods: mock.number_of_periods,
    paymentMode: mock.payment_mode as OfferType,
    price: _price.decode(mock.price),
    subscriptionPeriod: _subscription.decode(mock.subscription_period),
    ...(mock.localized_number_of_periods && {
      localizedNumberOfPeriods: mock.localized_number_of_periods,
    }),
    ...(mock.localized_subscription_period && {
      localizedSubscriptionPeriod: mock.localized_subscription_period,
    }),
  };
}

describe('AdaptyDiscountPhaseCoder', () => {
  let coder: AdaptyDiscountPhaseCoder;

  beforeEach(() => {
    coder = new AdaptyDiscountPhaseCoder();
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
