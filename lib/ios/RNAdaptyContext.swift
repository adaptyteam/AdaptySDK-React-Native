//
//  RNAdaptyContext.swift
//  react-native-adapty
//
//  Created by Ivan Dorofeyev on 12/25/22.
//

import Foundation
import Adapty

let errorCodeBridge = -1

/// `AdaptyContext` provides an API for Adapty handlers
struct AdaptyContext {
    static var dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .iso8601)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        return formatter
    }()

    static var jsonDecoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .formatted(dateFormatter)
        decoder.dataDecodingStrategy = .base64
        return decoder
    }()
    
    static var jsonEncoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .formatted(dateFormatter)
        encoder.dataEncodingStrategy = .base64
        return encoder
    }()

    public let args: [String: Any]
    
    private let resolver: RCTPromiseResolveBlock
    private let rejecter: RCTPromiseRejectBlock
    
    // MARK: - Constructor
    init(args: NSDictionary,
         resolver: @escaping RCTPromiseResolveBlock,
         rejecter: @escaping RCTPromiseRejectBlock
    ) {
        self.args = args as? [String: Any] ?? [String: Any]()

        self.rejecter = rejecter
        self.resolver = resolver
    }
    
    // MARK: - Resolvers API
    /// Resolves with a single void result
    public func resolve() {
        self.resolver(())
    }
    
    /// Serializes data in JSON, then resolves with a single string result
    public func resolve<T: Encodable>(data: T) {
        guard let str = try? Self.jsonEncoder.encode(data) else {
            return self.failedToSerialize()
        }

        self.resolver(str)
    }
    
    public func resolveIfOk(_ maybeErr: AdaptyError?) {
        switch maybeErr {
        case .none:
            self.resolve()
        case let .some(error):
            self.err(error)
        }
    }

    // MARK: - Errors API
    
    public func reject(
        code: Int = errorCodeBridge,
        desc: String,
        details: Error? = nil
    ) {
        self.rejecter(String(code), desc, details)
    }
    
    public func err(_ error: AdaptyError) {
        print(error)
        
        self.reject(code: error.adaptyErrorCode.rawValue, desc: error.description)
    }
    
    public func notImplemented() {
        self.reject(desc: "method not implemented")
    }
    
    public func argNotFound(name: String) {
        self.reject(desc: "Argument '\(name)' was not passed to a native module.")
    }
    
    public func failedToSerialize() {
        self.reject(desc: "Failed to serialize data on a client side")
    }
    
}
