//
//  AdaptyPaywall.swift
//  RNAdapty
//
//  Created by Ivan on 12.07.2021.
//

import Adapty
import Foundation

struct AdaptyPaywall: Encodable {
  let developerId: String
  let variationId: String
  let revision: Int
  let isPromo: Bool
  let products: [AdaptyProduct]
  let visualPaywall: String?
  let customPayloadString: String?
  let customPayload: String?
  let abTestName: String?
  let name: String?

  init(_ paywall: PaywallModel) {
    developerId = paywall.developerId
    variationId = paywall.variationId
    revision = paywall.revision
    isPromo = paywall.isPromo
    products = paywall.products.map { AdaptyProduct.init($0) }
    visualPaywall = paywall.visualPaywall
    customPayload = paywall.customPayloadString
    customPayloadString = paywall.customPayloadString
    abTestName = paywall.abTestName
    name = paywall.name
  }

  init?(_ none: Any?) {
      return nil
  }
}
