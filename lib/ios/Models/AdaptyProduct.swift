//
//  AdaptyProduct.swift
//  RNAdapty
//
//  Created by Ivan on 12.07.2021.
//

import Adapty
import Foundation

struct AdaptyProductIos: Encodable {
  let discounts: [AdaptyProductDiscount]
  let isFamilyShareable: Bool
  let promotionalOfferId: String?
  let subscriptionGroupIdentifier: String?
  let localizedSubscriptionPeriod: String?
  let regionCode: String?
  let promotionalOfferEligibility: Bool
}

struct AdaptyProduct: Encodable {
  let vendorProductId: String
  let introductoryOfferEligibility: Bool
  let paywallABTestName: String?
  let paywallName: String?
  let localizedDescription: String
  let localizedTitle: String
  let price: Decimal
  let currencyCode: String?
  let currencySymbol: String?
  let regionCode: String?
  let subscriptionPeriod: AdaptySubscriptionPeriod?
  let introductoryDiscount: AdaptyProductDiscount?
  let localizedPrice: String?

  let ios: AdaptyProductIos

  init(_ product: ProductModel) {
    vendorProductId = product.vendorProductId
    introductoryOfferEligibility = product.introductoryOfferEligibility
    paywallABTestName = product.paywallABTestName
    paywallName = product.paywallName
    localizedDescription = product.localizedDescription
    localizedTitle = product.localizedTitle
    price = product.price
    currencyCode = product.currencyCode
    currencySymbol = product.currencySymbol
    regionCode = product.regionCode
    localizedPrice = product.localizedPrice

    if let productSubscriptionPeriod = product.subscriptionPeriod {
      subscriptionPeriod = AdaptySubscriptionPeriod.init(productSubscriptionPeriod)
    } else {
      subscriptionPeriod = nil
    }
    if let productIntroDiscount = product.introductoryDiscount {
      introductoryDiscount = AdaptyProductDiscount.init(productIntroDiscount)
    } else {
      introductoryDiscount = nil
    }

    ios = AdaptyProductIos(
      discounts: product.discounts.map {AdaptyProductDiscount.init($0) },
                           isFamilyShareable: product.isFamilyShareable,
                           promotionalOfferId: product.promotionalOfferId,
                           subscriptionGroupIdentifier: product.subscriptionGroupIdentifier,
                           localizedSubscriptionPeriod: product.localizedSubscriptionPeriod,
                           regionCode: product.regionCode,
                           promotionalOfferEligibility: product.promotionalOfferEligibility
                           )
  }
}
