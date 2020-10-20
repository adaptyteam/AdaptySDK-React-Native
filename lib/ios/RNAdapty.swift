import Foundation
import Adapty

@objc(RNAdapty)
class RNAdapty: NSObject {

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
      return reject("Error in: updateAttribution", "Failed to convert object to [AnyHashable: Any]", nil)
    }

    func parseSource(_ str: String) -> AttributionNetwork {
      switch str {
      case "Branch":
        return .branch
      case "Adjust":
        return .adjust
      case "AppsFlyer":
        return .appsflyer
      default:
        return .custom
      }
    }

    Adapty.updateAttribution(attribution, source: parseSource(source)) { (error) in
      if error != nil {
        return reject("Error in: updateAttribution", error?.localizedDescription, nil)
      }

      return resolve(true)
    }
  }

  /* USERS */
  @objc
  func identify(_ uId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
   Adapty.identify(uId) { (error) in
    if error != nil {
      return reject("Error in: userIdentify", error?.localizedDescription, nil)
    }

    return resolve(true)
   }
  }

  @objc
  func logout(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.logout { (error) in
      if error != nil {
        return reject("Error in: userLogout", error?.localizedDescription, nil)
      }

      return resolve(true)
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
                          if error != nil {
                            return reject("Error in: updateProfile", error?.localizedDescription, nil)
                          }

                          return resolve(true)
                        }
  }

  /* PURCHASES */
  @objc
  func makePurchase(_ productId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping  RCTPromiseRejectBlock) {
    Adapty.getPaywalls { (_, products, state, error) in
      if state != .synced {
        return
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

      let product = fittingProducts[0]

      Adapty.makePurchase(product: product) { (purchaserInfo, receipt, appleValidationResult, product, error) in
        if error != nil {
          print("FFFFFf", error)
          return reject("Error in: makePurchase", error?.localizedDescription, nil)
        }

        let dict: NSDictionary = [
          "purchaserInfo": purchaserInfo,
          "receipt": receipt,
          "appleValidationResult": appleValidationResult,
          "product": product
        ]
        return resolve(dict)
      }
    }
  }

  @objc
  func getPurchaseInfo(_ resolve: @escaping  RCTPromiseResolveBlock, rejecter reject: @escaping  RCTPromiseRejectBlock) {
    Adapty.getPurchaserInfo { (info, state, error) in
      if state != .synced {
        return
      }

      if error != nil {
          return reject("Error in: getPurchaseInfo", error?.localizedDescription, nil)
      }

      let encoder = JSONEncoder()

      if let json = try? encoder.encode(info) {
        if let jsonString = String(data: json, encoding: .utf8) {
          return resolve(jsonString)
        }
      }
    }
  }

  @objc
  func restorePurchases(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.restorePurchases { (error) in
      if error != nil {
        return reject("Error in: restorePurchases", error?.localizedDescription, error)
      }

      return resolve(true)
    }
  }

  @objc
  func validateReceipt(_ receipt: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.validateReceipt(receipt) { (purchaserInfo, response, error) in
      if error != nil {
        return reject("Error in: validateReceipt", error?.localizedDescription, error)
      }

      let dict: NSDictionary = [
       "purchaserInfo": purchaserInfo,
       "response": response
     ]

     return resolve(dict)
    }
  }

  /* PROMOS */
  @objc
  func didReceivePromo(_ promo: PromoModel) {
    print("PROMO REC")
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
  func getPaywalls(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Adapty.getPaywalls { (paywalls, products, state, error) in
      if state == .cached {
        return
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
