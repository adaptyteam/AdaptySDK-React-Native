import Foundation

enum BridgeError: Error {
    case missingRequiredArgument(name: String)
    case typeMismatch(name: String, type: String)
}
