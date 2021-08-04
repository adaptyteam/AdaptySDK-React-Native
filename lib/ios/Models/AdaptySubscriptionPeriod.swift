//
//  AdaptySubscriptionPeriod.swift
//  RNAdapty
//
//  Created by Ivan on 16.07.2021.
//

import Adapty
import Foundation

struct AdaptySubscriptionPeriod: Encodable {
  let unit: String
  let numberOfUnits: Int

  init(_ period: ProductSubscriptionPeriodModel) {
    numberOfUnits = period.numberOfUnits

    switch period.unit {
    case .day:
      unit = "day"
    case .week:
      unit = "week"
    case .month:
      unit = "month"
    case .year:
      unit = "year"
    case .unknown:
      unit = "unknown"
    }
  }
}
