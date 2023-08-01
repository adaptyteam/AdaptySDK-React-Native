import Foundation

class ParamMap {
    let dict: [String: AnyHashable]
    
    init(dict: [String: AnyHashable]) {
        self.dict = dict
    }
    
    func getRequiredValue<T>(for key: String) throws -> T {
        guard let value = dict[key] else {
            throw BridgeError.missingRequiredArgument(name: key)
        }
        
        guard let castedValue = value as? T else {
            throw BridgeError.typeMismatch(name: key, type: "\(T.self)")
        }
        
        return castedValue
    }
    
    func getOptionalValue<T>(for key: String) -> T? {
        guard let value = dict[key] else {
            return nil
        }
        
        return value as? T
    }
}
