/**
 * Event bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format of events emitted by
 * the native bridge.
 */

import type { components } from '@/types/api';

/**
 * Event.DidLoadLatestProfile - emitted after purchase
 */
export const EVENT_DID_LOAD_LATEST_PROFILE: components['events']['Event.DidLoadLatestProfile'] =
  {
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

/**
 * Event.DidReceivePromotedPurchase — App Store promoted product.
 */
export const EVENT_DID_RECEIVE_PROMOTED_PURCHASE: components['events']['Event.DidReceivePromotedPurchase'] =
  {
    id: 'did_receive_promoted_purchase',
    product: {
      purchase_intent_id: 'purchase_intent_1',
      vendor_product_id: 'yearly.premium.6999',
      localized_description: 'Get premium features with this plan',
      localized_title: 'Yearly Premium Plan',
      is_family_shareable: false,
      price: {
        amount: 69.99,
        currency_code: 'USD',
        currency_symbol: '$',
        localized_string: '$69.99',
      },
      subscription: {
        group_identifier: 'group_premium',
        period: { unit: 'year', number_of_units: 1 },
        pricing_terms: {
          billing_plan_id: 'monthly',
          billing_price: {
            amount: 6.99,
            currency_code: 'USD',
            localized_string: '$6.99',
          },
          billing_period: { unit: 'month', number_of_units: 1 },
          commitment_info: {
            price: {
              amount: 83.88,
              currency_code: 'USD',
              localized_string: '$83.88',
            },
            period: { unit: 'year', number_of_units: 1 },
          },
        },
      },
    },
  };
