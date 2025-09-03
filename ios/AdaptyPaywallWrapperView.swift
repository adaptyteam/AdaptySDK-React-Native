import UIKit
import AdaptyUI
import AdaptyPlugin

@objc(AdaptyPaywallWrapperView)
class AdaptyPaywallWrapperView: UIView {
    private var child: UIView?

    @objc var viewId: NSString = "NO_ID" as NSString

    @objc var paywallJson: NSString = "{}" {
        didSet { setupView() }
    }

    @objc var onEvent: RCTDirectEventBlock?

    private func setupView() {
        print("AdaptyPaywallWrapperView setupView called: \(paywallJson)")
        guard #available(iOS 15.0, *), child == nil else { return }

        let json = paywallJson as String
        let id = viewId as String

        Task { @MainActor in
            guard let paywall = await AdaptyPlugin.executeCreateNativePaywallView(withJson: json),
                  let config = try? await AdaptyUI.getPaywallConfiguration(forPaywall: paywall, products: nil)
            else { return }

            let handler = SwiftAdaptyPluginEventHandler { [weak self] event in
                guard let self = self else { return }

                let eventId = event.id
                let json = try? event.asAdaptyJsonData.asAdaptyJsonString

                DispatchQueue.main.async {
                    if let json {
                        self.onEvent?(["eventId": eventId, "eventData": json])
                    }
                }
            }

            guard let parentViewController = self.findViewController() else { return }

            let uiView = AdaptyPaywallPlatformViewWrapper(
                viewId: "rn_native_\(id)",
                eventHandler: handler,
                configuration: config,
                parentVC: parentViewController
            )

            addSubview(uiView)
            uiView.translatesAutoresizingMaskIntoConstraints = false

            NSLayoutConstraint.activate([
                uiView.leadingAnchor.constraint(equalTo: leadingAnchor),
                uiView.trailingAnchor.constraint(equalTo: trailingAnchor),
                uiView.topAnchor.constraint(equalTo: topAnchor),
                uiView.bottomAnchor.constraint(equalTo: bottomAnchor),
            ])

            self.child = uiView
        }
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
