import Foundation

public enum BridgeError: Error, CustomStringConvertible, Encodable {
    case missingRequiredArgument(name: ParamKey)
    case typeMismatch(name: ParamKey, type: String)
    case encodingFailed(Error)
    case methodNotImplemented
    case unsupportedIosVersion
    case unexpectedError(Error)
    
    public var description: String {
        switch self {
        case .missingRequiredArgument(let name):
            return "Missing required argument: \(name.rawValue)."
        case .typeMismatch(let name, let type):
            return "Type mismatch for argument \(name.rawValue). Expected type \(type)."
        case .encodingFailed(let error):
            return "Failed to encode data into JSON with error: \(error.localizedDescription)."
        case .methodNotImplemented:
            return "Method not implemented."
        case .unsupportedIosVersion:
            return "Unsupported iOS version."
        case .unexpectedError(let error):
            return "Unexpected error: \(error.localizedDescription)."
            
        }
    }
    
    enum CodingKeys: String, CodingKey {
        case errorType = "error_type"
        case name
        case type
        case underlyingError = "parent_error"
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        // Encode error type
        switch self {
        case .missingRequiredArgument(let name):
            try container.encode("missingRequiredArgument", forKey: .errorType)
            try container.encode(name.rawValue, forKey: .name)
            
        case .typeMismatch(let name, let type):
            try container.encode("typeMismatch", forKey: .errorType)
            try container.encode(name.rawValue, forKey: .name)
            try container.encode(type, forKey: .type)
            
        case .encodingFailed(let error):
            try container.encode("encodingFailed", forKey: .errorType)
            try container.encode(error.localizedDescription, forKey: .underlyingError)
            
        case .methodNotImplemented:
            try container.encode("methodNotImplemented", forKey: .errorType)
            
        case .unsupportedIosVersion:
            try container.encode("unsupportedIosVersion", forKey: .errorType)
            
        case .unexpectedError(let error):
            try container.encode("unexpectedError", forKey: .errorType)
            try container.encode(error.localizedDescription, forKey: .underlyingError)
            
        }
    }
    
}
