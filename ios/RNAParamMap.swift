import Foundation

public class ParamMap {
    let dict: [String: AnyHashable]
    
    init(dict: [String: AnyHashable]) {
        self.dict = dict
    }
    
    public func getRequiredValue<T>(for key: ParamKey) throws -> T {
        guard let value = dict[key.rawValue] else {
            throw BridgeError.missingRequiredArgument(name: key)
        }
        
        guard let castedValue = value as? T else {
            throw BridgeError.typeMismatch(name: key, type: "\(T.self)")
        }
        
        return castedValue
    }
    
    public func getOptionalValue<T>(for key: ParamKey) -> T? {
        getOptionalValue(T.self, for: key)
    }
    
    @inline(__always) func getOptionalValue<T>(_ type: T.Type, for key: ParamKey) -> T? {
        dict[key.rawValue] as? T
    }
    
    public func getDecodedValue<T: Decodable>(for key: ParamKey, jsonDecoder: JSONDecoder) throws -> T {
        let jsonString: String = try getRequiredValue(for: key)
        
        guard let jsonData = jsonString.data(using: .utf8),
              let decodedValue = try? jsonDecoder.decode(T.self, from: jsonData) else {
            throw BridgeError.typeMismatch(name: key, type: "JSON-encoded \(T.self)")
        }
        
        return decodedValue
    }
    
    public func getDecodedOptionalValue<T: Decodable>(for key: ParamKey, jsonDecoder: JSONDecoder) throws -> T? {
        guard let jsonString: String = getOptionalValue(for: key) else { return nil }
        
        guard let jsonData = jsonString.data(using: .utf8),
              let decodedValue = try? jsonDecoder.decode(T.self, from: jsonData) else {
            throw BridgeError.typeMismatch(name: key, type: "JSON-encoded \(T.self)")
        }
        
        return decodedValue
    }
}
