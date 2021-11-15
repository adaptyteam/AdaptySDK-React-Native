//
//  AdaptyProductDiscount.swift
//  RNAdapty
//
//  Created by Ivan on 16.07.2021.
//

import Adapty
import Foundation

struct AdaptyProductDiscountIos: Encodable {
  let paymentMode: String
  let identifier: String?
  let localizedNumberOfPeriods: String?

  init(_ discount: ProductDiscountModel) {
    identifier = discount.identifier
    localizedNumberOfPeriods = discount.localizedNumberOfPeriods

    switch discount.paymentMode {
    case .freeTrial:
      paymentMode = "free_trial"
    case .payAsYouGo:
      paymentMode = "pay_as_you_go"
    case .payUpFront:
      paymentMode = "pay_up_front"
    case .unknown:
      paymentMode = "unknown"
    }
  }

}
struct AdaptyProductDiscount: Encodable {
  let price: Decimal
  let subscriptionPeriod: AdaptySubscriptionPeriod
  let numberOfPeriods: Int
  let localizedPrice: String?
  let localizedSubscriptionPeriod: String?

  let ios: AdaptyProductDiscountIos

  init(_ discount: ProductDiscountModel) {
    price = discount.price
    subscriptionPeriod = AdaptySubscriptionPeriod.init(discount.subscriptionPeriod)
    numberOfPeriods = discount.numberOfPeriods
    localizedPrice = discount.localizedPrice
    localizedSubscriptionPeriod = discount.localizedSubscriptionPeriod

    ios = AdaptyProductDiscountIos.init(discount)
  }
}
