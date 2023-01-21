import { Adapty } from '../sdk/adapty';
/**
 * Log levels for the SDK
 *
 * @remarks
 * Logging is performed on a native side.
 * So you are expected to watch logs in Xcode or Android Studio.
 */
export const LogLevel = Object.freeze({
  /**
   * Logs any additional information that may be useful during debugging,
   * such as function calls, API queries, etc.
   */
  VERBOSE: 'verbose',
  /**
   * Logs only errors
   */
  ERROR: 'ERROR',
  /**
   * Logs messages from the SDK
   * that do not cause critical errors,
   * but are worth paying attention to
   */
  WARN: 'warn',
  /**
   * Logs various information messages,
   * such as those that log the lifecycle of various modules
   */
  INFO: 'info',
});

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

export const AttributionSource = Object.freeze({
  Adjust: 'Adjust',
  AppsFlyer: 'AppsFlyer',
  AppleSearchAds: 'AppleSearchAds',
  Branch: 'Branch',
  Custom: 'Custom',
});

export type AttributionSource =
  typeof AttributionSource[keyof typeof AttributionSource];

export const FetchPolicy = Object.freeze({
  /**
   * The function will try
   * to download the products anyway,
   * although the `introductoryOfferEligibility` values may be unknown.
   */
  DEFAULT: 'default',
  /**
   * The Adapty SDK will wait for the validation
   * and the validation itself, only then the products will be returned.
   */
  WAIT_FOR_RECEIPT_VALIDATION: 'wait_for_receipt_validation',
});
export type FetchPolicy = typeof FetchPolicy[keyof typeof FetchPolicy];

/**
 * Describes optional parameters for the {@link Adapty.activate} method.
 */
export interface ActivateParamsInput {
  /**
   * Turn it on if you handle purchases and subscription status yourself
   * and use Adapty for sending subscription events and analytics
   *
   * @defaultValue `false`
   */
  observerMode?: boolean;
  /**
   * User identifier in your system
   *
   * @remarks
   * If none of the parameters are passed, the SDK will generate an ID
   * and use it for a current device.
   * Use your own ID:
   * 1. If you want to support a cross-device experience
   * 2. If you have your own authentication system,
   *    and you want to associate adapty profile with your user
   */
  customerUserId?: string;
  /**
   * Log level for the SDK
   *
   * @remarks
   * Logging is performed on a native side.
   * So you are expected to watch logs in Xcode or Android Studio.
   *
   * @defaultValue `VERBOSE`
   */
  logLevel?: LogLevel;

  /**
   * Locks methods threads until the SDK is ready.
   * @defaultValue `false`
   */
  lockMethodsUntilReady?: boolean;
}

export interface GetPaywallProductsParamsInput {
  ios?: {
    fetchPolicy?: FetchPolicy;
  };
}
