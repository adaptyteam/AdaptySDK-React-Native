import type { AdaptyProduct } from '@/types';
import { AdaptyProductCoder } from './adapty-product';

describe('AdaptyProductCoder', () => {
  let coder: AdaptyProductCoder;

  beforeEach(() => {
    coder = new AdaptyProductCoder();
  });

  it('should decode and encode back', () => {
    const input = {
      vendor_product_id: 'weekly.premium.599',
      subscription_period: {
        number_of_units: 7,
        unit: 'day',
      },
      region_code: 'US',
      is_family_shareable: false,
      localized_subscription_period: '1 week',
      currency_code: 'USD',
      localized_title: '1 Week Premium',
      paywall_name: '111',
      price: 5.99,
      paywall_ab_test_name: '111',
      subscription_group_identifier: '20770576',
      discounts: [],
      localized_price: '$5.99',
      localized_description: '1 Month Premium Description',
      currency_symbol: '$',
      variation_id: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
    };

    const result = coder.decode(input);

    expect(result).toEqual({
      vendorProductId: 'weekly.premium.599',
      subscriptionPeriod: {
        numberOfUnits: 7,
        unit: 'day',
      },
      ios: {
        regionCode: 'US',
        isFamilyShareable: false,
        discounts: [],
        subscriptionGroupIdentifier: '20770576',
      },
      android: {},
      localizedSubscriptionPeriod: '1 week',
      currencyCode: 'USD',
      localizedTitle: '1 Week Premium',
      paywallName: '111',
      price: 5.99,
      paywallABTestName: '111',
      localizedPrice: '$5.99',
      localizedDescription: '1 Month Premium Description',
      currencySymbol: '$',
      variationId: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
    } satisfies AdaptyProduct);

    const recoded = coder.encode(result);

    expect(input).toEqual(recoded);
  });
});
