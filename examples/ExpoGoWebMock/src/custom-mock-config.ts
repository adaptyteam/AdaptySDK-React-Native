import { AdaptyMockConfig } from 'react-native-adapty';

export const mockConfig: AdaptyMockConfig = {
  products: {
    mock_variation_id: [
      {
        vendorProductId: 'mock_product_monthly',
        adaptyId: 'mock_adapty_monthly',
        localizedTitle: 'Premium Monthly',
        localizedDescription: 'Get premium access for 1 month',
        paywallName: 'Mock Paywall for mock_placement',
        paywallABTestName: 'Mock A/B Test',
        variationId: 'mock_variation_id',
        accessLevelId: 'premium',
        productType: 'subscription',
        price: {
          amount: 8.99,
          currencyCode: 'USD',
          currencySymbol: '$',
          localizedString: '$8.99',
        },
        paywallProductIndex: 0,
        subscription: {
          subscriptionPeriod: {
            numberOfUnits: 1,
            unit: 'month',
          },
          localizedSubscriptionPeriod: '1 month',
        },
      },
      {
        vendorProductId: 'mock_product_annual',
        adaptyId: 'mock_adapty_annual',
        localizedTitle: 'Premium Annual',
        localizedDescription: 'Get premium access for 1 year',
        paywallName: 'Mock Paywall for mock_placement',
        paywallABTestName: 'Mock A/B Test',
        variationId: 'mock_variation_id',
        accessLevelId: 'premium',
        productType: 'subscription',
        price: {
          amount: 89.99,
          currencyCode: 'USD',
          currencySymbol: '$',
          localizedString: '$89.99',
        },
        paywallProductIndex: 1,
        subscription: {
          subscriptionPeriod: {
            numberOfUnits: 1,
            unit: 'year',
          },
          localizedSubscriptionPeriod: '1 year',
        },
      },
    ],
  },
};

