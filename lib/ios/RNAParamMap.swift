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
        let keyStr = key.rawValue;
        
        guard let value = dict[keyStr] else {
            return nil
        }
        
        return value as? T
    }
    
    func getDecodedValue<T: Decodable>(for key: ParamKey, jsonDecoder: JSONDecoder) throws -> T {
        let jsonString: String = try getRequiredValue(for: key)
        
        guard let jsonData = jsonString.data(using: .utf8),
              let decodedValue = try? jsonDecoder.decode(T.self, from: jsonData) else {
            throw BridgeError.typeMismatch(name: key, type: "JSON-encoded \(T.self)")
        }
        
        return decodedValue
    }
}
