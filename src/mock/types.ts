import type {
  AdaptyProfile,
  AdaptyPaywall,
  AdaptyPaywallProduct,
  AdaptyOnboarding,
} from '@/types';

/**
 * Configuration for mock mode
 * Allows customization of mock data returned by SDK methods
 */
export interface AdaptyMockConfig {
  /**
   * Custom profile data to return instead of default mock profile
   */
  profile?: Partial<AdaptyProfile>;

  /**
   * Custom paywall data by placement ID
   */
  paywalls?: Record<string, Partial<AdaptyPaywall>>;

  /**
   * Custom products data by paywall variation ID
   */
  products?: Record<string, AdaptyPaywallProduct[]>;

  /**
   * Custom onboarding data by placement ID
   */
  onboardings?: Record<string, Partial<AdaptyOnboarding>>;

  /**
   * Whether to automatically grant premium access after makePurchase
   * @default true
   */
  autoGrantPremium?: boolean;

  /**
   * Access level ID to grant after purchase.
   *
   * This setting allows you to override the access level granted in mock mode,
   * which is useful for testing specific scenarios.
   *
   * **Priority order:**
   * 1. `config.premiumAccessLevelId` (if set) - highest priority, overrides everything
   * 2. `product.accessLevelId` (if available and config not set) - uses product's access level
   * 3. `'premium'` (fallback) - default when neither of above is available
   *
   * @example
   * ```ts
   * // Override to always grant 'vip' access in tests
   * __mockConfig: {
   *   premiumAccessLevelId: 'vip'
   * }
   * ```
   *
   * @example
   * ```ts
   * // Use product's accessLevelId (normal behavior)
   * __mockConfig: {
   *   // premiumAccessLevelId not set - will use product.accessLevelId
   * }
   * ```
   *
   * @default undefined (uses product.accessLevelId, or 'premium' as final fallback)
   */
  premiumAccessLevelId?: string;
}
