import { AdaptyPriceCoder } from './adapty-price';
import type { AdaptyPrice } from '@/types';
import type { Def } from '@/types/schema';

type Model = AdaptyPrice;
const mocks: Def['AdaptyPrice'][] = [
  {
    amount: 9.99,
    currency_code: 'USD',
    currency_symbol: '$',
    localized_string: '$9.99',
  },
  { amount: 9.99 },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    amount: mock.amount,
    ...(mock.currency_code && { currencyCode: mock.currency_code }),
    ...(mock.currency_symbol && { currencySymbol: mock.currency_symbol }),
    ...(mock.localized_string && { localizedString: mock.localized_string }),
  };
}

describe('AdaptyPriceCoder', () => {
  let coder: AdaptyPriceCoder;

  beforeEach(() => {
    coder = new AdaptyPriceCoder();
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
