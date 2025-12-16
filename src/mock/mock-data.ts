import type {
  AdaptyProfile,
  AdaptyPaywall,
  AdaptyPaywallProduct,
  AdaptyOnboarding,
  AdaptyAccessLevel,
  AdaptyPurchaseResult,
  VendorStore,
} from '@/types';

// Mock Product IDs
export const MOCK_VENDOR_PRODUCT_ID_ANNUAL = 'mock.product.annual';
export const MOCK_VENDOR_PRODUCT_ID_MONTHLY = 'mock.product.monthly';

export const MOCK_ADAPTY_PRODUCT_ID_ANNUAL = 'mock.adapty.annual';
export const MOCK_ADAPTY_PRODUCT_ID_MONTHLY = 'mock.adapty.monthly';

// Access Levels
export const MOCK_ACCESS_LEVEL_PREMIUM = 'premium';

// Profile IDs
export const MOCK_PROFILE_ID = 'mock.profile.id';
export const MOCK_CUSTOMER_USER_ID = 'mock.customer.user.id';

// Time periods in milliseconds
/** Default subscription duration: 1 year */
export const MOCK_SUBSCRIPTION_DURATION_MS = 365 * 24 * 60 * 60 * 1000;
/** Time until unsubscribe after activation: 1 day */
export const MOCK_UNSUBSCRIBE_DELAY_MS = 24 * 60 * 60 * 1000;

/**
 * Helper functions for date calculations
 */

/**
 * Adds milliseconds to a date
 */
export function addMilliseconds(date: Date, ms: number): Date {
  return new Date(date.getTime() + ms);
}

/**
 * Creates subscription date set with default values
 * @returns Object containing now, expiresAt, and unsubscribedAt dates
 */
export function createSubscriptionDates(): {
  now: Date;
  expiresAt: Date;
  unsubscribedAt: Date;
} {
  const now = new Date();
  return {
    now,
    expiresAt: addMilliseconds(now, MOCK_SUBSCRIPTION_DURATION_MS),
    unsubscribedAt: addMilliseconds(now, MOCK_UNSUBSCRIBE_DELAY_MS),
  };
}

/**
 * Creates a default mock profile without subscriptions
 */
