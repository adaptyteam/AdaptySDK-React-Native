import { AdaptySubscriptionPeriod } from '../types';
import { AdaptyProductSubscriptionPeriodCoder } from './adapty-product-subscription-period';

describe('AdaptyProductSubscriptionPeriodCoder', () => {
  it('should encode/decode', () => {
    const input = {
      number_of_units: 7,
      unit: 'day',
    };

    const coder = new AdaptyProductSubscriptionPeriodCoder();
    const result = coder.decode(input);

    expect(result).toEqual({
      numberOfUnits: 7,
      unit: 'day',
    } satisfies AdaptySubscriptionPeriod);

    const recoded = coder.encode(result);
    expect(input).toEqual(recoded);
  });
});
