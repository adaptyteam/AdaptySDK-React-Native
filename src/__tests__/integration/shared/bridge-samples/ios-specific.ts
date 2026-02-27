/**
 * iOS-specific bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for iOS-only methods.
 */

import type { components } from '@/types/api';

/**
 * PresentCodeRedemptionSheet request (iOS only)
 */
export const PRESENT_CODE_REDEMPTION_SHEET_REQUEST: components['requests']['PresentCodeRedemptionSheet.Request'] =
  {
    method: 'present_code_redemption_sheet',
  };

/**
 * PresentCodeRedemptionSheet response
 */
export const PRESENT_CODE_REDEMPTION_SHEET_RESPONSE: components['requests']['PresentCodeRedemptionSheet.Response'] =
  {
    success: true,
  };

/**
 * UpdateCollectingRefundDataConsent request (iOS only)
 */
export const UPDATE_COLLECTING_REFUND_DATA_CONSENT_REQUEST: components['requests']['UpdateCollectingRefundDataConsent.Request'] =
  {
    method: 'update_collecting_refund_data_consent',
    consent: true,
  };

/**
 * UpdateCollectingRefundDataConsent successful response
 */
export const UPDATE_COLLECTING_REFUND_DATA_CONSENT_RESPONSE_SUCCESS: components['requests']['UpdateCollectingRefundDataConsent.Response'] =
  {
    success: true,
  };

/**
 * UpdateRefundPreference request (iOS only)
 */
export const UPDATE_REFUND_PREFERENCE_REQUEST: components['requests']['UpdateRefundPreference.Request'] =
  {
    method: 'update_refund_preference',
    refund_preference: 'grant',
  };

/**
 * UpdateRefundPreference successful response
 */
export const UPDATE_REFUND_PREFERENCE_RESPONSE_SUCCESS: components['requests']['UpdateRefundPreference.Response'] =
  {
    success: true,
  };
