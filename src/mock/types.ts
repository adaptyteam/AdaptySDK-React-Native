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
   * Access level ID to grant after purchase
   * @default 'premium'
   */
  premiumAccessLevelId?: string;
}
