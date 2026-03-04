import UIKit
import Adapty
import AdaptyUI
import AdaptyPlugin

@objc(AdaptyPaywallWrapperView)
class AdaptyPaywallWrapperView: UIView {
    private var child: UIView?

    @objc var viewId: NSString = "NO_ID" as NSString {
        didSet { scheduleSetup() }
    }

    @objc var paywallJson: NSString = "{}" {
        didSet { scheduleSetup() }
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
    
    private func setupView() {
        print("AdaptyPaywallWrapperView setupView called: \(paywallJson)")
        guard #available(iOS 15.0, *) else { return }
        
        // Clean up existing child view to prevent memory leaks
        cleanupChild()

        let json = paywallJson as String
        let id = viewId as String
        guard id != "NO_ID" else { return }

        Task { @MainActor in
            do {
                let config = try await AdaptyPlugin.getPaywallViewConfiguration(withJson: json)

                let handler = SwiftAdaptyPluginEventHandler { event in
                    RNAdapty.emitPluginEvent(event)
                }

                guard let parentViewController = self.findViewController() else { return }

                let uiView = AdaptyPaywallPlatformViewWrapper(
                    viewId: id,
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
            } catch {
                print("AdaptyPaywallWrapperView error: \(error.localizedDescription)")
            }
        }
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
