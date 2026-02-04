/**
 * Typed bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge, strictly typed against api.d.ts (generated from cross_platform.yaml).
 *
 * All request/response formats use snake_case as per native bridge specification.
 */

import type { components } from '@/types/api';
import type { AdaptyPaywallProduct } from '@/types';

// ============================================================================
// Activate Request Samples
// ============================================================================

/**
 * Minimal activate request with only required api_key
 */
export const ACTIVATE_REQUEST_MINIMAL: components['requests']['Activate.Request'] = {
  method: 'activate',
  configuration: {
    api_key: 'test_api_key_12345',
  },
};

/**
 * Activate request with log_level option
 */
export const ACTIVATE_REQUEST_WITH_LOG_LEVEL: components['requests']['Activate.Request'] = {
  method: 'activate',
  configuration: {
    api_key: 'test_api_key_12345',
    log_level: 'error',
  },
};

/**
 * Activate request with customer_user_id
 */
export const ACTIVATE_REQUEST_WITH_CUSTOMER_USER_ID: components['requests']['Activate.Request'] = {
  method: 'activate',
  configuration: {
    api_key: 'test_api_key_12345',
    customer_user_id: 'user_123',
    log_level: 'error',
  },
};

/**
 * Full activate request with all common options
 */
export const ACTIVATE_REQUEST_FULL: components['requests']['Activate.Request'] = {
  method: 'activate',
  configuration: {
    api_key: 'test_api_key_12345',
    customer_user_id: 'user_123',
    observer_mode: false,
    server_cluster: 'default',
    log_level: 'verbose',
    ip_address_collection_disabled: false,
  },
};

// ============================================================================
// Activate Response Samples
// ============================================================================

/**
 * Successful activation response
 */
export const ACTIVATE_RESPONSE_SUCCESS: components['requests']['Activate.Response'] = {
  success: true,
};

/**
 * Activation error response - invalid API key
 */
export const ACTIVATE_RESPONSE_ERROR: components['requests']['Activate.Response'] = {
  error: {
    adapty_code: 2002,
    message: 'Invalid API key',
    detail: 'The provided API key is not valid',
  },
};

// ============================================================================
// IsActivated Request/Response Samples
// ============================================================================

/**
 * IsActivated request (no parameters)
 */
export const IS_ACTIVATED_REQUEST: components['requests']['IsActivated.Request'] = {
  method: 'is_activated',
};

/**
 * IsActivated response - true (activated)
 */
export const IS_ACTIVATED_RESPONSE_TRUE: components['requests']['IsActivated.Response'] = {
  success: true,
};

/**
 * IsActivated response - false (not activated)
 */
export const IS_ACTIVATED_RESPONSE_FALSE: components['requests']['IsActivated.Response'] = {
  success: false,
};

// ============================================================================
// GetProfile Request/Response Samples
// ============================================================================

/**
 * GetProfile request (no parameters)
 */
export const GET_PROFILE_REQUEST: components['requests']['GetProfile.Request'] = {
  method: 'get_profile',
};

/**
 * GetProfile response with custom attributes
 */
export const GET_PROFILE_RESPONSE_WITH_CUSTOM_ATTRS: components['requests']['GetProfile.Response'] = {
  success: {
    profile_id: 'profile_123',
    customer_user_id: 'user_123',
    segment_hash: 'segment_abc',
    is_test_user: false,
    timestamp: 1704067200000,
    custom_attributes: {
      user_level: 42,
      referral_code: 'FRIEND2024',
    },
  },
};

/**
 * GetProfile response with premium access level
 */
