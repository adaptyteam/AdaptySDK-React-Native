"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyAndroidSubscriptionUpdateReplacementMode = exports.FetchPolicy = exports.LogLevel = void 0;
/**
 * Log levels for the SDK
 *
 * @remarks
 * Logging is performed on a native side.
 * So you are expected to watch logs in Xcode or Android Studio.
 */
exports.LogLevel = Object.freeze({
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
exports.FetchPolicy = Object.freeze({
    ReloadRevalidatingCacheData: 'reload_revalidating_cache_data',
    ReturnCacheDataElseLoad: 'return_cache_data_else_load',
    ReturnCacheDataIfNotExpiredElseLoad: 'return_cache_data_if_not_expired_else_load',
});
exports.AdaptyAndroidSubscriptionUpdateReplacementMode = Object.freeze({
    ChargeFullPrice: 'charge_full_price',
    Deferred: 'deferred',
    WithoutProration: 'without_proration',
    ChargeProratedPrice: 'charge_prorated_price',
    WithTimeProration: 'with_time_proration',
});
//# sourceMappingURL=inputs.js.map