import type {
  AdaptyProfile,
  AdaptyPaywall,
  AdaptyPaywallProduct,
  AdaptyOnboarding,
  AdaptyAccessLevel,
  AdaptyPurchaseResult,
  VendorStore,
} from '@/types';

/**
 * Creates a default mock profile without subscriptions
 */
export function createMockProfile(
  overrides?: Partial<AdaptyProfile>,
): AdaptyProfile {
  return {
    profileId: 'mock_profile_id',
    customerUserId: 'mock_customer_user_id',
    accessLevels: {},
    subscriptions: {},
    nonSubscriptions: {},
    customAttributes: {},
    ...overrides,
  };
}

/**
 * Creates a premium access level for mock profile
 */
export function createMockPremiumAccessLevel(
  accessLevelId: string = 'premium',
): AdaptyAccessLevel {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

  return {
    id: accessLevelId,
    isActive: true,
    vendorProductId: 'mock_premium_product',
    store: 'adapty' as VendorStore,
    activatedAt: now,
    renewedAt: now,
    expiresAt: futureDate,
    isLifetime: false,
    isInGracePeriod: false,
    isRefund: false,
    willRenew: true,
    startsAt: now,
  };
}

/**
 * Creates a default mock paywall
 */
export function createMockPaywall(
  placementId: string,
  overrides?: Partial<AdaptyPaywall>,
): AdaptyPaywall {
  return {
    id: `mock_paywall_${placementId}`,
    placement: {
      id: placementId,
      abTestName: 'Mock A/B Test',
      audienceName: 'All Users',
      revision: 1,
      audienceVersionId: 'mock_audience_v1',
      isTrackingPurchases: true,
    },
    hasViewConfiguration: true,
    name: `Mock Paywall for ${placementId}`,
    variationId: 'mock_variation_id',
    products: [
      {
        vendorId: 'mock_product_monthly',
        adaptyId: 'mock_adapty_monthly',
        accessLevelId: 'premium',
        productType: 'subscription',
      },
      {
        vendorId: 'mock_product_annual',
        adaptyId: 'mock_adapty_annual',
        accessLevelId: 'premium',
        productType: 'subscription',
      },
    ],
    productIdentifiers: [
      {
        vendorProductId: 'mock_product_monthly',
        adaptyProductId: 'mock_adapty_monthly',
      },
      {
        vendorProductId: 'mock_product_annual',
        adaptyProductId: 'mock_adapty_annual',
      },
    ],
    remoteConfig: {
      lang: 'en',
      data: { title: 'Get Premium Access', features: ['Feature 1', 'Feature 2'] },
      dataString: '{"title":"Get Premium Access","features":["Feature 1","Feature 2"]}',
    },
    version: 1,
    requestLocale: 'en',
    ...overrides,
  };
}

/**
 * Creates default mock products for a paywall
 */
export function createMockProducts(
  paywall: AdaptyPaywall,
): AdaptyPaywallProduct[] {
  return [
    {
      vendorProductId: 'mock_product_monthly',
      adaptyId: 'mock_adapty_monthly',
      localizedTitle: 'Premium Monthly',
      localizedDescription: 'Get premium access for 1 month',
      paywallName: paywall.name,
      paywallABTestName: paywall.placement.abTestName,
      variationId: paywall.variationId,
      accessLevelId: 'premium',
      productType: 'subscription',
      price: {
        amount: 9.99,
        currencyCode: 'USD',
        currencySymbol: '$',
        localizedString: '$9.99',
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
      paywallName: paywall.name,
      paywallABTestName: paywall.placement.abTestName,
      variationId: paywall.variationId,
      accessLevelId: 'premium',
      productType: 'subscription',
      price: {
        amount: 99.99,
        currencyCode: 'USD',
        currencySymbol: '$',
        localizedString: '$99.99',
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
  ];
}

/**
 * Creates a successful purchase result with updated profile
 */
export function createMockPurchaseResult(
  profile: AdaptyProfile,
): AdaptyPurchaseResult {
  return {
    type: 'success',
    profile,
  };
}

/**
 * Creates a default mock onboarding
 */
export function createMockOnboarding(
  placementId: string,
  overrides?: Partial<AdaptyOnboarding>,
): AdaptyOnboarding {
  return {
    id: `mock_onboarding_${placementId}`,
    placement: {
      id: placementId,
      abTestName: 'Mock Onboarding A/B Test',
      audienceName: 'All Users',
      revision: 1,
      audienceVersionId: 'mock_onboarding_audience_v1',
      isTrackingPurchases: true,
    },
    hasViewConfiguration: true,
    name: `Mock Onboarding for ${placementId}`,
    variationId: 'mock_onboarding_variation_id',
    version: 1,
    requestLocale: 'en',
    remoteConfig: {
      lang: 'en',
      data: { screens: ['Welcome', 'Features', 'Pricing'] },
      dataString: '{"screens":["Welcome","Features","Pricing"]}',
    },
    ...overrides,
  };
}

