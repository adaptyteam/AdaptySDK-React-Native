/**
 * Store message bridge samples for Adapty SDK integration tests
 *
 * These samples represent the exact JSON format sent to and received from
 * the native bridge for the store message methods.
 */

import type { components } from '@/types/api';

/**
 * GetPendingStoreMessageTypes request (iOS only)
 */
export const GET_PENDING_STORE_MESSAGE_TYPES_REQUEST: components['requests']['GetPendingStoreMessageTypes.Request'] =
  {
    method: 'get_pending_store_message_types',
  };

/**
 * GetPendingStoreMessageTypes response with a known and an opaque StoreKit type
 */
export const GET_PENDING_STORE_MESSAGE_TYPES_RESPONSE: components['requests']['GetPendingStoreMessageTypes.Response'] =
  {
    success: ['billing_issue', 'storekit_-42'],
  };

/**
 * ShowStoreMessage request without a filter (show all)
 */
export const SHOW_STORE_MESSAGES_REQUEST: components['requests']['ShowStoreMessage.Request'] =
  {
    method: 'show_store_messages',
  };

/**
 * ShowStoreMessage request with a type filter (iOS only)
 */
export const SHOW_STORE_MESSAGES_REQUEST_WITH_FILTER: components['requests']['ShowStoreMessage.Request'] =
  {
    method: 'show_store_messages',
    filter: ['price_increase_consent', 'billing_issue'],
  };

/**
 * ShowStoreMessage response
 */
export const SHOW_STORE_MESSAGES_RESPONSE: components['requests']['ShowStoreMessage.Response'] =
  {
    success: true,
  };

/**
 * ShowStoreMessage error response: another show is already in progress (iOS)
 */
export const SHOW_STORE_MESSAGES_RESPONSE_IN_PROGRESS: components['requests']['ShowStoreMessage.Response'] =
  {
    error: {
      adapty_code: 3201,
      message: 'Another store message show operation is already in progress.',
    },
  };
