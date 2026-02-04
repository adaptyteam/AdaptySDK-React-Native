/**
 * Installation status bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for installation status methods.
 */

import type { components } from '@/types/api';

/**
 * GetCurrentInstallationStatus request
 */
export const GET_CURRENT_INSTALLATION_STATUS_REQUEST: components['requests']['GetCurrentInstallationStatus.Request'] = {
  method: 'get_current_installation_status',
};

/**
 * GetCurrentInstallationStatus response - determined status
 */
export const GET_CURRENT_INSTALLATION_STATUS_RESPONSE_DETERMINED: components['requests']['GetCurrentInstallationStatus.Response'] = {
  success: {
    status: 'determined',
    details: {
      install_id: 'install_abc123',
      install_time: '2024-01-15T10:30:00Z',
      app_launch_count: 42,
      payload: 'test_payload_data',
    },
  },
};

/**
 * GetCurrentInstallationStatus response - not determined
 */
export const GET_CURRENT_INSTALLATION_STATUS_RESPONSE_NOT_DETERMINED: components['requests']['GetCurrentInstallationStatus.Response'] = {
  success: {
    status: 'not_determined',
  },
};

/**
 * GetCurrentInstallationStatus response - not available
 */
export const GET_CURRENT_INSTALLATION_STATUS_RESPONSE_NOT_AVAILABLE: components['requests']['GetCurrentInstallationStatus.Response'] = {
  success: {
    status: 'not_available',
  },
};
