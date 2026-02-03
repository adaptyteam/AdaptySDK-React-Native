/**
 * Typed bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge, strictly typed against api.d.ts (generated from cross_platform.yaml).
 *
 * All request/response formats use snake_case as per native bridge specification.
 */

import type { components } from '@/types/api';

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
