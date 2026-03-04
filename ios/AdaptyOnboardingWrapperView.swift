import UIKit
import AdaptyUI
import AdaptyPlugin

@objc(AdaptyOnboardingWrapperView)
class AdaptyOnboardingWrapperView: UIView {
    private var child: UIView?

    @objc var viewId: NSString = "NO_ID" as NSString {
        didSet { scheduleSetup() }
    }

    @objc var onboardingJson: NSString = "{}" {
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
        print("AdaptyOnboardingWrapperView setupView called: \(onboardingJson)")
        guard #available(iOS 15.0, *) else { return }
        
        // Clean up existing child view to prevent memory leaks
        cleanupChild()

        let json = onboardingJson as String
        let id = viewId as String
        guard id != "NO_ID" else { return }

        Task { @MainActor in
            guard let config = try? await AdaptyPlugin.getOnboardingViewConfiguration(withJson: json)
            else {
                print("AdaptyOnboardingWrapperView: Failed to get onboarding configuration")
                return
            }

            let handler = SwiftAdaptyPluginEventHandler { event in
                RNAdapty.emitPluginEvent(event)
            }

            let uiView = AdaptyOnboardingPlatformViewWrapper(
                viewId: id,
                eventHandler: handler,
                configuration: config
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
    
    deinit {
        cleanupChild()
    }
}
