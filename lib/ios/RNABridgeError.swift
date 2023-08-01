import Foundation

enum BridgeError: Error {
    case missingRequiredArgument(name: ParamKey)
    case typeMismatch(name: ParamKey, type: String)
}
