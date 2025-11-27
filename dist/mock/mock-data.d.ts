import type { AdaptyProfile, AdaptyPaywall, AdaptyPaywallProduct, AdaptyOnboarding, AdaptyAccessLevel, AdaptyPurchaseResult } from '../types';
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