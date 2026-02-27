import type { AdaptyPaywallProduct, AdaptyPaywall } from '@/types';

/**
 * Creates a mock AdaptyPaywallProduct with default values
 */
export function createMockProduct(
  overrides?: Partial<AdaptyPaywallProduct>,
): AdaptyPaywallProduct {
  return {
    ios: {
      isFamilyShareable: false,
    },
    vendorProductId: 'com.example.product',
    adaptyId: 'adapty_product',
    paywallProductIndex: 0,
    localizedDescription: 'Test Product',
    localizedTitle: 'Test',
    regionCode: 'US',
    variationId: 'variation_1',
    paywallABTestName: 'test_ab',
    paywallName: 'Test Paywall',
    accessLevelId: 'premium',
    productType: 'subscription',
    payloadData: 'test_payload',
    price: {
      amount: 9.99,
      currencyCode: 'USD',
      currencySymbol: '$',
      localizedString: '$9.99',
    },
    ...overrides,
  };
}

/**
 * Creates a mock AdaptyPaywall with default values
 */
export function createMockPaywall(
  overrides?: Partial<AdaptyPaywall>,
): AdaptyPaywall {
  return {
    hasViewConfiguration: false,
    id: 'test_paywall',
    name: 'Test Paywall',
    variationId: 'variation_1',
    version: 1,
    requestLocale: 'en',
    productIdentifiers: [
      {
        vendorProductId: 'com.example.product',
        adaptyProductId: 'adapty_product',
      },
    ],
    products: [
      {
        vendorId: 'com.example.product',
        adaptyId: 'adapty_product',
        accessLevelId: 'premium',
        productType: 'subscription',
      },
    ],
    remoteConfig: {
      lang: 'en',
      data: {},
      dataString: '{}',
    },
    placement: {
      id: 'test_placement',
      abTestName: 'test_ab',
      audienceName: 'all_users',
      revision: 1,
      audienceVersionId: 'v1',
    },
    ...overrides,
  };
}
