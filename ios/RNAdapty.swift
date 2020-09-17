//
//  Counter.swift
//  CounterApp
//
//  Created by Ivan on 12.09.2020.
//

import Foundation
//import Adapty

@objc(RNAdapty)
class RNAdapty : RCTEventEmitter {

//  override func constantsToExport() -> [AnyHashable: Any]! {
//    return ["initialCount": 14]
//  }
//
//  override static func requiresMainQueueSetup() -> Bool {
//    return true
//  }
//
  override func supportedEvents() -> [String]! {
     return ["onIncrement"]
   }
  
//  @objc func increment() {
//    count += 2
//    print("count is a dadada \(count)!!")
//
//    sendEvent(withName: "onIncrement", body: ["count": count])
//  }
  
//  @objc func getCount(_ callback: RCTResponseSenderBlock) {
//    print("FIRED")
//    callback([count])
//  }
//  @objc func decrement(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
//    if (count == 0) {
//      let error = NSError(domain: "", code: 200, userInfo: nil)
//      reject("E_COUNT", "count cannot be negative", error)
//    } else {
//      count -= 1
//      resolve("Count decremented")
//    }
//  }
  
  @objc func identify(_ uId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    print("Identify", uId)
       Adapty.identify(uId) { (error) in
        print("Identify closure", error ?? "no errors")
          if error == nil {
              resolve("Success")
            } else {
              reject("ER","ERERER", error)
            }
       }
  }

  
  @objc func logout(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    print("Logout")
    Adapty.logout { (error) in
      print("Logout closure",  error ?? "no errors")
       if error == nil {
           resolve("Success")
         } else {
           reject("ER","ERERER", error)
         }
    }
  }
  
  @objc func updateProfile(_ dict: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let email: String? = dict.value(forKey: "email") as? String? ?? nil
    let phoneNumber: String?  = dict.value(forKey: "phoneNumber") as? String? ?? nil
    let facebookUserId: String? = dict.value(forKey: "facebookUserId") as?  String? ?? nil
    let amplitudeUserId: String? = dict.value(forKey: "amplitudeUserId") as? String? ?? nil
    let amplitudeDeviceId: String? = dict.value(forKey: "amplitudeDeviceId") as? String? ?? nil
    let mixpanelUserId: String? = dict.value(forKey: "mixpanelUserId") as? String? ?? nil
    let appmetricaProfileId: String? = dict.value(forKey: "appmetricaProfileId") as? String? ?? nil
    let appmetricaDeviceId: String? = dict.value(forKey: "appmetricaDeviceId") as? String? ?? nil
    let firstName: String? = dict.value(forKey: "firstName") as? String? ?? nil
    let lastName: String? = dict.value(forKey: "lastName") as? String? ?? nil
    let gender: String? = dict.value(forKey: "gender") as? String? ?? nil
    
    var birthday: Date?
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    if let birthdayStr = dict.value(forKey: "birthday") as? String? ?? nil {
      birthday = dateFormatter.date(from: birthdayStr)
    }
    
    var customAttributes: [String : AnyObject]? = nil
    if let customObj = dict.value(forKey: "customAttributes") as? NSDictionary? ?? nil {
      if customAttributes == nil {
        customAttributes = [:]
      }
      
      let keys = customObj.allKeys.compactMap { $0 as? String }
      for key in keys {
        let keyValue = customObj.value(forKey: key) as AnyObject
        customAttributes![key] = keyValue
      }
    }
    
    Adapty.updateProfile(email: email, phoneNumber: phoneNumber, facebookUserId: facebookUserId,
                         amplitudeUserId: amplitudeUserId, amplitudeDeviceId: amplitudeDeviceId,
                         mixpanelUserId: mixpanelUserId, appmetricaProfileId: appmetricaProfileId,
                         appmetricaDeviceId: appmetricaDeviceId, firstName: firstName, lastName: lastName,
                         gender: gender, birthday: birthday, customAttributes: customAttributes,
                         appTrackingTransparencyStatus: 1 ) { (error) in
                          if error == nil {
                            resolve(true)
                          } else {
                            reject("Error", "Error2", error)
                          }
    }
  }
}
