import Foundation
import Adapty
import AdaptyUI
import AdaptyPlugin

enum Log {
    typealias Category = AdaptyPlugin.LogCategory

    static let wrapper = Category(subsystem: "io.adapty.react", name: "wrapper")
}

@objc(RNAdapty)
class RNAdapty: RCTEventEmitter {
    // UI Thread is required to properly work with StoreKit SDK
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override init() {
        super.init()
        Task { @MainActor in
            AdaptyPlugin.reqister(setFallbackPaywallsRequests: { @MainActor assetId in
                return Bundle.main.url(forResource: assetId, withExtension: nil)
            })

            AdaptyPlugin.reqister(eventHandler: SwiftAdaptyPluginEventHandler { [weak self] event in
                guard let self = self, self.hasListeners else {
                    return
                }
                self.sendEvent(
                    withName: event.id,
                    body: try event.asAdaptyJsonData.asAdaptyJsonString
                )
            })
        }
    }
    
    // A list of emittable events to JavaScript
    override func supportedEvents() -> [String] {
        return [
            "did_load_latest_profile",
            "paywall_view_did_perform_action",
            "paywall_view_did_select_product",
            "paywall_view_did_start_purchase",
            "paywall_view_did_finish_purchase",
            "paywall_view_did_fail_purchase",
            "paywall_view_did_start_restore",
            "paywall_view_did_finish_restore",
            "paywall_view_did_fail_restore",
            "paywall_view_did_fail_rendering",
            "paywall_view_did_fail_loading_products",
        ]
    }
    
    override func constantsToExport() -> [AnyHashable : Any]! {
        // Name of the function that routes all incoming requests
        return ["HANDLER": "handle"]
    }
    
    // RN doesn't like when events fire
    // while nobody is listening
    // Omit warnings with this
    private var hasListeners = false
    
    override func startObserving() {
        self.hasListeners = true
    }
    override func stopObserving() {
        self.hasListeners = false
    }
    
    // MARK: - Handle router
    
    // `handle` is the main function, that routes calls to a corresponding function
    // and wraps controllers into a `AdaptyContext`
    //
    // Since currently synchronous bridge calls are not production-ready,
    // all functions are considered asynchronous
    //
    // Definitions are sorted alphabetically
    @objc public func handle(
        _ method: NSString,
        args: NSDictionary,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            let response = await AdaptyPlugin.execute(
                method: method as String,
                withJson: args["args"] as? String ?? ""
            )
            resolver(response.asAdaptyJsonString)
        }
    }
}

final class SwiftAdaptyPluginEventHandler: EventHandler {
    private let onEvent: @Sendable (AdaptyPluginEvent) throws -> Void
        
        init(onEvent: @escaping @Sendable (AdaptyPluginEvent) throws -> Void) {
            self.onEvent = onEvent
        }
    
    public func handle(event: AdaptyPluginEvent) {
        do {
            try onEvent(event)
        } catch {
            Log.wrapper.error("Plugin encoding error: \(error.localizedDescription)")
        }
    }
}
