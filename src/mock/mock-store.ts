import type {
  AdaptyProfile,
  AdaptyPaywall,
  AdaptyPaywallProduct,
  AdaptyOnboarding,
} from '@/types';
import type { AdaptyMockConfig } from './types';
import {
  createMockProfile,
  createMockPremiumAccessLevel,
  createMockPaywall,
  createMockProducts,
  createMockOnboarding,
} from './mock-data';

/**
 * Stateful store for mock data
 * Maintains profile state across operations
 */
export class MockStore {
  private profile: AdaptyProfile;
  private config: AdaptyMockConfig;
  private isActivated: boolean = false;

  constructor(config: AdaptyMockConfig = {}) {
    this.config = config;
    this.profile = createMockProfile(config.profile);
  }

  /**
   * Get the current profile
   */
  getProfile(): AdaptyProfile {
    return { ...this.profile };
  }

  /**
   * Update profile with custom data
   */
  updateProfile(updates: Partial<AdaptyProfile>): void {
    this.profile = {
      ...this.profile,
      ...updates,
    };
  }

  /**
   * Grant premium access level
   */
  grantPremiumAccess(accessLevelId: string): AdaptyProfile {
    const premiumAccessLevel = createMockPremiumAccessLevel(accessLevelId);

    this.profile = {
      ...this.profile,
      accessLevels: {
        ...this.profile.accessLevels,
        [accessLevelId]: premiumAccessLevel,
      },
    };

    return this.getProfile();
  }

  /**
   * Simulate a purchase and update profile accordingly
   * 
   * @param productAccessLevelId - Access level ID from the product, or undefined if not available
   */
  makePurchase(productAccessLevelId?: string): AdaptyProfile {
    const shouldGrantPremium = this.config.autoGrantPremium !== false; // default true

    if (shouldGrantPremium) {
      const accessLevelId =
        this.config.premiumAccessLevelId || productAccessLevelId || 'premium';
      return this.grantPremiumAccess(accessLevelId);
    }

    return this.getProfile();
  }

  /**
   * Get paywall for placement
   */
  getPaywall(placementId: string): AdaptyPaywall {
    const customPaywall = this.config.paywalls?.[placementId];
    return createMockPaywall(placementId, customPaywall);
  }

  /**
   * Get products for paywall
   */
  getPaywallProducts(
    placementId: string,
    variationId: string = 'mock_variation_id',
  ): AdaptyPaywallProduct[] {
    // If custom products are provided by variationId, use them
    const customProducts = this.config.products?.[variationId];
    if (customProducts) {
      return customProducts;
    }

    // Otherwise, generate default products
    const paywall = this.getPaywall(placementId);
    return createMockProducts(paywall);
  }

  /**
   * Get onboarding for placement
   */
  getOnboarding(placementId: string): AdaptyOnboarding {
    const customOnboarding = this.config.onboardings?.[placementId];
    return createMockOnboarding(placementId, customOnboarding);
  }

  /**
   * Set activated state
   */
  setActivated(activated: boolean): void {
    this.isActivated = activated;
  }

  /**
   * Check if SDK is activated
   */
  getIsActivated(): boolean {
    return this.isActivated;
  }

  /**
   * Reset profile to initial state
   */
  logout(): void {
    this.profile = createMockProfile(this.config.profile);
  }

  /**
   * Update customer user ID
   */
  identify(customerUserId: string): void {
    this.profile = {
      ...this.profile,
      customerUserId,
    };
  }
}
