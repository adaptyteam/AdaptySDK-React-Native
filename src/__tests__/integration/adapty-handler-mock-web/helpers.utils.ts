import type { AdaptyPaywallProduct, AdaptyFlow } from '@/types';

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
 * Creates a mock AdaptyFlow with default values
 */
export function createMockFlow(overrides?: Partial<AdaptyFlow>): AdaptyFlow {
  const placement = {
    id: 'test_placement',
    abTestName: 'test_ab',
    audienceName: 'all_users',
    revision: 1,
    audienceVersionId: 'v1',
  };
  return {
    id: 'test_flow',
    name: 'Test Flow',
    variationId: 'variation_1',
    placement,
    responseCreatedAt: 1704067200000,
    paywalls: [
      {
        placement,
        id: 'test_paywall',
        name: 'Test Paywall',
        variationId: 'variation_1',
        productIdentifiers: [
          {
            vendorProductId: 'com.example.product',
            adaptyProductId: 'adapty_product',
          },
        ],
        // `products` kept at runtime for coder.encode(flow) — assertion hides it from public type
        products: [
          {
            vendorId: 'com.example.product',
            adaptyId: 'adapty_product',
            accessLevelId: 'premium',
            productType: 'subscription',
          },
        ],
      } as AdaptyFlow['paywalls'][number],
    ],
    ...overrides,
  };
}
