import Foundation
import Adapty

private var MEMO_ACTIVATION_ARGS: [String: AnyHashable] = [:]
public func ==<K, L: Hashable, R: Hashable>(lhs: [K: L], rhs: [K: R] ) -> Bool {
    (lhs as NSDictionary).isEqual(to: rhs)
}

@objc(RNAdapty)
class RNAdapty: RCTEventEmitter, AdaptyDelegate {
    
    // MARK: - Delegate
    
    /// TODO: Describe why
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
        return [
            EventName.onDeferredPurchase.rawValue,
            EventName.onLatestProfileLoad.rawValue,
        ]
    }
    
    /// Adapty delegate function
    func didLoadLatestProfile(_ profile: AdaptyProfile) {
        if !self.hasListeners {
            return
        }
        
        guard let data = try? AdaptyContext.jsonEncoder.encode(profile),
              let str = String(data: data, encoding: .utf8)
        else {
            // should not happen
            return self.sendEvent(
                withName: EventName.onLatestProfileLoad.rawValue,
                body: "null")
        }
        
        
        self.sendEvent(withName: EventName.onLatestProfileLoad.rawValue, body: str)
    }
    
    /// TODO: Describe why
    private var hasListeners = false
    
    override func startObserving() {
        self.hasListeners = true
    }
    override func stopObserving() {
        self.hasListeners = false
    }
    
    //    func shouldAddStorePayment(for product: AdaptyDeferredProduct,
    //                               defermentCompletion makeDeferredPurchase: @escaping (AdaptyResultCompletion<AdaptyProfile>?) -> Void) -> Bool {
    //        if !self.hasListeners {
    //            return
    //        }
    //
    //        let json = Utils.encodeJson(from: AdaptyProduct(product, nil))
    //        self.sendEvent(withName: "onDeferredPurchase", body: json)
    //    }
    
    // MARK: - Handle router
    
    /// `handle` is the main function, that routes calls to a corresponding function
    /// and wraps controllers into a `AdaptyContext`
    ///
    /// Since currently synchronous bridge calls are not production-ready,
    /// all functions are considered asynchronous
    ///
    /// Definitions are sorted alphabetically
    @objc public func handle(
        _ method: NSString,
        args: NSDictionary,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        let ctx = AdaptyContext(
            args: args,
            resolver: resolver,
            rejecter: rejecter
        )
        
        switch MethodName(rawValue: method as String) ?? .notImplemented {
            // Activation
        case .activate: handleActivate(ctx)
            // Attribution
        case .updateAttribution: handleUpdateAttribution(ctx)
            // Paywalls
        case .getPaywall: handleGetPaywall(ctx)
        case .getPaywallProducts: handleGetPaywallProducts(ctx)
        case .logShowOnboarding: handleLogShowOnboarding(ctx)
        case .logShowPaywall: handleLogShowPaywall(ctx)
        case .setFallbackPaywalls: handleSetFallbackPaywalls(ctx)
        case .setVariationId: handleSetVariationId(ctx)
            // Profile
        case .getProfile: handleGetProfile(ctx)
        case .identify: handleIdentify(ctx)
        case .logout: handleLogout(ctx)
        case .updateProfile: handleUpdateProfile(ctx)
            // Purchases
        case .makePurchase: handleMakePurchase(ctx)
        case .presentCodeRedemptionSheet: handlePresentCodeRedemptionSheet(ctx)
        case .restorePurchases: handleRestorePurchases(ctx)
            // Utilities
        case .setLogLevel: handleSetLogLevel(ctx)
        case .testWrap: handleTestWrap(ctx, resolver: resolver)

        default: ctx.notImplemented()
        }
    }
    
    // MARK: - Activation
    
    private func handleActivate(_ ctx: AdaptyContext) {
        if ctx.args == MEMO_ACTIVATION_ARGS {
            return ctx.resolve()
        } else {
            MEMO_ACTIVATION_ARGS = ctx.args
        }
        
        do {
            let apiKey: String = try ctx.params.getRequiredValue(for: .sdkKey)
            let customerUserId: String? = ctx.params.getOptionalValue(for: .userId)
            let logLevel: String? = ctx.params.getOptionalValue(for: .logLevel)
            let observerMode: Bool? = ctx.params.getOptionalValue(for: .observerMode)
            let enableUsageLogs: Bool? = ctx.params.getOptionalValue(for: .enableUsageLogs)
            let idfaCollectionDisabled: Bool? = ctx.params.getOptionalValue(for: .idfaDisabled)
            let storeKit2UsageString: String? = ctx.params.getOptionalValue(for: .storekit2Usage)
            
            let storeKit2Usage: StoreKit2Usage
            switch storeKit2UsageString {
            case "enabled_for_introductory_offer_eligibility":
                storeKit2Usage = .forIntroEligibilityCheck
            default:
                storeKit2Usage = .disabled
            }
            
            // Memoize activation args
            MEMO_ACTIVATION_ARGS[ParamKey.sdkKey.rawValue] = apiKey
            MEMO_ACTIVATION_ARGS[ParamKey.userId.rawValue] = customerUserId
            
            let version = try fetchBridgeVersion()
            if let logLevel = logLevel,
               let level = AdaptyLogLevel.fromBridgeValue(logLevel) {
                Adapty.logLevel = level
            }
            
            Adapty.setCrossPlatformSDK(version: version, name: "react-native")
            Adapty.idfaCollectionDisabled = idfaCollectionDisabled ?? false
            
            Adapty.activate(
                apiKey,
                observerMode: observerMode ?? false,
                customerUserId: customerUserId,
                enableUsageLogs: enableUsageLogs ?? false,
                storeKit2Usage: storeKit2Usage
            ) { maybeErr in ctx.resolveIfOk(maybeErr) }
            
            
            Adapty.delegate = self
        } catch {
            ctx.bridgeError(error)
        }
    }
    
    // MARK: - Attribution
    
    private func handleUpdateAttribution(_ ctx: AdaptyContext) {
        do {
            let attribution: [AnyHashable: Any] = try ctx.params.getRequiredValue(for: .attribution)
            let source: AdaptyAttributionSource = try ctx.params.getDecodedValue(
                for: .source,
                jsonDecoder: AdaptyContext.jsonDecoder
            )
            let networkUserId: String? = ctx.params.getOptionalValue(for: .networkUserId)
            
            
            
            Adapty.updateAttribution(
                attribution,
                source: source,
                networkUserId: networkUserId
            ) { maybeErr in ctx.resolveIfOk(maybeErr) }
        } catch {
            ctx.bridgeError(error)
        }
    }
    
    // MARK: - Paywalls
    
    private func handleGetPaywall(_ ctx: AdaptyContext) {
        guard let id = ctx.args[Const.ID] as? String else {
            return ctx.argNotFound(name: Const.ID)
        }
        guard let locale = ctx.args[Const.LOCALE] as? String? else {
            return ctx.argNotFound(name: Const.LOCALE)
        }
        
        Adapty.getPaywall(id, locale: locale) { result in
            switch result {
            case let .success(paywall):
                ctx.resolve(data: paywall)
            case let .failure(error):
                ctx.err(error)
            }
        }
    }
    
    private func handleGetPaywallProducts(_ ctx: AdaptyContext) {
        guard let paywallString = ctx.args[Const.PAYWALL] as? String,
              let paywallData = paywallString.data(using: .utf8),
              let paywall = try? AdaptyContext.jsonDecoder.decode(AdaptyPaywall.self, from: paywallData) else {
            return ctx.argNotFound(name: Const.PAYWALL)
        }
        
        guard let fetchPolicyJSON = ctx.args[Const.FETCH_POLICY] as? String,
              let fetchPolicy = AdaptyProductsFetchPolicy.fromJSONValue(fetchPolicyJSON) else {
            return ctx.argNotFound(name: Const.FETCH_POLICY)
        }
        
        Adapty.getPaywallProducts(paywall: paywall, fetchPolicy: fetchPolicy) { result in
            switch result {
            case let .success(products):
                ctx.resolve(data: products)
            case let .failure(error):
                ctx.err(error)
            }
        }
    }
    
    private func handleLogShowOnboarding(_ ctx: AdaptyContext) {
        guard let onboardingString = ctx.args[Const.ONBOARDING_PARAMS] as? String,
              let onboardingData = onboardingString.data(using: .utf8),
              let onboardingParams = try? AdaptyContext.jsonDecoder.decode(AdaptyOnboardingScreenParameters.self, from: onboardingData) else {
            return ctx.argNotFound(name: Const.ONBOARDING_PARAMS)
        }
        
        Adapty.logShowOnboarding(onboardingParams) { maybeErr in
            ctx.resolveIfOk(maybeErr)
        }
    }
    
    private func handleLogShowPaywall(_ ctx: AdaptyContext) {
        guard let paywallString = ctx.args[Const.PAYWALL] as? String,
              let paywallData = paywallString.data(using: .utf8),
              let paywall = try? AdaptyContext.jsonDecoder.decode(AdaptyPaywall.self, from: paywallData) else {
            return ctx.argNotFound(name: Const.PAYWALL)
        }
        
        Adapty.logShowPaywall(paywall) { maybeErr in
            ctx.resolveIfOk(maybeErr)
        }
    }
    
    private func handleSetFallbackPaywalls(_ ctx: AdaptyContext) {
        guard let paywallsString = ctx.args[Const.PAYWALLS] as? String,
              let paywallsData = paywallsString.data(using: .utf8) else {
            return ctx.argNotFound(name: Const.PAYWALLS)
        }
        
        Adapty.setFallbackPaywalls(paywallsData) { maybeErr in
            ctx.resolveIfOk(maybeErr)
        }
    }
    
    private func handleSetVariationId(_ ctx: AdaptyContext) {
        guard let variationId = ctx.args[Const.VARIATION_ID] as? String else {
            return ctx.argNotFound(name: Const.VARIATION_ID)
        }
        
        guard let transactionId = ctx.args[Const.TRANSACTION_ID] as? String else {
            return ctx.argNotFound(name: Const.TRANSACTION_ID)
        }
        
        Adapty.setVariationId(variationId, forTransactionId: transactionId) { maybeErr in
            ctx.resolveIfOk(maybeErr)
        }
    }
    
    // MARK: - Profile
    
    private func handleGetProfile(_ ctx: AdaptyContext) {
        Adapty.getProfile { result in
            switch result {
            case let .success(profile): return ctx.resolve(data: profile)
            case let .failure(error): return ctx.err(error)
            }
        }
    }
    
    private func handleIdentify(_ ctx: AdaptyContext) {
        guard let customerUserId = ctx.args[Const.USER_ID] as? String else {
            return ctx.argNotFound(name: Const.USER_ID)
        }
        
        Adapty.identify(customerUserId) { maybeErr in
            ctx.resolveIfOk(maybeErr)
        }
    }
    
    private func handleLogout(_ ctx: AdaptyContext) {
        Adapty.logout { maybeErr in
            ctx.resolveIfOk(maybeErr)
        }
    }
    
    private func handleUpdateProfile(_ ctx: AdaptyContext) {
        guard let paramsString = ctx.args[Const.PARAMS] as? String,
              let paramsData = paramsString.data(using: .utf8),
              let params = try? AdaptyContext.jsonDecoder.decode(AdaptyProfileParameters.self, from: paramsData) else {
            return ctx.argNotFound(name: Const.PARAMS)
        }
        
        Adapty.updateProfile(params: params) { maybeErr in
            ctx.resolveIfOk(maybeErr)
        }
    }
    
    // MARK: - Purchases
    
    private func handleMakePurchase(_ ctx: AdaptyContext) {
        guard let productStr = ctx.args[Const.PRODUCT] as? String,
              let productData = productStr.data(using: .utf8) else {
            return ctx.argNotFound(name: Const.PRODUCT)
        }
        
        Adapty.getPaywallProduct(from: AdaptyContext.jsonDecoder, data: productData) { skProduct in
            switch skProduct {
            case let .failure(locate_error):
                return ctx.err(locate_error)
                
            case let .success(product):
                Adapty.makePurchase(product: product) { result in
                    switch result {
                    case let .failure(error):
                        return ctx.err(error)
                        
                    case let .success(profile):
                        return ctx.resolve(data: profile)
                    }
                }
            }
        }
    }
    
    private func handlePresentCodeRedemptionSheet(_ ctx: AdaptyContext) {
        Adapty.presentCodeRedemptionSheet()
        ctx.resolve()
    }
    
    private func handleRestorePurchases(_ ctx: AdaptyContext) {
        Adapty.restorePurchases { result in
            switch result {
            case let .success(profile):
                ctx.resolve(data: profile)
                
            case let .failure(error):
                ctx.err(error)
            }
        }
    }
    
    // MARK: - Utilities
    
    private func handleSetLogLevel(_ ctx: AdaptyContext) {
        guard let valueStr = ctx.args[Const.VALUE] as? String,
              let logLevel = AdaptyLogLevel.fromBridgeValue(valueStr) else {
            return ctx.argNotFound(name: Const.VALUE)
        }
        
        Adapty.logLevel = logLevel
        ctx.resolve()
    }
    
    private func handleTestWrap(_ ctx: AdaptyContext,
                                resolver: @escaping RCTPromiseResolveBlock) {
        if let shouldReject = ctx.args["error"] as? Bool {
            if shouldReject {
                return ctx.reject(dataStr: "Rejected")
            }
        }
        
        guard let jsonData = try? JSONSerialization.data(
            withJSONObject: ctx.nsArgs,
            options: JSONSerialization.WritingOptions.prettyPrinted
        ) else {
            return ctx.failedToSerialize()
        }
        
        let json = NSString(
            data: jsonData,
            encoding: NSUTF8StringEncoding
        )! as String
        
        Adapty.getProfile() { _ in
            resolver(json)
        }
    }
}

extension AdaptyProductsFetchPolicy {
    static func fromJSONValue(_ value: String) -> AdaptyProductsFetchPolicy? {
        switch value {
        case "wait_for_receipt_validation":
            return .waitForReceiptValidation
        default:
            return .default
        }
    }
}

extension AdaptyLogLevel {
    static func fromBridgeValue(_ value: String) -> AdaptyLogLevel? {
        switch value {
        case LogLevelBridge.ERROR:
            return .error
        case LogLevelBridge.INFO:
            return .info
        case LogLevelBridge.VERBOSE:
            return .verbose
        case LogLevelBridge.WARN:
            return .warn
        default:
            return nil
        }
    }
}
