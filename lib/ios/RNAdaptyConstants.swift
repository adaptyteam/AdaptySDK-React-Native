//
//  RNAdaptyConstants.swift
//  react-native-adapty
//
//  Created by Ivan Dorofeyev on 12/25/22.
//

import Foundation

struct Const {
    static let ATTRIBUTION = "attribution"
    static let FETCH_POLICY = "fetch_policy"
    static let ID = "id"
    static let LOG_LEVEL = "log_level"
    static let NETWORK_USER_ID = "network_user_id"
    static let OBSERVER_MODE = "observer_mode"
    static let ONBOARDING_PARAMS = "onboarding_params"
    static let PARAMS = "params"
    static let PAYWALL = "paywall"
    static let PAYWALLS = "paywalls"
    static let PRODUCT = "product"
    static let SDK_KEY = "sdk_key"
    static let SOURCE = "source"
    static let TRANSACTION_ID = "transaction_id"
    static let USER_ID = "user_id"
    static let VARIATION_ID = "variation_id"
    static let VALUE = "value"
}

enum MethodName: String {
    // Activate
    case activate = "activate"
    // Attribution
    case updateAttribution = "update_attribution"
    // Paywalls
    case getPaywall = "get_paywall"
    case getPaywallProducts = "get_paywall_products"
    case logShowOnboarding = "log_show_onboarding"
    case logShowPaywall = "log_show_paywall"
    case setFallbackPaywalls = "set_fallback_paywalls"
    case setVariationId = "set_variation_id"
    // Profile
    case getProfile = "get_profile"
    case identify
    case logout
    case updateProfile = "update_profile"
    // Purchases
    case makePurchase = "make_purchase"
    case presentCodeRedemptionSheet = "present_code_redemption_sheet"
    case restorePurchases = "restore_purchases"
    
    case setLogLevel = "set_log_level"
    
    case notImplemented = "not_implemented"
    case testWrap = "__test__"
}

enum EventName: String {
    case onDeferredPurchase = "onDeferredPurchase"
    case onLatestProfileLoad = "onLatestProfileLoad"
}

struct LogLevelBridge {
    static let VERBOSE = "verbose"
    static let ERROR = "error"
    static let WARN = "warn"
    static let INFO = "info"
}
