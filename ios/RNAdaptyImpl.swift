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
        RNAdaptyImpl.pendingLock.lock()
        RNAdaptyImpl.shared = self
        RNAdaptyImpl.instanceCount += 1
        // The first instance keeps events emitted before the module was created;
        // after a dev reload view ids restart, so old events could match new views
        if RNAdaptyImpl.instanceCount > 1 {
            RNAdaptyImpl.pendingEvents.removeAll()
        }
        RNAdaptyImpl.pendingLock.unlock()

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
    // Set from start/stopObserving on the module method queue (not main)
    @objc(hasListeners)
    public var hasListeners: Bool {
        get {
            RNAdaptyImpl.pendingLock.lock()
            defer { RNAdaptyImpl.pendingLock.unlock() }
            return listening
        }
        set {
            RNAdaptyImpl.pendingLock.lock()
            defer { RNAdaptyImpl.pendingLock.unlock() }
            listening = newValue
            guard newValue, !RNAdaptyImpl.pendingEvents.isEmpty else { return }
            // Flushed under the lock so concurrent emits cannot overtake queued events
            let events = RNAdaptyImpl.pendingEvents
            RNAdaptyImpl.pendingEvents.removeAll()
            Log.wrapper.verbose("[RNAdapty] Flushing \(events.count) pending events")
            events.forEach { send($0) }
        }
    }

    // Guarded by pendingLock
    private var listening = false

    // MARK: - Static event forwarder for native UI wrappers

    // Wrapper events that arrived before JS subscribed; guarded by pendingLock
    private static let pendingLock = NSLock()
    private static var pendingEvents: [AdaptyPluginEvent] = []
    private static let pendingEventsLimit = 32
    // Number of created instances; guarded by pendingLock
    private static var instanceCount = 0

    // Called synchronously from wrapper event handlers on any thread
    static func emitPluginEvent(_ event: AdaptyPluginEvent) {
        pendingLock.lock()
        defer { pendingLock.unlock() }

        let impl = shared
        if let impl, impl.listening, pendingEvents.isEmpty {
            impl.send(event)
            return
        }

        if pendingEvents.count >= pendingEventsLimit {
            let dropped = pendingEvents.removeFirst()
            Log.wrapper.warn("[RNAdapty] Pending events limit reached, dropping: \(dropped.id)")
        }
        pendingEvents.append(event)
        let reason = impl == nil ? "no module instance" : (impl?.listening == true ? "earlier events queued" : "no JS listeners")
        Log.wrapper.verbose("[RNAdapty] Queueing event (\(reason)): \(event.id)")
    }

    // Public AdaptyPlugin handler path; drops events while nobody listens
    private func handlePluginEvent(_ event: AdaptyPluginEvent) {
        guard hasListeners else { return }
        send(event)
    }

    // Sends without checking listeners; buffer paths call it under pendingLock
    private func send(_ event: AdaptyPluginEvent) {
        Log.wrapper.info("[RNAdapty] Forwarding event: \(event.id)")
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
