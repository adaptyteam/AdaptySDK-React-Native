import { NativeModules } from 'react-native';
import { LogContext } from '../logger/logContext';

// Collection of valid arguments and values to pass to a native layer
export type ArgMap = Partial<
  Record<(typeof bridgeArg)[keyof typeof bridgeArg], string | number | boolean>
>;

// Module name in native code
const MODULE_NAME = 'RNAdapty';
// Routing function name in native code
const HANDLER_NAME = 'handle';

const caller = NativeModules[MODULE_NAME][HANDLER_NAME] as (
  methodName: BridgeMethodName,
  args: ArgMap,
) => Promise<string | null>;

/**
 * Calls native methods of the Adapty SDK.
 *
 * @param methodName - The name of the method to call.
 * @param args - A hashmap of arguments to pass to the method.
 * @returns A promise that resolves with either a stringed JSON or null
 *
 * @throws
 * An error depending on the method called. Errors should be handled by the caller.
 *
 * @internal
 */
export async function bridgeCall(
  methodName: BridgeMethodName,
  args: ArgMap,
  ctx?: LogContext,
): Promise<string | null> {
  const log = ctx?.bridge({ methodName: 'bridgeCall' });
  log?.start({ methodName, args });

  try {
    const response = await caller(methodName, args);

    log?.success({ response });
    return response;
  } catch (error) {
    log?.success({ error });
    throw error;
  }
}

type BridgeMethodName =
  // Activate
  | 'activate'
  // Attribution
  | 'update_attribution'
  // Paywalls
  | 'get_paywall'
  | 'get_paywall_products'
  | 'log_show_onboarding'
  | 'log_show_paywall'
  | 'set_fallback_paywalls'
  | 'set_variation_id'
  // Profile
  | 'get_profile'
  | 'identify'
  | 'logout'
  | 'update_profile'
  // Purchases
  | 'make_purchase'
  | 'present_code_redemption_sheet'
  | 'restore_purchases'
  | 'set_log_level';

export const bridgeArg = Object.freeze({
  ATTRIBUTION: 'attribution',
  FETCH_POLICY: 'fetch_policy',
  LOCALE: 'locale',
  ID: 'id',
  LOG_LEVEL: 'log_level',
  NETWORK_USER_ID: 'network_user_id',
  OBSERVER_MODE: 'observer_mode',
  ONBOARDING_PARAMS: 'onboarding_params',
  PARAMS: 'params',
  PAYWALL: 'paywall',
  PAYWALLS: 'paywalls',
  PRODUCT: 'product',
  SDK_KEY: 'sdk_key',
  SOURCE: 'source',
  TRANSACTION_ID: 'transaction_id',
  USER_ID: 'user_id',
  VARIATION_ID: 'variation_id',
  VALUE: 'value',
  ENABLE_USAGE_LOGS: 'enable_usage_logs',
  OLD_SUB_VENDOR_PRODUCT_ID: 'old_sub_vendor_product_id',
  PRORATION_MODE: 'proration_mode',
});
