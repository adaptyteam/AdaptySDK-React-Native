import Foundation
import Adapty

private var MEMO_ACTIVATION_ARGS: [String: AnyHashable] = [:]
public func ==<K, L: Hashable, R: Hashable>(lhs: [K: L], rhs: [K: R] ) -> Bool {
    (lhs as NSDictionary).isEqual(to: rhs)
}

@objc(RNAdapty)
class RNAdapty: RCTEventEmitter, AdaptyDelegate {
    // UI Thread is required to properly work with StoreKit SDK
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    // A list of emittable events to JavaScript
    override func supportedEvents() -> [String]! {
        return [
            EventName.onDeferredPurchase.rawValue,
            EventName.onLatestProfileLoad.rawValue,
        ]
    }
    
    override func constantsToExport() -> [AnyHashable : Any]! {
        // Name of the function that routes all incoming requests
        return ["HANDLER": "handle"]
    }
    

    func didLoadLatestProfile(_ profile: AdaptyProfile) {
        if !self.hasListeners {
            return
        }
        
        do {
            let result = AdaptyResult(
                data: profile,
                type: String(describing: AdaptyProfile.self)
            )
            let jsonStr = try AdaptyContext.encodeToJSON(result)
            
            return self.sendEvent(
                withName: EventName.onLatestProfileLoad.rawValue,
                body: jsonStr
            )
        } catch {
            if let bridgeError = error as? BridgeError {
                let result = AdaptyResult<BridgeError>(
                    data: bridgeError,
                    type: String(describing: BridgeError.self)
                )
                let jsonStr = try? AdaptyContext.encodeToJSON(result)
                
                return self.sendEvent(
                    withName: EventName.onLatestProfileLoad.rawValue,
                    body: jsonStr
                )
            } else {
                let unknownBridgeError = BridgeError.unexpectedError(error)
                let result = AdaptyResult<BridgeError>(
                    data: unknownBridgeError,
                    type: String(describing: BridgeError.self)
                )
                let jsonStr = try? AdaptyContext.encodeToJSON(result)
                
                return self.sendEvent(
                    withName: EventName.onLatestProfileLoad.rawValue,
                    body: jsonStr
                )
            }
        }
    }
    
    // RN doesn't like when events fire
    // while nobody is listening
    // Omit warnings with this
    private var hasListeners = false
    
    override func startObserving() {
        self.hasListeners = true
    }
    override func stopObserving() {
        self.hasListeners = false
    }
    
    // Deferred purchases flow
    func shouldAddStorePayment(
        for product: AdaptyDeferredProduct,
        defermentCompletion makeDeferredPurchase: @escaping (AdaptyResultCompletion<AdaptyPurchasedInfo>?) -> Void
    ) -> Bool {
        if !self.hasListeners {
            return false
        }
        
        Adapty.getProfile { result in
            do {
                switch (result) {
                case let .success(profile):
                    let result = AdaptyResult(
                        data: profile,
                        type: String(describing: AdaptyProfile.self)
                    )
                    let jsonStr = try AdaptyContext.encodeToJSON(result)
                    
                    self.sendEvent(
                        withName: EventName.onDeferredPurchase.rawValue,
                        body: jsonStr
                    )
                    return
                case let .failure(error):
                    let result = AdaptyResult(
                        data: error,
                        type: String(describing: AdaptyError.self)
                    )
                    let jsonStr = try AdaptyContext.encodeToJSON(result)
                    
                    self.sendEvent(
                        withName: EventName.onDeferredPurchase.rawValue,
                        body: jsonStr
                    )
                    return
                }
            } catch {
                if let bridgeError = error as? BridgeError {
                    let result = AdaptyResult<BridgeError>(
                        data: bridgeError,
                        type: String(describing: BridgeError.self)
                    )
                    let jsonStr = try? AdaptyContext.encodeToJSON(result)
                    
                    self.sendEvent(
                        withName: EventName.onDeferredPurchase.rawValue,
                        body: jsonStr
                    )
                    return
                } else {
                    let unknownBridgeError = BridgeError.unexpectedError(error)
                    let result = AdaptyResult<BridgeError>(
                        data: unknownBridgeError,
                        type: String(describing: BridgeError.self)
                    )
                    let jsonStr = try? AdaptyContext.encodeToJSON(result)
                    
                    self.sendEvent(
                        withName: EventName.onDeferredPurchase.rawValue,
                        body: jsonStr
                    )
                    return
                }
            }
        }
        
        return true
    }
    
