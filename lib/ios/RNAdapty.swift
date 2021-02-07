import Foundation
import Adapty

@objc(RNAdapty)
class RNAdapty: NSObject {
  let events = RNAdaptyEvents()

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  /* INITIALIZATION */
  @objc
  func activate(_ sdkKey: String, uId: String?, observerMode: Bool, logLevel: String) {
    Adapty.activate(sdkKey, observerMode: observerMode, customerUserId: uId)
    
    switch logLevel {
    case "verbose":
      Adapty.logLevel = .verbose
    case "errors":
      Adapty.logLevel = .errors
    default:
      Adapty.logLevel = .none
    }
  }

  /* TRACKERS */
  @objc
  func updateAttribution(_ dict: NSDictionary, source: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let attribution = dict as? [AnyHashable: Any] else {
      let (c,json, err) = unwrapCustomError("Failed to convert object to [AnyHashable: Any]")
      return reject(c,json, err)
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

    Adapty.updateAttribution(attribution, source: parseSource(source)) { (error) in
      if let error = error {
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }

      return resolve(nil)
    }
  }
  
  @objc
  func logShowPaywall(_ variationId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    guard let paywall = paywalls.first(where: { $0.variationId == variationId }) else {
      let (c,json, err) = unwrapCustomError("Paywall with such variation ID wasn't found")
      return reject(c, json, err)
    }
    Adapty.logShowPaywall(paywall)
  }
  
  @objc
  func getAPNSToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    return resolve(Adapty.apnsTokenString)
   }
  
  @objc
  func setAPNSToken(_ apns: String,resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let utf8Str = apns.data(using: .utf8) else {
      let (c,json, err) = unwrapCustomError("Invalid APNS Token passed")
      return reject(c, json, err)
     }
    
       let base64Encoded = utf8Str.base64EncodedString(options: Data.Base64EncodingOptions(rawValue: 0))
       Adapty.apnsToken = Data(base64Encoded: base64Encoded)
       resolve(nil)
   }

  /* USERS */
  @objc
  func identify(_ uId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
   Adapty.identify(uId) { (error) in
    if let error = error {
      let (c, json, err) = unwrapError(error);
      return reject(c,json, err);
    }

    return resolve(nil)
   }
  }

  @objc
  func logout(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.logout { (error) in
      if let error = error {
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }

      return resolve(nil)
    }
  }

  @objc
  func updateProfile(_ dict: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
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
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }
      return resolve(true)
    }
  }

  /* PURCHASES */
  @objc
  func makePurchase(_ productId: String, options: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping  RCTPromiseRejectBlock) {
    Adapty.getPaywalls { (_, products, state, error) in
      if shouldDrop(options, with: state) {
        return;
      }

      if error != nil {
        return reject("Error in paywalls of makePurchase", "Failed to get a list of products", error)
      }

      guard let products = products else {
        return reject("Error in paywalls of makePurchase", "Failed to find the product", nil)
      }

      let fittingProducts = products.filter { (product) in
        print(product.vendorProductId)
        return product.vendorProductId == productId
      }

      if fittingProducts.count < 1 {
        return reject("Error in paywalls of makePurchase", "Failed to find the product with this vendorID", nil)
      }

      if let error = error {
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }

        var dict: [String: String?] = ["receipt": receipt]
        
        if (purchaserInfo != nil) {
          dict["purchaserInfo"] = encodeJson(from: purchaserInfo)
        }
        if (product != nil) {
          dict["product"] = encodeJson(from: product)
        }
        
        return resolve(dict)
      }
    }
  }

  @objc
  func getPurchaseInfo(_ options: NSDictionary, resolver resolve: @escaping  RCTPromiseResolveBlock,
                       rejecter reject: @escaping  RCTPromiseRejectBlock) {
    let forceUpdate = options.value(forKey: "forceUpdate") as? Bool ?? false
    Adapty.getPurchaserInfo(forceUpdate: forceUpdate) { (info, error) in
      if let error = error {
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }
      return resolve(encodeJson(from: info))
    }
  }

  @objc
  func restorePurchases(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.restorePurchases { (purchaserInfo, receipt, _, error) in
      if let error = error {
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }
      
      var dict: [String: String?] = [:]
      
      if purchaserInfo != nil {
        dict["purchaserInfo"] = encodeJson(from: purchaserInfo)
      }
      if receipt != nil {
        dict["receipt"] = receipt
      }
     
      return resolve(dict)
    }
  }

  @objc
  func validateReceipt(_ receipt: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.validateReceipt(receipt) { (purchaserInfo, response, error) in
      if let error = error {
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }

      var dict: [String: String?] = [:]
      
      if purchaserInfo != nil {
        dict["purchaserInfo"] = encodeJson(from: purchaserInfo)
      }

     return resolve(dict)
    }
  }

  @objc
  func getPromo(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.getPromo { (promo, error) in
      if error != nil {
        return reject("Error in: getPromo", error?.localizedDescription, nil)
      }

      return resolve(promo)
    }
  }

  /* PAYWALLS */
  @objc
  func getPaywalls(_ options: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let forceUpdate = options.value(forKey: "forceUpdate") as? Bool ?? false
    
    Adapty.getPaywalls(forceUpdate: forceUpdate) { (paywalls, products, error) in
      if let error = error {
        let (c, json, err) = unwrapError(error);
        return reject(c,json, err);
      }
      
      if error != nil {
           return reject("Error in: getPaywalls", error?.localizedDescription, nil)
      }

      let encoder = JSONEncoder()

      var stringPaywalls: String?
      var stringProduct: String?

      if let jsonPaywalls = try? encoder.encode(paywalls) {
        stringPaywalls = String(data: jsonPaywalls, encoding: .utf8)
      }

      if let jsonProduct = try? encoder.encode(products) {
        stringProduct = String(data: jsonProduct, encoding: .utf8)
      }

      return resolve(["paywalls": stringPaywalls, "product": stringProduct])
    }
  }
}


func shouldDrop(_ options: NSDictionary, with state: DataState) -> Bool {
  if let options = options as? [String: Bool?] {
    switch options["cached"] {
    case true:
      return state == .synced
    case nil, false, _:
      return state == .cached
    }
  } else {
    return state == .cached
  }
}

func encodeJson<T: Encodable>(from data: T) -> String? {
  let encoder = JSONEncoder()

  if let json = try? encoder.encode(data) {
    if let jsonString = String(data: json, encoding: .utf8) {
      return jsonString
    }
  }
  return nil
}

func unwrapCustomError(_ message: String,
                       adaptyCode: AdaptyErrorCode = .unknown,
                       code: Int = 0) -> (String, String?, AdaptyError?) {
  // AdaptyError initializer is unaccessible
  let error: [String: String] = [
    "localizedDescription": message,
    "adaptyCode": String(adaptyCode.rawValue),
    "code": String(code)
  ]
  
  let json = encodeJson(from: error)

  return ("adapty_error", json, nil)
}


func unwrapError(_ error: AdaptyError) -> (String, String, AdaptyError?) {
  if let json = encodeJson(from: error) {
    return ("adapty_error", json, nil)
  }
    return ("adapty_error", "", error)
}
