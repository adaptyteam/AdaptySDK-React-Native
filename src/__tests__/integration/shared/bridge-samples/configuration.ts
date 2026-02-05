/**
 * Configuration-related bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for configuration methods.
 */

import type { components } from '@/types/api';

/**
 * SetLogLevel request
 */
export const SET_LOG_LEVEL_REQUEST: components['requests']['SetLogLevel.Request'] =
  {
    method: 'set_log_level',
    value: 'error',
  };

/**
 * SetLogLevel response
 */
export const SET_LOG_LEVEL_RESPONSE: components['requests']['SetLogLevel.Response'] =
  {
    success: true,
  };

/**
 * SetFallback request with asset_id
 */
export const SET_FALLBACK_REQUEST_WITH_ASSET_ID: components['requests']['SetFallback.Request'] =
  {
    method: 'set_fallback',
    asset_id: 'fallback_asset_123',
  };

/**
 * SetFallback request with path
 */
export const SET_FALLBACK_REQUEST_WITH_PATH: components['requests']['SetFallback.Request'] =
  {
    method: 'set_fallback',
    path: '/path/to/fallback.json',
  };

/**
 * SetFallback successful response
 */
export const SET_FALLBACK_RESPONSE_SUCCESS: components['requests']['SetFallback.Response'] =
  {
    success: true,
  };

/**
 * SetIntegrationIdentifier request
 */
export const SET_INTEGRATION_IDENTIFIER_REQUEST: components['requests']['SetIntegrationIdentifier.Request'] =
  {
    method: 'set_integration_identifiers',
    key_values: {
      appmetrica_device_id: 'device_123',
      appmetrica_profile_id: 'profile_456',
    },
  };

/**
 * SetIntegrationIdentifier successful response
 */
export const SET_INTEGRATION_IDENTIFIER_RESPONSE_SUCCESS: components['requests']['SetIntegrationIdentifier.Response'] =
  {
    success: true,
  };

/**
 * UpdateAttributionData request
 */
export const UPDATE_ATTRIBUTION_DATA_REQUEST: components['requests']['UpdateAttributionData.Request'] =
  {
    method: 'update_attribution_data',
    attribution: '{"campaign":"summer_sale","source":"google"}',
    source: 'appsflyer',
  };

/**
 * UpdateAttributionData successful response
 */
export const UPDATE_ATTRIBUTION_DATA_RESPONSE_SUCCESS: components['requests']['UpdateAttributionData.Response'] =
  {
    success: true,
  };
