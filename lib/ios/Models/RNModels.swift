//
//  RNModels.swift
//  react-native-adapty
//
//  Created by Ivan on 07.02.2021.
//

import Adapty
import Foundation

struct GetPaywallsResult: Encodable {
  let paywalls: [AdaptyPaywall]?
  let products: [AdaptyProduct]?
}

struct MakePurchaseResult: Encodable {
    let purchaserInfo: PurchaserInfoModel?
    let receipt: String?
    let product: AdaptyProduct?
}

struct RestorePurchasesResult: Codable {
    let purchaserInfo: PurchaserInfoModel?
    let receipt: String?
}

extension AdaptyError: Encodable {
  enum CodingKeys: CodingKey {
    case code, adaptyCode, localizedDescription
  }
  public func encode(to encoder: Encoder) throws {

    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(self.code, forKey: .code)
    try container.encode(self.adaptyErrorCode.rawValue, forKey: .adaptyCode)

    if let desc = self.userInfo["NSLocalizedDescription"] as? String? {
      try container.encode(desc, forKey: .localizedDescription)
    }

  }

}
