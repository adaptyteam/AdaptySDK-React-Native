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
    
    public let args: [String: AnyHashable]
    public let nsArgs: NSDictionary
    
    public let resolver: RCTPromiseResolveBlock
    public let rejecter: RCTPromiseRejectBlock
    
    // MARK: - Constructor
    init(args: NSDictionary,
         resolver: @escaping RCTPromiseResolveBlock,
         rejecter: @escaping RCTPromiseRejectBlock
    ) {
        self.nsArgs = args
        self.args = args as? [String: AnyHashable] ?? [String: AnyHashable]()
        
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
        guard let bytes = try? Self.jsonEncoder.encode(data),
        let str = String(data: bytes, encoding: .utf8) else {
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
    public func reject(dataStr: String) {
        self.rejecter("adapty_native_error", dataStr, nil)
    }
    
    public func err(_ error: AdaptyError) {
        guard let errBytes = try? Self.jsonEncoder.encode(error),
        let errStr = String(data: errBytes, encoding: .utf8) else {
            return self.failedToSerialize()
        }
        
        self.reject(dataStr: errStr)
    }
    
    public func notImplemented() {
        self.reject(dataStr: "method not implemented")
    }
    
    public func argNotFound(name: String) {
        self.reject(dataStr: "Argument '\(name)' was not passed to a native module.")
    }
    
    public func failedToSerialize() {
        self.reject(dataStr: "Failed to serialize data on a client side")
    }
}

