package com.adapty.react

enum class ParamKey(val value: String) {
    ATTRIBUTION("attribution"),
    ID("id"),
    LOG_LEVEL("log_level"),
    NETWORK_USER_ID("network_user_id"),
    OBSERVER_MODE("observer_mode"),
    ONBOARDING_PARAMS("onboarding_params"),
    PARAMS("params"),
    PAYWALL("paywall"),
    PAYWALLS("paywalls"),
    PRODUCT("product"),
//    PRODUCT_IDS("product_ids"),
    SDK_KEY("sdk_key"),
    SOURCE("source"),
    TRANSACTION_ID("transaction_id"),
    USER_ID("user_id"),
    VARIATION_ID("variation_id"),
    VALUE("value"),
    LOCALE("locale"),
    PLACEMENT_ID("placement_id"),
    FETCH_POLICY("fetch_policy"),
    LOAD_TIMEOUT("load_timeout"),
    IS_OFFER_PERSONALIZED("is_offer_personalized"),
//    ENABLE_USAGE_LOGS("enable_usage_logs"),
}

enum class MethodName(val value: String) {
    ACTIVATE("activate"),
    UPDATE_ATTRIBUTION("update_attribution"),
    GET_PAYWALL("get_paywall"),
    GET_PAYWALL_PRODUCTS("get_paywall_products"),
//    GET_PRODUCTS_INTRODUCTORY_OFFER_ELIGIBILITY("get_products_introductory_offer_eligibility"),
    LOG_SHOW_ONBOARDING("log_show_onboarding"),
    LOG_SHOW_PAYWALL("log_show_paywall"),
    SET_FALLBACK_PAYWALLS("set_fallback_paywalls"),
    SET_VARIATION_ID("set_variation_id"),
    GET_PROFILE("get_profile"),
    IDENTIFY("identify"),
    LOGOUT("logout"),
    UPDATE_PROFILE("update_profile"),
    MAKE_PURCHASE("make_purchase"),
    // PRESENT_CODE_REDEMPTION_SHEET("present_code_redemption_sheet"),
    RESTORE_PURCHASES("restore_purchases"),
    SET_LOG_LEVEL("set_log_level"),
    NOT_IMPLEMENTED("not_implemented");

    companion object {
        fun fromString(value: String): MethodName {
            return values().find { it.value == value } ?: NOT_IMPLEMENTED
        }
    }
}

enum class EventName(val value: String) {
//    ON_DEFERRED_PURCHASE("onDeferredPurchase"),
    ON_LATEST_PROFILE_LOAD("onLatestProfileLoad");
}
