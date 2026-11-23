import UIKit
import Adapty
import AdaptyUI
import AdaptyPlugin

@objc(AdaptyFlowWrapperView)
public final class AdaptyFlowWrapperView: UIView {
    private var child: UIView?

    // Invalidate in-flight loads at once: the setup itself is deferred
    @objc(viewId) public var viewId: NSString = "NO_ID" as NSString {
        didSet {
            setupGeneration += 1
            scheduleSetup()
        }
    }

    @objc(flowJson) public var flowJson: NSString = "{}" {
        didSet {
            setupGeneration += 1
            scheduleSetup()
        }
    }

    private var setupScheduled = false
    private func scheduleSetup() {
        guard !setupScheduled else { return }
        setupScheduled = true
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.setupScheduled = false
            self.setupView()
        }
    }

    private func cleanupChild() {
        guard let child = child else { return }
        child.removeFromSuperview()
        self.child = nil
    }

    // Bumped on every setup and prop change; a stale load is dropped
    private var setupGeneration = 0
    // Below iOS 16 the error is reported once per view id
    private var reportedUnsupportedViewId: String?

    private func setupView() {
        setupGeneration += 1
        let generation = setupGeneration

        // Clean up existing child view to prevent memory leaks
        cleanupChild()

        let json = flowJson as String
        let id = viewId as String
        guard id != "NO_ID" else { return }

        Log.wrapper.verbose("[AdaptyFlowWrapperView] setupView: \(id)")

        // Native flow rendering requires iOS 16
        guard #available(iOS 16.0, *) else {
            guard reportedUnsupportedViewId != id else { return }
            reportedUnsupportedViewId = id
            RNAdaptyImpl.emitPluginEvent(FlowViewErrorEvent(
                view: FlowViewIdentity(viewId: id, flowJson: json),
                error: .ui(.platformNotSupported)
            ))
            Log.wrapper.error("Adapty flows require iOS 16.0 or newer")
            return
        }

        Task { @MainActor [weak self] in
            do {
                let config = try await AdaptyPlugin.getFlowViewConfiguration(withJson: json)

                guard let self, self.isCurrentSetup(generation, id) else { return }

                let handler = SwiftAdaptyPluginEventHandler { event in
                    RNAdaptyImpl.emitPluginEvent(event)
                }

                guard let parentViewController = self.findViewController() else { return }

                let uiView = AdaptyFlowPlatformViewWrapper(
                    viewId: id,
                    eventHandler: handler,
                    configuration: config,
                    parentVC: parentViewController
                )

                self.addSubview(uiView)
                uiView.translatesAutoresizingMaskIntoConstraints = false

                NSLayoutConstraint.activate([
                    uiView.leadingAnchor.constraint(equalTo: self.leadingAnchor),
                    uiView.trailingAnchor.constraint(equalTo: self.trailingAnchor),
                    uiView.topAnchor.constraint(equalTo: self.topAnchor),
                    uiView.bottomAnchor.constraint(equalTo: self.bottomAnchor),
                ])

                self.child = uiView
            } catch {
                // The view stays empty: report the error createFlowView would fail with
                guard let self, self.isCurrentSetup(generation, id) else { return }
                Log.wrapper.error("[AdaptyFlowWrapperView] \(id): \(error.localizedDescription)")
                RNAdaptyImpl.emitPluginEvent(FlowViewErrorEvent(
                    view: FlowViewIdentity(viewId: id, flowJson: json),
                    error: FlowViewError(error)
                ))
            }
        }
    }

    private func isCurrentSetup(_ generation: Int, _ id: String) -> Bool {
        setupGeneration == generation && (viewId as String) == id
    }

    deinit {
        cleanupChild()
    }

    private func findViewController() -> UIViewController? {
        var responder: UIResponder? = self
        while let nextResponder = responder?.next {
            if let viewController = nextResponder as? UIViewController {
                return viewController
            }
            responder = nextResponder
        }
        return nil
    }
}

/// `flow_view_did_receive_error` of an embedded flow view that never showed its flow:
/// below iOS 16, or when the flow fails to load.
private struct FlowViewErrorEvent: AdaptyPluginEvent {
    let id = "flow_view_did_receive_error"
    let view: FlowViewIdentity
    let error: FlowViewError

    enum CodingKeys: String, CodingKey {
        case id
        case view
        case error
    }
}

/// Error of an embedded flow view, encoded like the bridge's own errors
/// (`adapty_code`, `message`, `detail`) with the code createFlowView fails with.
private enum FlowViewError: Encodable {
    case adapty(AdaptyError)
    case ui(AdaptyUIError)
    case plugin(AdaptyPluginError)
    case other(code: Int, message: String, detail: String)

    init(_ error: Error) {
        switch error {
        case let error as AdaptyError:
            self = .adapty(error)
        case let error as AdaptyUIError:
            self = .ui(error)
        case let error as AdaptyPluginError:
            self = .plugin(error)
        case let error as DecodingError:
            // As the bridge fails a create flow view request with undecodable params
            let message = "Request params of method:adapty_ui_create_flow_view is invalid"
            self = .other(
                code: AdaptyError.ErrorCode.decodingFailed.rawValue,
                message: "\(message): \(error.localizedDescription)",
                detail: "AdaptyPluginError.decodingFailed: \(message) \(String(describing: error))"
            )
        default:
            // As the bridge fails a request with an unknown error
            self = .other(
                code: AdaptyError.ErrorCode.unknown.rawValue,
                message: "Unknown: \(error.localizedDescription)",
                detail: "AdaptyPluginError.unknown: \(String(describing: error))"
            )
        }
    }

    private enum CodingKeys: String, CodingKey {
        case code = "adapty_code"
        case message
        case detail
    }

    func encode(to encoder: Encoder) throws {
        switch self {
        case let .adapty(error):
            try error.encode(to: encoder)
        case let .ui(error):
            try error.encode(to: encoder)
        case let .plugin(error):
            try error.encode(to: encoder)
        case let .other(code, message, detail):
            var container = encoder.container(keyedBy: CodingKeys.self)
            try container.encode(code, forKey: .code)
            try container.encode(message, forKey: .message)
            try container.encode(detail, forKey: .detail)
        }
    }
}

/// `AdaptyUI.FlowView` of an embedded view that was never built: the view id and
/// the placement and variation of the flow from `flowJson`.
private struct FlowViewIdentity: Encodable {
    let id: String
    let placementId: String
    let variationId: String

    enum CodingKeys: String, CodingKey {
        case id
        case placementId = "placement_id"
        case variationId = "variation_id"
    }

    init(viewId: String, flowJson: String) {
        let params = flowJson.data(using: .utf8)
            .flatMap { try? JSONSerialization.jsonObject(with: $0) as? [String: Any] }
        let flow = params?["flow"] as? [String: Any]
        let placement = flow?["placement"] as? [String: Any]

        id = viewId
        placementId = placement?["developer_id"] as? String ?? ""
        variationId = flow?["variation_id"] as? String ?? ""
    }
}
