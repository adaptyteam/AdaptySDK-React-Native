//
//  Utils.swift
//  RNAdapty
//
//  Created by Ivan on 16.07.2021.
//

import Adapty
import Foundation

class Utils {
  static func encodeJson<T: Encodable>(from data: T) -> String? {
    let encoder = JSONEncoder()
    if #available(iOS 10.0, *) {
      encoder.dateEncodingStrategy = .iso8601
    }

    if let json = try? encoder.encode(data) {
      if let jsonString = String(data: json, encoding: .utf8) {
        return jsonString
      }
    }
    return nil
  }

  static func unwrapCustomError(_ message: String,
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

  static func unwrapError(_ error: AdaptyError) -> (String, String, AdaptyError?) {
    if let json = encodeJson(from: error) {
      return ("adapty_error", json, nil)
    }
      return ("adapty_error", "", error)
  }
}
