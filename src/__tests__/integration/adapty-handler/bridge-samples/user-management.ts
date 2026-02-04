/**
 * User management bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for user management methods.
 */

import type { components } from '@/types/api';

/**
 * Identify request with customer_user_id
 */
export const IDENTIFY_REQUEST: components['requests']['Identify.Request'] = {
  method: 'identify',
  customer_user_id: 'user_12345',
};

/**
 * Identify request with iOS app_account_token
 */
export const IDENTIFY_REQUEST_WITH_APP_ACCOUNT_TOKEN: components['requests']['Identify.Request'] = {
  method: 'identify',
  customer_user_id: 'user_12345',
  parameters: {
    app_account_token: 'ios_token_abc',
  },
};

/**
 * Identify request with Android obfuscatedAccountId
 */
export const IDENTIFY_REQUEST_WITH_ANDROID_ACCOUNT: components['requests']['Identify.Request'] = {
  method: 'identify',
  customer_user_id: 'user_12345',
  parameters: {
    obfuscated_account_id: 'android_account_xyz',
  },
};

/**
 * Identify successful response
 */
export const IDENTIFY_RESPONSE_SUCCESS: components['requests']['Identify.Response'] = {
  success: true,
};

/**
 * Logout request
 */
export const LOGOUT_REQUEST: components['requests']['Logout.Request'] = {
  method: 'logout',
};

/**
 * Logout successful response
 */
export const LOGOUT_RESPONSE_SUCCESS: components['requests']['Logout.Response'] = {
  success: true,
};