export const GET_PROFILE_RESPONSE_WITH_PREMIUM: components['requests']['GetProfile.Response'] = {
  success: {
    profile_id: 'profile_456',
    customer_user_id: 'premium_user',
    segment_hash: 'segment_xyz',
    is_test_user: false,
    timestamp: 1704067200000,
    paid_access_levels: {
      premium: {
        id: 'premium',
        is_active: true,
        vendor_product_id: 'com.example.premium.monthly',
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
};

// ============================================================================
// UpdateProfile Request/Response Samples
// ============================================================================

/**
 * UpdateProfile request with custom attributes
 */
export const UPDATE_PROFILE_REQUEST_CUSTOM_ATTRS: components['requests']['UpdateProfile.Request'] = {
  method: 'update_profile',
  params: {
    custom_attributes: {
      user_level: 50,
      completed_tutorial: 1,
    },
  },
};

/**
 * UpdateProfile successful response
 */
export const UPDATE_PROFILE_RESPONSE_SUCCESS: components['requests']['UpdateProfile.Response'] = {
  success: true,
};

/**
 * UpdateProfile error response
 */
export const UPDATE_PROFILE_RESPONSE_ERROR: components['requests']['UpdateProfile.Response'] = {
  error: {
    adapty_code: 2,
    message: 'Profile update failed',
    detail: 'Unable to update profile at this time',
  },
};

// ============================================================================
// GetPaywall Request/Response Samples
// ============================================================================

/**
 * GetPaywall request
 */
export const GET_PAYWALL_REQUEST: components['requests']['GetPaywall.Request'] = {
  method: 'get_paywall',
  placement_id: 'test_placement',
};

/**
 * GetPaywall response with paywall builder
 */
export const GET_PAYWALL_RESPONSE: components['requests']['GetPaywall.Response'] = {
  success: {
    placement: {
      developer_id: 'test_placement',
      ab_test_name: 'test_ab',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    paywall_id: 'paywall_test_placement',
    paywall_name: 'test_placement',
    variation_id: 'variation_123',
    products: [
      {
        vendor_product_id: 'com.example.product',
        adapty_product_id: 'adapty_product',
        access_level_id: 'premium',
        product_type: 'subscription',
      },
    ],
    response_created_at: -1,
    request_locale: 'en',
    paywall_builder: {
      paywall_builder_id: 'builder_123',
      lang: 'en',
    },
  },
};

/**
 * GetPaywall error response
 */
export const GET_PAYWALL_RESPONSE_ERROR: components['requests']['GetPaywall.Response'] = {
  error: {
    adapty_code: 2,
    message: 'Paywall not found',
    detail: 'No paywall exists for the specified placement',
  },
};

// ============================================================================
// GetPaywallProducts Request/Response Samples
// ============================================================================

/**
 * GetPaywallProducts request with paywall (snake_case format)
 */
export const GET_PAYWALL_PRODUCTS_REQUEST: components['requests']['GetPaywallProducts.Request'] = {
  method: 'get_paywall_products',
  paywall: {
    placement: {
      developer_id: 'test_placement',
      ab_test_name: 'test_ab',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    paywall_id: 'test_paywall_id',
    paywall_name: 'Test Paywall',
    variation_id: 'test_variation_123',
    products: [
      {
        vendor_product_id: 'com.example.monthly',
        adapty_product_id: 'monthly_id',
        access_level_id: 'premium',
        product_type: 'subscription',
      },
    ],
    response_created_at: 1704067200000,
    request_locale: 'en',
  },
};

/**
 * GetPaywallProducts response with products array
 */
export const GET_PAYWALL_PRODUCTS_RESPONSE: components['requests']['GetPaywallProducts.Response'] = {
  success: [
    {
      vendor_product_id: 'com.example.monthly',
      adapty_product_id: 'monthly_id',
      access_level_id: 'premium',
      product_type: 'subscription',
      paywall_product_index: 0,
      paywall_variation_id: 'test_variation_123',
      paywall_ab_test_name: 'test_ab',
      paywall_name: 'Test Paywall',
      localized_description: 'Monthly Premium Subscription',
      localized_title: 'Premium Monthly',
      is_family_shareable: false,
      price: {
        amount: 9.99,
        currency_code: 'USD',
        currency_symbol: '$',
        localized_string: '$9.99',
      },
    },
  ],
};

/**
 * GetPaywallProducts error response
 */
export const GET_PAYWALL_PRODUCTS_RESPONSE_ERROR: components['requests']['GetPaywallProducts.Response'] = {
  error: {
    adapty_code: 2,
    message: 'Products not found',
    detail: 'Unable to fetch products for the specified paywall',
  },
};

// ============================================================================
// LogShowPaywall Request/Response Samples
// ============================================================================

/**
 * LogShowPaywall request
 */
export const LOG_SHOW_PAYWALL_REQUEST: components['requests']['LogShowPaywall.Request'] = {
  method: 'log_show_paywall',
  paywall: {
    placement: {
      developer_id: 'test_placement',
      ab_test_name: 'test_ab',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    paywall_id: 'paywall_test_placement',
    paywall_name: 'test_placement',
    variation_id: 'variation_123',
    products: [],
    response_created_at: -1,
    request_locale: 'en',
  },
};

/**
 * LogShowPaywall response
 */
export const LOG_SHOW_PAYWALL_RESPONSE: components['requests']['LogShowPaywall.Response'] = {
  success: true,
};

// ============================================================================
// MakePurchase Request/Response Samples
// ============================================================================

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

// ============================================================================
// Event Samples
// ============================================================================

/**
 * Event.DidLoadLatestProfile - emitted after purchase
 */
export const EVENT_DID_LOAD_LATEST_PROFILE: components['events']['Event.DidLoadLatestProfile'] = {
  id: 'did_load_latest_profile',
  profile: {
    profile_id: 'event_profile_789',
    segment_hash: 'event_hash',
    is_test_user: false,
    timestamp: -1,
    custom_attributes: {},
    paid_access_levels: {
      test_premium: {
        id: 'test_premium',
        is_active: true,
        vendor_product_id: 'com.example.test',
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

// ============================================================================
// Product Samples (for public API usage)
// ============================================================================

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

// ============================================================================
// GetOnboarding Request/Response Samples
// ============================================================================

export const GET_ONBOARDING_REQUEST: components['requests']['GetOnboarding.Request'] = {
  method: 'get_onboarding',
  placement_id: 'test_onboarding_placement',
  load_timeout: 5,
  fetch_policy: {
    type: 'reload_revalidating_cache_data',
  },
};

export const GET_ONBOARDING_RESPONSE: components['requests']['GetOnboarding.Response'] = {
  success: {
    placement: {
      developer_id: 'test_onboarding_placement',
      ab_test_name: 'onboarding_test',
      audience_name: 'all_users',
      revision: 1,
      placement_audience_version_id: 'v1',
    },
    onboarding_id: 'onboarding_123',
    onboarding_name: 'test_onboarding_placement',
    variation_id: 'onboarding_variation_456',
    response_created_at: -1,
    request_locale: 'en',
    onboarding_builder: {
      config_url: 'https://example.com/onboarding-config',
    },
  },
};

export const GET_ONBOARDING_FOR_DEFAULT_AUDIENCE_REQUEST: components['requests']['GetOnboardingForDefaultAudience.Request'] = {
  method: 'get_onboarding_for_default_audience',
  placement_id: 'test_onboarding_placement',
  fetch_policy: {
    type: 'reload_revalidating_cache_data',
  },
};

// ============================================================================
// Identify Request/Response Samples
// ============================================================================

export const IDENTIFY_REQUEST: components['requests']['Identify.Request'] = {
  method: 'identify',
  customer_user_id: 'user_12345',
};

export const IDENTIFY_REQUEST_WITH_APP_ACCOUNT_TOKEN: components['requests']['Identify.Request'] = {
  method: 'identify',
  customer_user_id: 'user_12345',
  parameters: {
    app_account_token: 'ios_token_abc',
  },
};

export const IDENTIFY_RESPONSE_SUCCESS: components['requests']['Identify.Response'] = {
  success: true,
};

// ============================================================================
// Logout Request/Response Samples
// ============================================================================

export const LOGOUT_REQUEST: components['requests']['Logout.Request'] = {
  method: 'logout',
};

export const LOGOUT_RESPONSE_SUCCESS: components['requests']['Logout.Response'] = {
  success: true,
};
