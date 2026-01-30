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


export interface IdentifyParamsInput {
  ios?: {
    appAccountToken?: string;
  };
  android?: {
    obfuscatedAccountId?: string;
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

/**
 * Android purchase parameters structure
 * @public
 */
export interface AdaptyAndroidPurchaseParams {
  /**
   * Android subscription update parameters
   * @platform android
   */
  subscriptionUpdateParams?: {
    oldSubVendorProductId: string;
    prorationMode: AdaptyAndroidSubscriptionUpdateReplacementMode;
  };
  /**
   * Whether the offer is personalized
   * @platform android
   * @see {@link https://developer.android.com/google/play/billing/integrate#personalized-price}
   */
  isOfferPersonalized?: boolean;
}

export interface AdaptyAndroidSubscriptionUpdateParameters {
  oldSubVendorProductId: string;
  prorationMode: AdaptyAndroidSubscriptionUpdateReplacementMode;
  /**
   * @deprecated Use {@link AdaptyAndroidPurchaseParams.isOfferPersonalized} instead.
   * This field has been moved to the upper level in the new structure.
   *
   * @example
   * // OLD (deprecated):
   * android: {
   *   oldSubVendorProductId: 'old_product_id',
   *   prorationMode: 'charge_prorated_price',
   *   isOfferPersonalized: true  // This field is deprecated
   * }
   *
   * // NEW:
   * android: {
   *   subscriptionUpdateParams: {
   *     oldSubVendorProductId: 'old_product_id',
   *     prorationMode: 'charge_prorated_price'
   *   },
   *   isOfferPersonalized: true  // Moved to upper level
   * }
   */
  isOfferPersonalized?: boolean;
}

export type MakePurchaseParamsInput =
  | {
      /**
       * Android purchase parameters
       * @platform android
       */
      android?: AdaptyAndroidPurchaseParams;
    }
  | {
      /**
       * @deprecated Use the new parameter structure instead
       *
       * @example
       * // OLD (deprecated):
       * makePurchase(product, {
       *   android: {
       *     oldSubVendorProductId: 'old_product_id',
       *     prorationMode: 'charge_prorated_price',
       *     isOfferPersonalized: true
       *   }
       * });
       *
       * // NEW:
       * makePurchase(product, {
       *   android: {
       *     subscriptionUpdateParams: {
       *       oldSubVendorProductId: 'old_product_id',
       *       prorationMode: 'charge_prorated_price'
       *     },
       *     isOfferPersonalized: true,  // Note: moved to upper level
       *   }
       * });
       *
       * @platform android
       */
      android?: AdaptyAndroidSubscriptionUpdateParameters;
    };

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
