/**
 * Profile-related bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for profile methods.
 */

import type { components } from '@/types/api';

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
