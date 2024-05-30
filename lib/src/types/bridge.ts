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
  'get_paywall',
  'get_paywall_products',
  'get_products_introductory_offer_eligibility',
  'get_profile',
  'identify',
  'log_show_onboarding',
  'log_show_paywall',
  'logout',
  'make_purchase',
  'not_implemented',
  'present_code_redemption_sheet',
  'restore_purchases',
  'set_fallback_paywalls',
  'set_log_level',
  'set_variation_id',
  'update_attribution',
  'update_profile',
  '__test__',
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
 * Hashmap of parameters that can be passed to the bridge
 * without any further encoding/serialization
 */
export type ParamMap = Partial<Record<ParamKey, Serializable>>;

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

export const AdaptyEvents = [
  'onLatestProfileLoad',
  'onDeferredPurchase',
] as const;
export type AdaptyEvent = (typeof AdaptyEvents)[number];

export type AddListenerGeneric<E extends AdaptyEvent, Data> = (
  event: E,
  callback: (data: Data) => void | Promise<void>,
) => EmitterSubscription;

export type AddListenerFn = AddListenerGeneric<
  'onLatestProfileLoad',
  AdaptyProfile
> &
  AddListenerGeneric<'onDeferredPurchase', AdaptyProfile>;
