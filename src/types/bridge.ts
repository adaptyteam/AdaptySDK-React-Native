import type { EmitterSubscription } from 'react-native';
import type { AdaptyProfile } from '@/types';

/**
 * Valid list of expected parameters to the handlers
 * Must be the same as
 * - iOS RNAConstants.ParamKey
 * @internal
 */
export const ParamKeys = [
  'attribution',
  'enable_usage_logs',
  'fetch_policy',
  'file_location',
  'load_timeout',
  'placement_id',
  'id',
  'idfa_collection_disabled',
  'ip_address_collection_disabled',
  'is_offer_personalized',
  'locale',
  'log_level',
  'network_user_id',
  'observer_mode',
  'old_sub_vendor_product_id',
  'onboarding_params',
  'params',
  'paywall',
  'product',
  'product_ids',
  'replacement_mode',
  'sdk_key',
  'source',
  'storekit2_usage',
  'transaction_id',
  'user_id',
  'value',
  'variation_id',
  'PLIST Bridge version',
] as const;
export type ParamKey = (typeof ParamKeys)[number];

/**
 * Valid list of callable bridge handlers
 * Must be the same as
 * - iOS RNAConstants.MethodName
 * @internal
 */
export const MethodNames = [
  'activate',
  'adapty_ui_activate',
  'adapty_ui_create_paywall_view',
  'adapty_ui_dismiss_paywall_view',
  'adapty_ui_present_paywall_view',
  'adapty_ui_show_dialog',
  'adapty_ui_create_onboarding_view',
  'adapty_ui_dismiss_onboarding_view',
  'adapty_ui_present_onboarding_view',
  'create_web_paywall_url',
  'is_activated',
  'get_paywall',
  'get_paywall_for_default_audience',
  'get_paywall_products',
  'get_onboarding',
  'get_onboarding_for_default_audience',
  'get_profile',
  'identify',
  'log_show_onboarding',
  'log_show_paywall',
  'logout',
  'make_purchase',
  'open_web_paywall',
  'present_code_redemption_sheet',
  'report_transaction',
  'restore_purchases',
  'set_fallback',
  'set_integration_identifiers',
  'set_log_level',
  'update_attribution_data',
  'update_collecting_refund_data_consent',
  'update_profile',
  'update_refund_preference',
] as const;
export type MethodName = (typeof MethodNames)[number];

/**
 * Types of values that can be passed
 * to the bridge without corruption
 */
export type Serializable =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;

/**
 * Interface of error that emit from native SDK
 */
export interface AdaptyNativeError {
  adaptyCode: number;
  message: string;
  detail?: string | undefined;
}

/**
 * Interface of error that was raised by native bridge
 */
export interface AdaptyBridgeError {
  errorType: string;
  name?: string;
  type?: string;
  underlyingError?: string;
  description?: string;
}

interface EventMap {
  onLatestProfileLoad: string;
}

type UserEventName = keyof EventMap;

export type AddListenerGeneric<E extends UserEventName, Data> = (
  event: E,
  callback: (data: Data) => void | Promise<void>,
) => EmitterSubscription;

export type AddListenerFn = AddListenerGeneric<
  'onLatestProfileLoad',
  AdaptyProfile
>;
