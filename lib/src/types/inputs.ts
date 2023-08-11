import type { Adapty } from '@/adapty-handler';
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
  ERROR: 'error',
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

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const AttributionSource = Object.freeze({
  Adjust: 'adjust',
  AppsFlyer: 'appsflyer',
  AppleSearchAds: 'apple_search_ads',
  Branch: 'branch',
  Custom: 'custom',
});

export type AttributionSource =
  (typeof AttributionSource)[keyof typeof AttributionSource];

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
export type FetchPolicy = (typeof FetchPolicy)[keyof typeof FetchPolicy];

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
   * @deprecated Turned on by default
   */
  lockMethodsUntilReady?: boolean;
  /**
   * Does not activate SDK until any other method is called
   * Fixes annoying iOS simulator auhtentication
   */
  __debugDeferActivation?: boolean;
  ios?: {
    /**
     * Controls what APIs from StoreKit 2 would be used
     *
     * Read more: {@link https://docs.adapty.io/docs/displaying-products#adapty-sdk-version-250-and-higher}
     * @default 'disabled'
     */
    storeKit2Usage?: IosStorekit2Usage;
    /**
     * Disables IDFA collection
     * @default false
     */
    idfaCollectionDisabled?: boolean;
    /**
     * Enables a feature of collecting logs with at servers
     * Read more {@link https://docs.adapty.io/docs/ios-configuring#collecting-usage-logs }
     * @defaultValue `false`
     */
    enableUsageLogs?: boolean;
  };
}

export interface GetPaywallProductsParamsInput {}

export const AdaptyAndroidSubscriptionUpdateReplacementMode = Object.freeze({
  ChargeFullPrice: 'charge_full_price',
  Deferred: 'deferred',
  WithoutProration: 'without_proration',
  ChargeProratedPrice: 'charge_prorated_price',
  WithTimeProration: 'with_time_proration',
});
//  satisfies Record<
//   string,
//   Schema['Input.AdaptyAndroidSubscriptionUpdateParameters']['replacement_mode']
// >;

export type AdaptyAndroidSubscriptionUpdateReplacementMode =
  (typeof AdaptyAndroidSubscriptionUpdateReplacementMode)[keyof typeof AdaptyAndroidSubscriptionUpdateReplacementMode];

export interface AdaptyAndroidSubscriptionUpdateParameters {
  oldSubVendorProductId: string;
  prorationMode: AdaptyAndroidSubscriptionUpdateReplacementMode;
  isOfferPersonalized?: boolean;
}

export interface MakePurchaseParamsInput {
  android?: AdaptyAndroidSubscriptionUpdateParameters;
}
export const IosStorekit2Usage = Object.freeze({
  /**
   * Adapty will use the legacy logic, based on receipt analysis and validation.
   * However, in rare situations (and in Sandbox mode - always)
   * the reecipt is not present on the device at the first startup,
   * therefore this option will return an error.
   */
  Disabled: 'disabled',
  /**
   * Adapty will utilise StoreKit 2 logic to determine introductory offer eligibility.
   * @requires iOS 15.0+
   * @remarks
   * StoreKit 2 is available since iOS 15.0. Adapty will implement the legacy logic for older versions.
   */
  EnabledForIntroductoryOfferEligibility:
    'enabled_for_introductory_offer_eligibility',
});
export type IosStorekit2Usage =
  (typeof IosStorekit2Usage)[keyof typeof IosStorekit2Usage];
