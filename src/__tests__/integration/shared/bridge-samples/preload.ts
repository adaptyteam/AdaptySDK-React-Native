/**
 * Placement preload bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for the placement preload methods.
 */

import type { components } from '@/types/api';

/**
 * PreloadFlows request
 */
export const PRELOAD_FLOWS_REQUEST: components['requests']['PreloadFlows.Request'] =
  {
    method: 'preload_flows',
    placement_ids: ['test_flow_placement', 'other_flow_placement'],
    load_timeout: 5,
  };

/**
 * PreloadFlows response
 */
export const PRELOAD_FLOWS_RESPONSE: components['requests']['PreloadFlows.Response'] =
  {
    success: true,
  };

/**
 * PreloadFlowsForDefaultAudience request
 */
export const PRELOAD_FLOWS_FOR_DEFAULT_AUDIENCE_REQUEST: components['requests']['PreloadFlowsForDefaultAudience.Request'] =
  {
    method: 'preload_flows_for_default_audience',
    placement_ids: ['test_flow_placement'],
  };

/**
 * PreloadFlowsForDefaultAudience response
 */
export const PRELOAD_FLOWS_FOR_DEFAULT_AUDIENCE_RESPONSE: components['requests']['PreloadFlowsForDefaultAudience.Response'] =
  {
    success: true,
  };

/**
 * PreloadFlows error response
 *
 * The native SDKs report one aggregated error for the whole batch rather than
 * a failure per placement.
 */
export const PRELOAD_FLOWS_RESPONSE_ERROR: components['requests']['PreloadFlows.Response'] =
  {
    error: {
      adapty_code: 2005,
      message: 'Network failed',
      detail: 'Failed to preload one or more placements',
    },
  };
