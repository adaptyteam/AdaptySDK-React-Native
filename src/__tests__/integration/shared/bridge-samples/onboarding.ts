/**
 * Onboarding-related bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for onboarding methods.
 */

import type { components } from '@/types/api';

/**
 * GetOnboarding request
 */
export const GET_ONBOARDING_REQUEST: components['requests']['GetOnboarding.Request'] =
  {
    method: 'get_onboarding',
    placement_id: 'test_onboarding_placement',
    load_timeout: 5,
    fetch_policy: {
      type: 'reload_revalidating_cache_data',
    },
  };

/**
 * GetOnboarding response
 */
export const GET_ONBOARDING_RESPONSE: components['requests']['GetOnboarding.Response'] =
  {
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

/**
 * GetOnboardingForDefaultAudience request
 */
export const GET_ONBOARDING_FOR_DEFAULT_AUDIENCE_REQUEST: components['requests']['GetOnboardingForDefaultAudience.Request'] =
  {
    method: 'get_onboarding_for_default_audience',
    placement_id: 'test_onboarding_placement',
    fetch_policy: {
      type: 'reload_revalidating_cache_data',
    },
  };
