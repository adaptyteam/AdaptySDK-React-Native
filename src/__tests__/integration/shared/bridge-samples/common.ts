/**
 * Common bridge samples and shared types for Adapty SDK integration tests
 *
 * This file contains shared data used across multiple test suites,
 * such as product samples and common type exports.
 */

import type { AdaptyPaywallProduct } from '@/types';

/**
 * VIP product sample in camelCase format (public API format)
 * Used in purchase tests
 */
export const VIP_PRODUCT: AdaptyPaywallProduct = {
  vendorProductId: 'com.example.vip',
  adaptyId: 'adapty_vip',
  accessLevelId: 'vip_premium',
  productType: 'subscription',
  paywallProductIndex: 0,
  variationId: 'variation_vip',
  paywallABTestName: 'test_ab_vip',
  paywallName: 'VIP Paywall',
  localizedDescription: 'VIP Access Plan',
  localizedTitle: 'VIP Access',
  ios: {
    isFamilyShareable: false,
  },
  price: {
    amount: 19.99,
    currencyCode: 'USD',
    currencySymbol: '$',
    localizedString: '$19.99',
  },
};
