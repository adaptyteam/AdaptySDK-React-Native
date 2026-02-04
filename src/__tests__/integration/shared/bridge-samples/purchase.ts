/**
 * Purchase-related bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for purchase methods.
 */

import type { components } from '@/types/api';

/**
 * MakePurchase request with product (snake_case format)
 * Only includes fields that getInput() sends to native bridge
 */
export const MAKE_PURCHASE_REQUEST: components['requests']['MakePurchase.Request'] = {
  method: 'make_purchase',
  product: {
    vendor_product_id: 'com.example.vip',
    adapty_product_id: 'adapty_vip',
    access_level_id: 'vip_premium',
    product_type: 'subscription',
    paywall_product_index: 0,
    paywall_variation_id: 'variation_vip',
    paywall_ab_test_name: 'test_ab_vip',
    paywall_name: 'VIP Paywall',
  },
};

/**
 * MakePurchase response - successful purchase with profile
 */
export const MAKE_PURCHASE_RESPONSE_SUCCESS: components['requests']['MakePurchase.Response'] = {
  success: {
    type: 'success',
    profile: {
      profile_id: 'profile_123',
      customer_user_id: 'user_123',
      segment_hash: 'segment_abc',
      is_test_user: false,
      timestamp: 1704067200000,
      paid_access_levels: {
        vip_premium: {
          id: 'vip_premium',
          is_active: true,
          vendor_product_id: 'com.example.vip',
          store: 'app_store',
          activated_at: '2024-01-01T00:00:00.000Z',
          renewed_at: '2024-01-01T00:00:00.000Z',
          will_renew: true,
          is_in_grace_period: false,
          expires_at: '2024-02-01T00:00:00.000Z',
          is_lifetime: false,
          starts_at: '2024-01-01T00:00:00.000Z',
          is_refund: false,
        },
      },
    },
  },
};

/**
 * MakePurchase response - user cancelled purchase
 */
export const MAKE_PURCHASE_RESPONSE_CANCELLED: components['requests']['MakePurchase.Response'] = {
  success: {
    type: 'user_cancelled',
  },
};

/**
 * RestorePurchases request
 */
export const RESTORE_PURCHASES_REQUEST: components['requests']['RestorePurchases.Request'] = {
  method: 'restore_purchases',
};

/**
 * RestorePurchases response with premium access level
 */
export const RESTORE_PURCHASES_RESPONSE_WITH_PREMIUM: components['requests']['RestorePurchases.Response'] = {
  success: {
    profile_id: 'restored_profile_123',
    segment_hash: 'restored_hash',
    is_test_user: false,
    timestamp: -1,
    custom_attributes: {},
    paid_access_levels: {
      premium: {
        id: 'premium',
        is_active: true,
        vendor_product_id: 'com.example.premium',
        store: 'app_store',
        activated_at: '2026-01-01T00:00:00Z',
        is_lifetime: false,
        will_renew: true,
        is_in_grace_period: false,
        is_refund: false,
      },
    },
    subscriptions: {},
    non_subscriptions: {},
  },
};

/**
 * ReportTransaction request
 */
export const REPORT_TRANSACTION_REQUEST: components['requests']['ReportTransaction.Request'] = {
  method: 'report_transaction',
  transaction_id: 'transaction_12345',
};

/**
 * ReportTransaction request with variation
 */
export const REPORT_TRANSACTION_REQUEST_WITH_VARIATION: components['requests']['ReportTransaction.Request'] = {
  method: 'report_transaction',
  transaction_id: 'transaction_12345',
  variation_id: 'variation_abc',
};

/**
 * ReportTransaction successful response
 */
export const REPORT_TRANSACTION_RESPONSE_SUCCESS: components['requests']['ReportTransaction.Response'] = {
  success: true,
};
