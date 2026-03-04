import type { AdaptyProfile, AdaptyPaywall, AdaptyPaywallProduct, AdaptyOnboarding, AdaptyAccessLevel, AdaptyPurchaseResult } from '../types';
export declare const MOCK_VENDOR_PRODUCT_ID_ANNUAL = "mock.product.annual";
export declare const MOCK_VENDOR_PRODUCT_ID_MONTHLY = "mock.product.monthly";
export declare const MOCK_ADAPTY_PRODUCT_ID_ANNUAL = "mock.adapty.annual";
export declare const MOCK_ADAPTY_PRODUCT_ID_MONTHLY = "mock.adapty.monthly";
export declare const MOCK_ACCESS_LEVEL_PREMIUM = "premium";
export declare const MOCK_PROFILE_ID = "mock.profile.id";
export declare const MOCK_CUSTOMER_USER_ID = "mock.customer.user.id";
/** Default subscription duration: 1 year */
export declare const MOCK_SUBSCRIPTION_DURATION_MS: number;
/** Time until unsubscribe after activation: 1 day */
export declare const MOCK_UNSUBSCRIBE_DELAY_MS: number;
/**
 * Helper functions for date calculations
 */
/**
 * Adds milliseconds to a date
 */
export declare function addMilliseconds(date: Date, ms: number): Date;
/**
 * Creates subscription date set with default values
 * @returns Object containing now, expiresAt, and unsubscribedAt dates
 */
export declare function createSubscriptionDates(): {
    now: Date;
    expiresAt: Date;
    unsubscribedAt: Date;
};
/**
 * Creates a default mock profile without subscriptions
 */
export declare function createMockProfile(overrides?: Partial<AdaptyProfile>): AdaptyProfile;
/**
 * Creates a premium access level for mock profile
 */
export declare function createMockPremiumAccessLevel(accessLevelId?: string): AdaptyAccessLevel;
/**
 * Creates a default mock paywall
 */
export declare function createMockPaywall(placementId: string, overrides?: Partial<AdaptyPaywall>): AdaptyPaywall;
/**
 * Creates default mock products for a paywall
 */
export declare function createMockProducts(paywall: AdaptyPaywall): AdaptyPaywallProduct[];
/**
 * Creates a successful purchase result with updated profile
 */
export declare function createMockPurchaseResult(profile: AdaptyProfile): AdaptyPurchaseResult;
/**
 * Creates a default mock onboarding
 */
export declare function createMockOnboarding(placementId: string, overrides?: Partial<AdaptyOnboarding>): AdaptyOnboarding;
//# sourceMappingURL=mock-data.d.ts.map