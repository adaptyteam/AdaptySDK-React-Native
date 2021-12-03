import Foundation
import Adapty

@objc(RNAdapty)
class RNAdapty: RCTEventEmitter, AdaptyDelegate {
  private var hasListeners = false
  private var paywalls = [PaywallModel]()
  private var products = [ProductModel]()

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  override func startObserving() {
    hasListeners = true
  }
  override func stopObserving() {
    hasListeners = false
  }
  override func supportedEvents() -> [String]! {
    return ["onPromoReceived", "onInfoUpdate", "onDeferredPurchase"]
  }

  //  Events
  func didReceivePromo(_ promo: PromoModel) {
    if !hasListeners {
      return
    }

    let json = Utils.encodeJson(from: promo)
    self.sendEvent(withName: "onPromoReceived", body: json)
  }
  func didReceiveUpdatedPurchaserInfo(_ info: PurchaserInfoModel) {
      if !hasListeners {
        return
      }

      let json = Utils.encodeJson(from: info)
      self.sendEvent(withName: "onInfoUpdate", body: json)
  }
  func paymentQueue(shouldAddStorePaymentFor product: ProductModel, defermentCompletion makeDeferredPurchase: @escaping DeferredPurchaseCompletion) {
      if !hasListeners {
        return
      }

      let json = Utils.encodeJson(from: AdaptyProduct(product, nil))
      self.sendEvent(withName: "onDeferredPurchase", body: json)
  }

  // Private
  private func cachePaywalls(_ paywalls: [PaywallModel]?) {
    self.paywalls.removeAll()
    if let paywalls = paywalls {
      self.paywalls.append(contentsOf: paywalls)
    }
  }
  private func cacheProducts(_ products: [ProductModel]?) {
    self.products.removeAll()
    if let products = products {
      self.products.append(contentsOf: products)
    }
  }

  //  Public
  @objc
  func activate(_ sdkKey: String, uId: String?, observerMode: Bool, logLevel: String) {
    Adapty.activate(sdkKey, observerMode: observerMode, customerUserId: uId)
    Adapty.delegate = self

    switch logLevel {
    case "verbose":
      Adapty.logLevel = .verbose
    case "errors":
      Adapty.logLevel = .errors
    case "all":
      Adapty.logLevel = .all
    default:
      Adapty.logLevel = .none
    }

    hasListeners = true
  }

  @objc
  func updateAttribution(_ dict: NSDictionary,
                         source: String,
                         networkUserId: String,
                         resolver resolve: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let attribution = dict as? [AnyHashable: Any] else {
      let (c, json, err) = Utils.unwrapCustomError("Failed to convert object to [AnyHashable: Any]")
      return reject(c, json, err)
    }

    func parseSource(_ str: String) -> AttributionNetwork {
      switch str {
      case "Branch":
        return .branch
      case "Adjust":
        return .adjust
      case "AppsFlyer":
        return .appsflyer
      case "AppleSearchAds":
        return .appleSearchAds
      default:
        return .custom
      }
    }

    Adapty.updateAttribution(attribution,
                             source: parseSource(source),
                             networkUserId: networkUserId) { (error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }

      return resolve(nil)
    }
  }

  @objc
  func setExternalAnalyticsEnabled(_ isEnabled: Bool,
                                   resolver resolve: @escaping RCTPromiseResolveBlock,
                                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.setExternalAnalyticsEnabled(isEnabled) { (error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }
      resolve(nil)
    }
  }

  @objc
  func setFallbackPaywalls(_ paywalls: String,
                resolver resolve: @escaping RCTPromiseResolveBlock,
                rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.setFallbackPaywalls(paywalls) { (error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }
      resolve(nil)
    }
  }

  @objc
  func logShowPaywall(_ variationId: String,
                      resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let paywall = paywalls.first(where: { $0.variationId == variationId }) else {
      let (c, json, err) = Utils.unwrapCustomError("Paywall with such variation ID wasn't found")
      return reject(c, json, err)
    }
    Adapty.logShowPaywall(paywall)
  }

  @objc
  func getAPNSToken(_ resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    return resolve(Adapty.apnsTokenString)
   }

  @objc
  func setAPNSToken(_ apns: String,
                    resolver resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let utf8Str = apns.data(using: .utf8) else {
      let (c, json, err) = Utils.unwrapCustomError("Invalid APNS Token passed")
      return reject(c, json, err)
     }

     let base64Encoded = utf8Str.base64EncodedString(options: Data.Base64EncodingOptions(rawValue: 0))
     Adapty.apnsToken = Data(base64Encoded: base64Encoded)
     resolve(nil)
   }

  @objc
  func identify(_ uId: String,
                resolver resolve: @escaping RCTPromiseResolveBlock,
                rejecter reject: @escaping RCTPromiseRejectBlock) {
   Adapty.identify(uId) { (error) in
    if let error = error {
      let (c, json, err) = Utils.unwrapError(error)
      return reject(c, json, err)
    }

    return resolve(nil)
   }
  }

  @objc
  func logout(_ resolve: @escaping RCTPromiseResolveBlock,
              rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.logout { (error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }

      return resolve(nil)
    }
  }

