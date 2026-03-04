import type { AdaptyProfile, AdaptyPaywall, AdaptyPaywallProduct, AdaptyOnboarding, AdaptyProfileParameters } from '../types';
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
     *
     * Note: In real Adapty, updateProfile() sends user attributes (firstName, lastName, email, etc.)
     * to the server for CRM and segmentation, but these fields are NOT returned by getProfile().
     * Only customAttributes are stored in the profile and returned by getProfile().
     */
    updateProfile(updates: AdaptyProfileParameters): void;
    /**
     * Grant premium access level
     */
    grantPremiumAccess(accessLevelId: string): AdaptyProfile;
    /**
     * Simulate a purchase and update profile accordingly
     *
     * @param productAccessLevelId - Access level ID from the product, or undefined if not available
     */
    makePurchase(productAccessLevelId?: string): AdaptyProfile;
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