export function createMockProfile(
  overrides?: Partial<AdaptyProfile>,
): AdaptyProfile {
  return {
    profileId: MOCK_PROFILE_ID,
    customerUserId: MOCK_CUSTOMER_USER_ID,
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
  accessLevelId: string = MOCK_ACCESS_LEVEL_PREMIUM,
): AdaptyAccessLevel {
  const { now, expiresAt, unsubscribedAt } = createSubscriptionDates();

  return {
    id: accessLevelId,
    isActive: true,
    vendorProductId: MOCK_VENDOR_PRODUCT_ID_ANNUAL,
    store: 'adapty' as VendorStore,
    activatedAt: now,
    renewedAt: now,
    expiresAt,
    unsubscribedAt,
    isLifetime: false,
    isInGracePeriod: false,
    isRefund: false,
    willRenew: false,
    startsAt: now,
    android: {},
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
    id: `mock-paywall-${placementId}`,
    placement: {
      id: placementId,
      abTestName: placementId,
      audienceName: 'All Users',
      revision: 0,
      audienceVersionId: 'b7f6a19e-4384-4732-815d-5ad6610b695f',
      isTrackingPurchases: true,
    },
    hasViewConfiguration: true,
    name: placementId,
    variationId: 'mock_variation_id',
    products: [
      {
        vendorId: MOCK_VENDOR_PRODUCT_ID_ANNUAL,
        adaptyId: MOCK_ADAPTY_PRODUCT_ID_ANNUAL,
        accessLevelId: MOCK_ACCESS_LEVEL_PREMIUM,
        productType: 'annual',
        ios: {},
        android: {},
      },
      {
        vendorId: MOCK_VENDOR_PRODUCT_ID_MONTHLY,
        adaptyId: MOCK_ADAPTY_PRODUCT_ID_MONTHLY,
        accessLevelId: MOCK_ACCESS_LEVEL_PREMIUM,
        productType: 'subscription',
        ios: {},
        android: {},
      },
    ],
    productIdentifiers: [
      {
        vendorProductId: MOCK_VENDOR_PRODUCT_ID_ANNUAL,
        adaptyProductId: MOCK_ADAPTY_PRODUCT_ID_ANNUAL,
      },
      {
        vendorProductId: MOCK_VENDOR_PRODUCT_ID_MONTHLY,
        adaptyProductId: MOCK_ADAPTY_PRODUCT_ID_MONTHLY,
      },
    ],
    paywallBuilder: {
      id: 'mock.paywall.builder.id',
      lang: 'en',
    },
    webPurchaseUrl: `http://paywalls-mock.adapty.io/${placementId}`,
    version: Date.now(),
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
      vendorProductId: MOCK_VENDOR_PRODUCT_ID_ANNUAL,
      adaptyId: MOCK_ADAPTY_PRODUCT_ID_ANNUAL,
      localizedTitle: 'Premium Annual',
      localizedDescription: 'Get premium access for 1 year',
      regionCode: 'US',
      paywallName: paywall.name,
      paywallABTestName: paywall.placement.abTestName,
      variationId: paywall.variationId,
      accessLevelId: MOCK_ACCESS_LEVEL_PREMIUM,
      productType: 'subscription',
      price: {
        amount: 99.99,
        currencyCode: 'USD',
        currencySymbol: '$',
        localizedString: '$99.99',
      },
      webPurchaseUrl: paywall.webPurchaseUrl,
      paywallProductIndex: 0,
      subscription: {
        subscriptionPeriod: {
          numberOfUnits: 1,
          unit: 'year',
        },
        localizedSubscriptionPeriod: '1 year',
        offer: {
          identifier: {
            type: 'introductory',
          },
          phases: [
            {
              localizedNumberOfPeriods: '1 month',
              localizedSubscriptionPeriod: '1 month',
              numberOfPeriods: 1,
              paymentMode: 'free_trial',
              price: {
                amount: 0,
                currencyCode: 'USD',
                localizedString: '$0.00',
              },
              subscriptionPeriod: {
                unit: 'month',
                numberOfUnits: 1,
              },
            },
          ],
        },
        ios: {
          subscriptionGroupIdentifier: '20770576',
        },
      },
      ios: {
        isFamilyShareable: false,
      },
    },
    {
      vendorProductId: MOCK_VENDOR_PRODUCT_ID_MONTHLY,
      adaptyId: MOCK_ADAPTY_PRODUCT_ID_MONTHLY,
      localizedTitle: 'Premium Monthly',
      localizedDescription: 'Get premium access for 1 month',
      regionCode: 'US',
      paywallName: paywall.name,
      paywallABTestName: paywall.placement.abTestName,
      variationId: paywall.variationId,
      accessLevelId: MOCK_ACCESS_LEVEL_PREMIUM,
      productType: 'subscription',
      price: {
        amount: 9.99,
        currencyCode: 'USD',
        currencySymbol: '$',
        localizedString: '$9.99',
      },
      webPurchaseUrl: paywall.webPurchaseUrl,
      paywallProductIndex: 1,
      subscription: {
        subscriptionPeriod: {
          numberOfUnits: 1,
          unit: 'month',
        },
        localizedSubscriptionPeriod: '1 month',
        offer: {
          identifier: {
            type: 'introductory',
          },
          phases: [
            {
              localizedNumberOfPeriods: '1 month',
              localizedSubscriptionPeriod: '1 month',
              numberOfPeriods: 1,
              paymentMode: 'pay_up_front',
              price: {
                amount: 1.99,
                currencyCode: 'USD',
                localizedString: '$1.99',
              },
              subscriptionPeriod: {
                unit: 'month',
                numberOfUnits: 1,
              },
            },
          ],
        },
        ios: {
          subscriptionGroupIdentifier: '20770576',
        },
      },
      ios: {
        isFamilyShareable: false,
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