    // MARK: - Handle router
    
    // `handle` is the main function, that routes calls to a corresponding function
    // and wraps controllers into a `AdaptyContext`
    //
    // Since currently synchronous bridge calls are not production-ready,
    // all functions are considered asynchronous
    //
    // Definitions are sorted alphabetically
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
        
        do {
            switch MethodName(rawValue: method as String) ?? .notImplemented {
            case .activate: try handleActivate(ctx)
            case .updateAttribution: try handleUpdateAttribution(ctx)
            case .getPaywall: try handleGetPaywall(ctx)
            case .getPaywallProducts: try handleGetPaywallProducts(ctx)
            case .getProductsIntroductoryOfferEligibility: try handleGetProductsIntroductoryOfferEligibility(ctx)
            case .logShowOnboarding: try handleLogShowOnboarding(ctx)
            case .logShowPaywall: try handleLogShowPaywall(ctx)
            case .setFallbackPaywalls: try handleSetFallbackPaywalls(ctx)
            case .setVariationId: try handleSetVariationId(ctx)
            case .getProfile: handleGetProfile(ctx)
            case .identify: try handleIdentify(ctx)
            case .logout: handleLogout(ctx)
            case .updateProfile: try handleUpdateProfile(ctx)
            case .makePurchase: try handleMakePurchase(ctx)
            case .presentCodeRedemptionSheet: handlePresentCodeRedemptionSheet(ctx)
            case .restorePurchases: handleRestorePurchases(ctx)
            case .setLogLevel: try handleSetLogLevel(ctx)
            case .testWrap: handleTestWrap(ctx, resolver: resolver)
                
            default: throw BridgeError.methodNotImplemented
            }
        } catch {
            ctx.bridgeError(error)
        }
    }
    
    // MARK: - Activation
    private func handleActivate(_ ctx: AdaptyContext) throws {
        if ctx.args == MEMO_ACTIVATION_ARGS {
            return ctx.resolve()
        } else {
            MEMO_ACTIVATION_ARGS = ctx.args
        }
        
        let apiKey: String = try ctx.params.getRequiredValue(for: .sdkKey)
        let customerUserId: String? = ctx.params.getOptionalValue(for: .userId)
        let logLevel: String? = ctx.params.getOptionalValue(for: .logLevel)
        let observerMode: Bool? = ctx.params.getOptionalValue(for: .observerMode)
        let idfaCollectionDisabled: Bool? = ctx.params.getOptionalValue(for: .idfaDisabled)
        let storeKit2UsageString: String? = ctx.params.getOptionalValue(for: .storekit2Usage)
        
        let storeKit2Usage: StoreKit2Usage
        switch storeKit2UsageString {
        case "enabled_for_introductory_offer_eligibility":
            storeKit2Usage = .forIntroEligibilityCheck
        case "disabled":
            storeKit2Usage = .disabled
        default:
            storeKit2Usage = .default
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
            storeKit2Usage: storeKit2Usage
        ) { maybeErr in ctx.okOrForwardError(maybeErr) }
        
        
        Adapty.delegate = self
        
    }
    
    // MARK: - Attribution
    private func handleUpdateAttribution(_ ctx: AdaptyContext) throws {
        
        let attribution: [AnyHashable: Any] = try ctx.params.getRequiredValue(for: .attribution)
        let sourceStr: String = try ctx.params.getRequiredValue(for: .source)
        guard let source = AdaptyAttributionSource(rawValue: sourceStr) else {
            throw BridgeError.typeMismatch(name: .source, type: "Non decodable attribution source")
        }
        
        let networkUserId: String? = ctx.params.getOptionalValue(for: .networkUserId)
        
        
        
        Adapty.updateAttribution(
            attribution,
            source: source,
            networkUserId: networkUserId
        ) { maybeErr in ctx.okOrForwardError(maybeErr) }
    }
    
    // MARK: - Paywalls
    private func handleGetPaywall(_ ctx: AdaptyContext) throws {
        
        let placementId: String = try ctx.params.getRequiredValue(for: .placementId)
        let locale: String? = ctx.params.getOptionalValue(for: .locale)
        let fetchPolicy: AdaptyPaywall.FetchPolicy = try ctx.params.getDecodedValue(
            for: .fetchPolicy,
            jsonDecoder: AdaptyContext.jsonDecoder
        )
        let loadTimeoutMillis = ctx.params.getOptionalValue(Double.self, for: .loadTimeout).map { $0 / 1000.0 } ?? .defaultLoadPaywallTimeout
        
        Adapty.getPaywall(placementId: placementId, locale: locale, fetchPolicy: fetchPolicy, loadTimeout: loadTimeoutMillis) { result in
            switch result {
            case let .success(paywall):
                ctx.resolve(with: paywall)
            case let .failure(error):
                ctx.forwardError(error)
            }
        }
    }
    
    private func handleGetPaywallProducts(_ ctx: AdaptyContext) throws {
        let paywall: AdaptyPaywall = try ctx.params.getDecodedValue(
            for: .paywall,
            jsonDecoder: AdaptyContext.jsonDecoder
        )
        
        Adapty.getPaywallProducts(paywall: paywall) { result in
            switch result {
            case let .success(products):
                ctx.resolve(with: products)
            case let .failure(error):
                ctx.forwardError(error)
            }
        }
    }
    
    private func handleGetProductsIntroductoryOfferEligibility(_ ctx: AdaptyContext) throws {
        let productIds: [String] = try ctx.params.getRequiredValue(for: .productIds)
        
        Adapty.getProductsIntroductoryOfferEligibility(vendorProductIds: productIds) { result in
            switch result {
            case let .failure(error):
                ctx.forwardError(error)
                
            case let .success(eligibilities):
                ctx.resolve(with: eligibilities)
            }
        }
    }
    
    private func handleLogShowOnboarding(_ ctx: AdaptyContext) throws {
        let onboardingParams: AdaptyOnboardingScreenParameters = try ctx.params.getDecodedValue(
            for: .onboardingParams,
            jsonDecoder: AdaptyContext.jsonDecoder
        )
        
        Adapty.logShowOnboarding(onboardingParams) { maybeErr in
            ctx.okOrForwardError(maybeErr)
        }
    }
    
    private func handleLogShowPaywall(_ ctx: AdaptyContext) throws {
        let paywall: AdaptyPaywall = try ctx.params.getDecodedValue(
            for: .paywall,
            jsonDecoder: AdaptyContext.jsonDecoder
        )
        
        Adapty.logShowPaywall(paywall) { maybeErr in
            ctx.okOrForwardError(maybeErr)
        }
    }
    
    private func handleSetFallbackPaywalls(_ ctx: AdaptyContext) throws {
        let paywallsString: String = try ctx.params.getRequiredValue(for: .paywalls)
        
        guard let paywallsData = paywallsString.data(using: .utf8) else {
            throw BridgeError.typeMismatch(name: .paywalls, type: "UTF-8 String")
        }
        
        Adapty.setFallbackPaywalls(paywallsData) { maybeErr in
            ctx.okOrForwardError(maybeErr)
        }
    }
    
    private func handleSetVariationId(_ ctx: AdaptyContext) throws {
        let jsonStr: String = try ctx.params.getRequiredValue(for: .params)
        guard let paywallsData = jsonStr.data(using: .utf8) else {
            throw BridgeError.typeMismatch(name: .params, type: "UTF-8 String")
        }
        
        Adapty.setVariationId(from: AdaptyContext.jsonDecoder, data: paywallsData)  { maybeErr in
            ctx.okOrForwardError(maybeErr)
        }
        
    }
    
    // MARK: - Profile
    private func handleGetProfile(_ ctx: AdaptyContext) {
        Adapty.getProfile { result in
            switch result {
            case let .success(profile):
                ctx.resolve(with: profile)
            case let .failure(error):
                ctx.forwardError(error)
            }
        }
    }
    
    private func handleIdentify(_ ctx: AdaptyContext) throws {
        let customerUserId: String = try ctx.params.getRequiredValue(for: .userId)
        
        Adapty.identify(customerUserId) { maybeErr in ctx.okOrForwardError(maybeErr) }
    }
    
    private func handleLogout(_ ctx: AdaptyContext) {
        Adapty.logout { maybeErr in ctx.okOrForwardError(maybeErr) }
    }
    
    private func handleUpdateProfile(_ ctx: AdaptyContext) throws {
        let params: AdaptyProfileParameters = try ctx.params.getDecodedValue(
            for: .params,
            jsonDecoder: AdaptyContext.jsonDecoder
        )
        
        Adapty.updateProfile(params: params) { maybeErr in
            ctx.okOrForwardError(maybeErr)
        }
    }
    
    // MARK: - Purchases
    private func handleMakePurchase(_ ctx: AdaptyContext) throws {
        let productStr: String = try ctx.params.getRequiredValue(for: .product)
        
        guard let productData = productStr.data(using: .utf8) else {
            throw BridgeError.typeMismatch(name: .product, type: "UTF-8 String")
        }
        
        Adapty.getPaywallProduct(
            from: AdaptyContext.jsonDecoder,
            data: productData
        ) { skProductResult in
            switch skProductResult {
            case .failure(let locateError):
                ctx.forwardError(locateError)
                
            case .success(let product):
                Adapty.makePurchase(product: product) { purchaseResult in
                    switch purchaseResult {
                    case .failure(let error):
                        ctx.forwardError(error)
                        
                    case .success(let purchase):
                        ctx.resolve(with: purchase.profile)
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
            case let .failure(error):
                ctx.forwardError(error)
                
            case let .success(profile):
                ctx.resolve(with: profile)
                
            }
        }
    }
    
    // MARK: - Utilities
    private func handleSetLogLevel(_ ctx: AdaptyContext) throws {
        let logLevelValue: String = try ctx.params.getRequiredValue(for: .value)
        
        guard let logLevel = AdaptyLogLevel.fromBridgeValue(logLevelValue) else {
            throw BridgeError.typeMismatch(name: .value, type: "AdaptyLogLevel")
        }
        
        Adapty.logLevel = logLevel
        ctx.resolve()
    }
    
    private func handleTestWrap(_ ctx: AdaptyContext, resolver: @escaping RCTPromiseResolveBlock) {
        ctx.resolve()
    }
}

extension RNAdapty {
    private func fetchBridgeVersion() throws -> String {
        guard let path = Bundle.main.path(forResource: "CrossplatformVersion", ofType: "plist"),
              let dict = NSDictionary(contentsOfFile: path),
              let version = dict["version"] as? String else {
            throw BridgeError.missingRequiredArgument(name: .bridgeVersion)
        }
        
        return version
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

extension AdaptyPaywall.FetchPolicy {
    static func fromBridgeValue(_ value: String?) -> AdaptyPaywall.FetchPolicy {
        switch value {
        case FetchPolicyBridge.ReturnCacheDataElseLoad:
            return .returnCacheDataElseLoad
        case FetchPolicyBridge.ReloadRevalidatingCacheData:
            return .reloadRevalidatingCacheData
        default:
            return .default
        }
    }
}
