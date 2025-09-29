import type { AdaptySubscriptionPeriod, ProductPeriod } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptySubscriptionPeriodCoder } from './adapty-subscription-period';

type Model = AdaptySubscriptionPeriod;
const mocks: Def['AdaptySubscriptionPeriod'][] = [
  { unit: 'day', number_of_units: 5 },
  { unit: 'week', number_of_units: 2 },
  { unit: 'month', number_of_units: 6 },
  { unit: 'year', number_of_units: 1 },
  { unit: 'unknown', number_of_units: 0 },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    numberOfUnits: mock.number_of_units,
    unit: mock.unit as ProductPeriod,
  };
}

describe('AdaptySubscriptionPeriodCoder', () => {
  let coder: AdaptySubscriptionPeriodCoder;

  beforeEach(() => {
    coder = new AdaptySubscriptionPeriodCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock);

    expect(decoded).toStrictEqual(toModel(mock));
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toEqual(mock);
  });
});
