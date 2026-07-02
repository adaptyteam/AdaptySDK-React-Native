/**
 * Flow-related bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for flow methods.
 */

import type { components } from '@/types/api';

const SAMPLE_PLACEMENT: components['defs']['AdaptyPlacement'] = {
  developer_id: 'test_placement',
  ab_test_name: 'test_ab',
  audience_name: 'all_users',
  revision: 1,
  placement_audience_version_id: 'v1',
};

const SAMPLE_VARIATION: components['defs']['AdaptyFlowPaywall'] = {
  placement: SAMPLE_PLACEMENT,
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
};

/**
 * GetFlow request
 */
export const GET_FLOW_REQUEST: components['requests']['GetFlow.Request'] = {
  method: 'get_flow',
  placement_id: 'test_placement',
};

/**
 * GetFlow response
 */
export const GET_FLOW_RESPONSE: components['requests']['GetFlow.Response'] = {
  success: {
    placement: SAMPLE_PLACEMENT,
    flow_id: 'flow_test_placement',
    flow_name: 'test_placement',
    variation_id: 'variation_123',
    variations: [SAMPLE_VARIATION],
    response_created_at: 1704067200000,
  },
};

/**
 * GetFlow error response
 */
export const GET_FLOW_RESPONSE_ERROR: components['requests']['GetFlow.Response'] =
  {
    error: {
      adapty_code: 2,
      message: 'Flow not found',
      detail: 'No flow exists for the specified placement',
    },
  };

/**
 * GetFlowForDefaultAudience request
 */
export const GET_FLOW_FOR_DEFAULT_AUDIENCE_REQUEST: components['requests']['GetFlowForDefaultAudience.Request'] =
  {
    method: 'get_flow_for_default_audience',
    placement_id: 'test_placement_default',
  };

/**
 * GetFlowForDefaultAudience response
 */
export const GET_FLOW_FOR_DEFAULT_AUDIENCE_RESPONSE: components['requests']['GetFlowForDefaultAudience.Response'] =
  {
    success: {
      placement: {
        developer_id: 'test_placement_default',
        ab_test_name: 'default_ab_test',
        audience_name: 'default_audience',
        revision: 1,
        placement_audience_version_id: 'default_v1',
      },
      flow_id: 'flow_default_audience',
      flow_name: 'test_placement_default',
      variation_id: 'default_variation_123',
      variations: [
        {
          ...SAMPLE_VARIATION,
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
        },
      ],
      response_created_at: 1704067200000,
    },
  };

/**
 * GetPaywallProducts request (now carries a flow)
 */
export const GET_PAYWALL_PRODUCTS_REQUEST: components['requests']['GetPaywallProducts.Request'] =
  {
    method: 'get_paywall_products',
    flow: {
      placement: SAMPLE_PLACEMENT,
      flow_id: 'test_flow_id',
      flow_name: 'Test Flow',
      variation_id: 'test_variation_123',
      variations: [
        {
          ...SAMPLE_VARIATION,
          variation_id: 'test_variation_123',
          products: [
            {
              vendor_product_id: 'com.example.monthly',
              adapty_product_id: 'monthly_id',
              access_level_id: 'premium',
              product_type: 'subscription',
            },
          ],
        },
      ],
      response_created_at: 1704067200000,
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
        paywall_name: 'Test Flow',
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
      detail: 'Unable to fetch products for the specified flow',
    },
  };

/**
 * LogShowFlow request
 */
export const LOG_SHOW_FLOW_REQUEST: components['requests']['LogShowFlow.Request'] =
  {
    method: 'log_show_flow',
    flow: {
      placement: SAMPLE_PLACEMENT,
      flow_id: 'flow_test_placement',
      flow_name: 'test_placement',
      variation_id: 'variation_123',
      variations: [{ ...SAMPLE_VARIATION, products: [] }],
      response_created_at: 1704067200000,
    },
  };

/**
 * LogShowFlow response
 */
export const LOG_SHOW_FLOW_RESPONSE: components['requests']['LogShowFlow.Response'] =
  {
    success: true,
  };

/**
 * OpenWebPaywall request (product-only)
 */
export const OPEN_WEB_PAYWALL_REQUEST_WITH_PRODUCT: components['requests']['OpenWebPaywall.Request'] =
  {
    method: 'open_web_paywall',
    open_in: 'browser_out_app',
    product: {
      vendor_product_id: 'com.example.product',
      adapty_product_id: 'adapty_product',
      access_level_id: 'premium',
      product_type: 'subscription',
      paywall_product_index: 0,
      paywall_variation_id: 'variation_123',
      paywall_ab_test_name: 'test_ab',
      paywall_name: 'test_placement',
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
 * CreateWebPaywallUrl request (product-only)
 */
export const CREATE_WEB_PAYWALL_URL_REQUEST: components['requests']['CreateWebPaywallUrl.Request'] =
  {
    method: 'create_web_paywall_url',
    product: {
      vendor_product_id: 'com.example.product',
      adapty_product_id: 'adapty_product',
      access_level_id: 'premium',
      product_type: 'subscription',
      paywall_product_index: 0,
      paywall_variation_id: 'variation_123',
      paywall_ab_test_name: 'test_ab',
      paywall_name: 'test_placement',
    },
  };

/**
 * CreateWebPaywallUrl response
 */
export const CREATE_WEB_PAYWALL_URL_RESPONSE: components['requests']['CreateWebPaywallUrl.Response'] =
  {
    success: 'https://example.adapty.io/web-paywall-url',
  };
