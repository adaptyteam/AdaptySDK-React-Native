import type { AdaptyProfile, AdaptyPaywall, AdaptyPaywallProduct, AdaptyOnboarding } from '../types';
import type { AdaptyMockConfig } from './types';
/**
 * Stateful store for mock data
 * Maintains profile state across operations
 */
export declare class MockStore {
    private profile;
    private config;
    private isActivated;
    constructor(config?: AdaptyMockConfig);
    /**
     * Get the current profile
     */
    getProfile(): AdaptyProfile;
    /**
     * Update profile with custom data
     */
    updateProfile(updates: Partial<AdaptyProfile>): void;
    /**
     * Grant premium access level
     */
    grantPremiumAccess(product: AdaptyPaywallProduct, accessLevelId?: string): AdaptyProfile;
    /**
     * Simulate a purchase and update profile accordingly
     */
    makePurchase(product: AdaptyPaywallProduct): AdaptyProfile;
    /**
     * Get paywall for placement
     */
    getPaywall(placementId: string): AdaptyPaywall;
    /**
     * Get products for paywall
     */
    getPaywallProducts(placementId: string, variationId?: string): AdaptyPaywallProduct[];
    /**
     * Get onboarding for placement
     */
    getOnboarding(placementId: string): AdaptyOnboarding;
    /**
     * Set activated state
     */
    setActivated(activated: boolean): void;
    /**
     * Check if SDK is activated
     */
    getIsActivated(): boolean;
    /**
     * Reset profile to initial state
     */
    logout(): void;
    /**
     * Update customer user ID
     */
    identify(customerUserId: string): void;
}
//# sourceMappingURL=mock-store.d.ts.map