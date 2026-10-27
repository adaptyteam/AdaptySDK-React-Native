import Foundation
import Adapty
import AdaptyUI
import AdaptyPlugin

enum Log {
    typealias Category = AdaptyPlugin.LogCategory

    static let wrapper = Category(subsystem: "io.adapty.react", name: "wrapper")
}

// Swift side of the RNAdapty module; RNAdapty.mm declares this interface by hand,
// so every member keeps an explicit ObjC name. Must stay `public` to export the class symbol.
@objc(RNAdaptyImpl)
public final class RNAdaptyImpl: NSObject {
    // Weak reference to forward events from native views
    private static weak var shared: RNAdaptyImpl?

    private let sendEvent: (String, String) -> Void

    @objc(initWithSendEvent:)
    public init(sendEvent: @escaping (String, String) -> Void) {
        self.sendEvent = sendEvent
        super.init()
        RNAdaptyImpl.shared = self

        Task { @MainActor in
            let assetResolver: (String) -> URL? = { @MainActor assetId in
                return Bundle.main.url(forResource: assetId, withExtension: nil)
            }
            if #available(iOS 15.0, *) {
                AdaptyPlugin.register(createPaywallView: assetResolver)
            }
            AdaptyPlugin.register(setFallbackRequests: assetResolver)

            AdaptyPlugin.register(eventHandler: SwiftAdaptyPluginEventHandler { [weak self] event in
                self?.handlePluginEvent(event)
            })
        }
    }

    // A list of emittable events to JavaScript
    @objc(supportedEvents)
    public static var supportedEvents: [String] {
        return [
            "did_load_latest_profile",
            "did_receive_promoted_purchase",
            "flow_view_did_perform_action",
            "flow_view_did_select_product",
            "flow_view_did_start_purchase",
            "flow_view_did_finish_purchase",
            "flow_view_did_fail_purchase",
            "flow_view_did_start_restore",
            "flow_view_did_finish_restore",
            "flow_view_did_fail_restore",
            "flow_view_did_receive_error",
            "flow_view_did_fail_loading_products",
            "flow_view_did_finish_web_payment_navigation",
            "flow_view_did_appear",
            "flow_view_did_disappear",
            "flow_view_did_ask_permission",
            "flow_view_did_request_app_review",
            "flow_view_observer_did_initiate_purchase",
            "flow_view_observer_did_initiate_restore",
            "flow_view_did_receive_analytic_event",
            "onboarding_did_fail_with_error",
            "onboarding_on_analytics_action",
            "onboarding_did_finish_loading",
            "onboarding_on_close_action",
            "onboarding_on_custom_action",
            "onboarding_on_paywall_action",
            "onboarding_on_state_updated_action",
            "on_installation_details_success",
            "on_installation_details_fail",
        ]
    }

    // RN doesn't like when events fire
    // while nobody is listening
    // Omit warnings with this
    @objc(hasListeners)
    public var hasListeners = false

    // MARK: - Static event forwarder for native UI wrappers
    static func emitPluginEvent(_ event: AdaptyPluginEvent) {
        shared?.handlePluginEvent(event)
    }

    private func handlePluginEvent(_ event: AdaptyPluginEvent) {
        Log.wrapper.info("[RNAdapty] Forwarding event: \(event.id)")
        guard self.hasListeners else {
            return
        }
        do {
            let eventBody = try event.asAdaptyJsonData.asAdaptyJsonString
            self.sendEvent(event.id, eventBody)
        } catch {
            Log.wrapper.error("[RNAdapty] Serialize error \(event.id): \(error)")
        }
    }

    // MARK: - Handle router

    // `handle` is the main function, that routes calls to a corresponding function
    // and wraps controllers into a `AdaptyContext`
    //
    // Since currently synchronous bridge calls are not production-ready,
    // all functions are considered asynchronous
    @objc(handle:args:completion:)
    public func handle(
        _ method: String,
        args: String,
        completion: @escaping (String) -> Void
    ) {
        Task {
            let response = await AdaptyPlugin.execute(
                method: method,
                withJson: args
            )
            completion(response.asAdaptyJsonString)
        }
    }
}

public final class SwiftAdaptyPluginEventHandler: EventHandler {
    private let onEvent: @Sendable (AdaptyPluginEvent) throws -> Void

    public init(onEvent: @escaping @Sendable (AdaptyPluginEvent) throws -> Void) {
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