  @objc
  func updateProfile(_ dict: NSDictionary,
                     resolver resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    let params = ProfileParameterBuilder()

    if let email = dict.value(forKey: "email") as? String ?? nil {
      _ = params.withEmail(email)
    }
    if let phoneNumber = dict.value(forKey: "phoneNumber") as? String ?? nil {
      _ = params.withPhoneNumber(phoneNumber)
    }
    if let facebookUserId = dict.value(forKey: "facebookUserId") as?  String ?? nil {
      _ = params.withFacebookUserId(facebookUserId)
    }
    if let facebookAnonymousId = dict.value(forKey: "facebookAnonymousId") as? String ?? nil {
      _ = params.withFacebookAnonymousId(facebookAnonymousId)
    }
    if let amplitudeUserId = dict.value(forKey: "amplitudeUserId") as? String ?? nil {
      _ = params.withAmplitudeUserId(amplitudeUserId)
    }
    if let amplitudeDeviceId = dict.value(forKey: "amplitudeDeviceId") as? String ?? nil {
      _ = params.withAmplitudeDeviceId(amplitudeDeviceId)
    }
    if let mixpanelUserId = dict.value(forKey: "mixpanelUserId") as? String ?? nil {
      _ = params.withMixpanelUserId(mixpanelUserId)
    }
    if let appmetricaProfileId = dict.value(forKey: "appmetricaProfileId") as? String ?? nil {
      _ = params.withAppmetricaProfileId(appmetricaProfileId)
    }
    if let appmetricaDeviceId = dict.value(forKey: "appmetricaDeviceId") as? String ?? nil {
      _ = params.withAppmetricaDeviceId(appmetricaDeviceId)
    }
    if let firstName = dict.value(forKey: "firstName") as? String ?? nil {
      _ = params.withFirstName(firstName)
    }
    if let lastName = dict.value(forKey: "lastName") as? String ?? nil {
      _ = params.withLastName(lastName)
    }
    if let gender = dict.value(forKey: "gender") as? String ?? nil {
      switch gender {
      case "male": _ = params.withGender(Gender.male)
      case "female": _ = params.withGender(Gender.female)
      default: _ = params.withGender(Gender.other)
      }
    }
    if let birthdayStr = dict.value(forKey: "birthday") as? String ?? nil {
      let dateFormatter = DateFormatter()
      dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

      if let birthday = dateFormatter.date(from: birthdayStr) {
        _ = params.withBirthday(birthday)
      }
    }

    if let customObj = dict.value(forKey: "customAttributes") as? NSDictionary ?? nil {
      var customAttributes: [String: AnyObject] = [:]

      let keys = customObj.allKeys.compactMap { $0 as? String }
      for key in keys {
        let keyValue = customObj.value(forKey: key) as AnyObject
        customAttributes[key] = keyValue
      }

      _ = params.withCustomAttributes(customAttributes)
    }

    Adapty.updateProfile(params: params) { (error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }
      return resolve(nil)
    }
  }

  @objc
  func makePurchase(_ productId: String, variationId: String?,
                    offerId: String?,
                    resolver resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping  RCTPromiseRejectBlock) {
    guard let product = findProduct(productId: productId, variationId: variationId) else {
      let (c, json, err) = Utils.unwrapCustomError("Product with such ID wasn't found", adaptyCode: .noProductsFound)
      return reject(c, json, err)
    }

    Adapty.makePurchase(product: product, offerId: offerId) {
      (purchaserInfo, receipt, _, product, error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }

      var adaptyProduct: AdaptyProduct?
      if let product = product {
        adaptyProduct = AdaptyProduct.init(product, variationId)
      }

      let result = MakePurchaseResult(purchaserInfo: purchaserInfo,
                         receipt: receipt,
                         product: adaptyProduct)

      return resolve(Utils.encodeJson(from: result))
    }
  }

  @objc
  func getPurchaseInfo(_ options: NSDictionary,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    let forceUpdate = options.value(forKey: "forceUpdate") as? Bool ?? false
    Adapty.getPurchaserInfo(forceUpdate: forceUpdate) { (info, error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }
      return resolve(Utils.encodeJson(from: info))
    }
  }

  @objc
  func restorePurchases(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.restorePurchases { (purchaserInfo, receipt, _, error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }

      let result = RestorePurchasesResult(purchaserInfo: purchaserInfo,
                                          receipt: receipt)
      return resolve(Utils.encodeJson(from: result))
    }
  }

  @objc
  func getPromo(_ resolve: @escaping RCTPromiseResolveBlock,
                rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.getPromo { (promo, error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }

      return resolve(Utils.encodeJson(from: promo))
    }
  }

  @objc
  func setVariationID(_ variationId: String,
                      transactionId: String,
                      resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock
                      ) {
    Adapty.setVariationId(variationId, forTransactionId: transactionId) {(error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
            return reject(c, json, err)
      }
      resolve(nil)
    }
  }

  @objc
  func presentCodeRedemptionSheet() {
    Adapty.presentCodeRedemptionSheet()
  }

  @objc
  func getPaywalls(_ options: NSDictionary,
                   resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    let forceUpdate = options.value(forKey: "forceUpdate") as? Bool ?? false

    Adapty.getPaywalls(forceUpdate: forceUpdate) { (paywalls, products, error) in
      if let error = error {
        let (c, json, err) = Utils.unwrapError(error)
        return reject(c, json, err)
      }

      self.cachePaywalls(paywalls)
      self.cacheProducts(products)

      let prods = products?.map { AdaptyProduct.init($0, nil) }
      let paywallsAdapty = paywalls?.map { AdaptyPaywall.init($0) }

      let result = GetPaywallsResult(paywalls: paywallsAdapty, products: prods)
      return resolve(Utils.encodeJson(from: result))
    }
  }

  private func findProduct(productId: String, variationId: String?) -> ProductModel? {
    guard let variationId = variationId,
    let paywall = paywalls.first(where: { $0.variationId == variationId }) else {
      return products.first(where: { $0.vendorProductId == productId })
    }
    return paywall.products.first(where: { $0.vendorProductId == productId })
 }
}
