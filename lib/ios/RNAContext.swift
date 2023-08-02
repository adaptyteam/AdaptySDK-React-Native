import Foundation
import Adapty

public struct AdaptyResult<T: Encodable>: Encodable {
    public let data: T
    public let type: String
}

public struct AdaptyContext {
    let args:  [String: AnyHashable]
    let params: ParamMap
    
    // prefer decorator methods
    // resolve and reject
    private let __resolver: RCTPromiseResolveBlock
    private let __rejecter: RCTPromiseRejectBlock
    
    public init(args: NSDictionary,
                resolver: @escaping RCTPromiseResolveBlock,
                rejecter: @escaping RCTPromiseRejectBlock
    ) {
        let argsMap = args as? [String: AnyHashable] ?? [String: AnyHashable]()
        
        self.args = argsMap
        self.params = ParamMap(dict: argsMap)
        self.__rejecter = rejecter
        self.__resolver = resolver
    }
    
    public func resolve() {
        return self.__resolver(())
    }
    
    public func resolve<T: Encodable>(result: AdaptyResult<T>) {
        do {
            let jsonStr = try Self.encodeToJSON(result)
            
            return self.__resolver(jsonStr)
        } catch {
            return self.bridgeError(error)
        }
    }
    
    public func resolve<T: Encodable>(with data: T) {
        let result = AdaptyResult(data: data, type: String(describing: T.self))
        
        return self.resolve(result: result)
    }
    
    public func reject<T: Encodable>(result: AdaptyResult<T>) {
        do {
            let jsonStr = try Self.encodeToJSON(result)
            
            return self.__rejecter("adapty_rn_bridge_error", jsonStr, nil)
        } catch {
            return self.bridgeError(error)
        }
    }
    
    public func forwardError(_ error: AdaptyError) {
        let result = AdaptyResult(data: error, type: String(describing: AdaptyError.self))
        
        return self.reject(result: result)
    }
    
    public func bridgeError(_ error: Error) {
        if let bridgeError = error as? BridgeError {
            let result = AdaptyResult<BridgeError>(
                data: bridgeError,
                type: String(describing: BridgeError.self)
            )

            return self.reject(result: result)
        } else {
            let unknownBridgeError = BridgeError.unexpectedError(error)
            let result = AdaptyResult<BridgeError>(
                data: unknownBridgeError,
                type: String(describing: BridgeError.self)
            )
    
            return self.reject(result: result)
        }
    }
    public func okOrForwardError(_ maybeErr: AdaptyError?) {
        switch maybeErr {
        case .none:
            self.resolve()
            
        case let .some(error):
            self.forwardError(error)
        }
    }
}

extension AdaptyContext {
    // Other string serialized types might not work
    // on all devices, causing deserialization errors
    // JS `Date.parse` function has shown to have inconsistent results
    public static var dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .iso8601)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z"
        formatter.timeZone = TimeZone(abbreviation: "UTC")
        return formatter
    }()
    
    public static var jsonDecoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .formatted(dateFormatter)
        decoder.dataDecodingStrategy = .base64
        return decoder
    }()
    
    public static var jsonEncoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .formatted(dateFormatter)
        encoder.dataEncodingStrategy = .base64
        return encoder
    }()
    
    public static func encodeToJSON<T: Encodable>(_ value: T) throws -> String {
        do {
            let bytes = try jsonEncoder.encode(value)
            
            guard let str = String(data: bytes, encoding: .utf8) else {
                throw BridgeError.encodingFailed(
                    EncodingError.invalidValue(
                        value,
                        EncodingError.Context(
                            codingPath: [],
                            debugDescription: "Failed to convert data to string."
                        )
                    )
                )
            }
            
            return str
        } catch {
            throw BridgeError.encodingFailed(error)
        }
    }
}
