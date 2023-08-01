import Foundation

enum ParamKey: String {
    case attribution = "attribution"
    case fetchPolicy = "fetch_policy"
    case id = "id"
    case logLevel = "log_level"
    case networkUserId = "network_user_id"
    case observerMode = "observer_mode"
    case onboardingParams = "onboarding_params"
    case params = "params"
    case paywall = "paywall"
    case paywalls = "paywalls"
    case product = "product"
    case productIds = "product_ids"
    case sdkKey = "sdk_key"
    case source = "source"
    case transactionId = "transaction_id"
    case userId = "user_id"
    case variationId = "variation_id"
    case value = "value"
    case locale = "locale"
    case enableUsageLogs = "enable_usage_logs"
    case idfaDisabled = "idfa_collection_disabled"
    case storekit2Usage = "storekit2_usage"
    case bridgeVersion = "PLIST Bridge version"
}

enum MethodName: String {
    case activate = "activate"
    case updateAttribution = "update_attribution"
    case getPaywall = "get_paywall"
    case getPaywallProducts = "get_paywall_products"
    case getProductsIntroductoryOfferEligibility = "get_products_introductory_offer_eligibility"
    case logShowOnboarding = "log_show_onboarding"
    case logShowPaywall = "log_show_paywall"
    case setFallbackPaywalls = "set_fallback_paywalls"
    case setVariationId = "set_variation_id"
    case getProfile = "get_profile"
    case identify
    case logout
    case updateProfile = "update_profile"
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
