import { AdaptyUiMediaCache } from '@/ui/types';
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

export const FetchPolicy = Object.freeze({
  ReloadRevalidatingCacheData: 'reload_revalidating_cache_data',
  ReturnCacheDataElseLoad: 'return_cache_data_else_load',
  ReturnCacheDataIfNotExpiredElseLoad:
    'return_cache_data_if_not_expired_else_load',
});
export type FetchPolicy = (typeof FetchPolicy)[keyof typeof FetchPolicy];

export type GetPlacementParamsInput =
  GetPlacementForDefaultAudienceParamsInput & {
    /**
     * This value limits the timeout (in milliseconds) for this method.
     *
     * @remarks
     * If the timeout is reached, cached data or local fallback will be returned.
     */
    loadTimeoutMs?: number;
  };

export type GetPlacementForDefaultAudienceParamsInput =
  | {
      /**
       * Fetch policy
       *
       * @remarks
       * By default SDK will try to load data from server and will return cached data in case of failure.
       * Otherwise use `'return_cache_data_else_load'` to return cached data if it exists.
       */
      fetchPolicy?: Exclude<
        FetchPolicy,
        'return_cache_data_if_not_expired_else_load'
      >;
    }
  | {
      /**
       * Fetch policy
       *
       * @remarks
       * By default SDK will try to load data from server and will return cached data in case of failure.
       * Otherwise use `'return_cache_data_else_load'` to return cached data if it exists.
       */
      fetchPolicy: Extract<
        FetchPolicy,
        'return_cache_data_if_not_expired_else_load'
      >;
      /**
       * Max age for cached data.
       *
       * @remarks
       * Max time (in seconds) the cache is valid in case of `'return_cache_data_if_not_expired_else_load'` fetch policy.
       */
      maxAgeSeconds: number;
    };

/**
 * Describes optional parameters for the {@link activate} method.
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
   */
  logLevel?: LogLevel;

  serverCluster?: 'default' | 'eu' | 'cn';
  backendBaseUrl?: string;
  backendFallbackBaseUrl?: string;
  backendConfigsBaseUrl?: string;
  backendProxyHost?: string;
  backendProxyPort?: number;
  activateUi?: boolean;
  mediaCache?: AdaptyUiMediaCache;

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
  /**
   * Ignores multiple activation attempts on fast refresh.
   * If true, skips activation if SDK is already activated.
   */
  __ignoreActivationOnFastRefresh?: boolean;
  /**
   * Disables IP address collection
   * @defaultValue `false`
   */
  ipAddressCollectionDisabled?: boolean;
  ios?: {
    /**
     * Disables IDFA collection
     * @default false
     */
    idfaCollectionDisabled?: boolean;
  };
  android?: {
    /**
     * Disables Google AdvertisingID collection
     * @default false
     */
    adIdCollectionDisabled?: boolean;
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

export type FileLocation = {
  ios: {
    fileName: string;
  };
  android:
    | {
        relativeAssetPath: string;
      }
    | {
        rawResName: string;
      };
};
