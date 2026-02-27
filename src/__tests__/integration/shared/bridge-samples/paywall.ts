/**
 * Paywall-related bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for paywall methods.
 */

import type { components } from '@/types/api';

/**
 * GetPaywall request
 */
export const GET_PAYWALL_REQUEST: components['requests']['GetPaywall.Request'] =
  {
    method: 'get_paywall',
    placement_id: 'test_placement',
  };

/**
 * GetPaywall response with paywall builder
 */
export const GET_PAYWALL_RESPONSE: components['requests']['GetPaywall.Response'] =
  {
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
export const GET_PAYWALL_RESPONSE_ERROR: components['requests']['GetPaywall.Response'] =
  {
    error: {
      adapty_code: 2,
      message: 'Paywall not found',
      detail: 'No paywall exists for the specified placement',
    },
  };

/**
 * GetPaywallForDefaultAudience request
 */
export const GET_PAYWALL_FOR_DEFAULT_AUDIENCE_REQUEST: components['requests']['GetPaywallForDefaultAudience.Request'] =
  {
    method: 'get_paywall_for_default_audience',
    placement_id: 'test_placement_default',
  };

/**
 * GetPaywallForDefaultAudience response (same format as GetPaywall.Response)
 */
export const GET_PAYWALL_FOR_DEFAULT_AUDIENCE_RESPONSE: components['requests']['GetPaywallForDefaultAudience.Response'] =
  {
    success: {
      placement: {
        developer_id: 'test_placement_default',
        ab_test_name: 'default_ab_test',
        audience_name: 'default_audience',
        revision: 1,
        placement_audience_version_id: 'default_v1',
      },
      paywall_id: 'paywall_default_audience',
      paywall_name: 'test_placement_default',
      variation_id: 'default_variation_123',
      products: [
        {
          vendor_product_id: 'com.example.default_product',
          adapty_product_id: 'default_adapty_product',
          access_level_id: 'premium',
          product_type: 'subscription',
        },
      ],
      response_created_at: -1,
      request_locale: 'en',
      paywall_builder: {
        paywall_builder_id: 'default_builder_123',
        lang: 'en',
      },
    },
  };

/**
 * GetPaywallProducts request with paywall (snake_case format)
 */
export const GET_PAYWALL_PRODUCTS_REQUEST: components['requests']['GetPaywallProducts.Request'] =
  {
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
export const GET_PAYWALL_PRODUCTS_RESPONSE: components['requests']['GetPaywallProducts.Response'] =
  {
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
export const GET_PAYWALL_PRODUCTS_RESPONSE_ERROR: components['requests']['GetPaywallProducts.Response'] =
  {
    error: {
      adapty_code: 2,
      message: 'Products not found',
      detail: 'Unable to fetch products for the specified paywall',
    },
  };

/**
 * LogShowPaywall request
 */
export const LOG_SHOW_PAYWALL_REQUEST: components['requests']['LogShowPaywall.Request'] =
  {
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
export const LOG_SHOW_PAYWALL_RESPONSE: components['requests']['LogShowPaywall.Response'] =
  {
    success: true,
  };

/**
 * OpenWebPaywall request with paywall
 */
export const OPEN_WEB_PAYWALL_REQUEST_WITH_PAYWALL: components['requests']['OpenWebPaywall.Request'] =
  {
    method: 'open_web_paywall',
    open_in: 'browser_out_app',
    paywall: {
      placement: {
        developer_id: 'test_placement',
        ab_test_name: 'test_ab',
        audience_name: 'all_users',
        revision: 1,
        placement_audience_version_id: 'v1',
      },
      paywall_id: 'paywall_test',
      paywall_name: 'test_placement',
      variation_id: 'variation_123',
      products: [],
      response_created_at: -1,
      request_locale: 'en',
    },
  };

/**
 * OpenWebPaywall successful response
 */
export const OPEN_WEB_PAYWALL_RESPONSE_SUCCESS: components['requests']['OpenWebPaywall.Response'] =
  {
    success: true,
  };

/**
 * CreateWebPaywallUrl request
 */
export const CREATE_WEB_PAYWALL_URL_REQUEST: components['requests']['CreateWebPaywallUrl.Request'] =
  {
    method: 'create_web_paywall_url',
    paywall: {
      placement: {
        developer_id: 'test_placement',
        ab_test_name: 'test_ab',
        audience_name: 'all_users',
        revision: 1,
        placement_audience_version_id: 'v1',
      },
      paywall_id: 'paywall_test',
      paywall_name: 'test_placement',
      variation_id: 'variation_123',
      products: [],
      response_created_at: -1,
      request_locale: 'en',
    },
  };

/**
 * CreateWebPaywallUrl response
 */
export const CREATE_WEB_PAYWALL_URL_RESPONSE: components['requests']['CreateWebPaywallUrl.Response'] =
  {
    success: 'https://example.adapty.io/web-paywall-url',
  };
