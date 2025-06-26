import UIKit
import AdaptyUI
import AdaptyPlugin

@objc(AdaptyOnboardingWrapperView)
class AdaptyOnboardingWrapperView: UIView {
    private var child: UIView?

    @objc var viewId: NSString = "NO_ID" as NSString

    @objc var onboardingJson: NSString = "{}" {
        didSet { setupView() }
    }

    @objc var onEvent: RCTDirectEventBlock?

    private func setupView() {
        print("AdaptyOnboardingWrapperView setupView called: \(onboardingJson)")
        guard #available(iOS 15.0, *), child == nil else { return }

        let json = onboardingJson as String
        let id = viewId as String

        Task { @MainActor in
            guard let onboarding = await AdaptyPlugin.executeCreateNativeOnboardingView(withJson: json),
                  let config = try? AdaptyUI.getOnboardingConfiguration(forOnboarding: onboarding)
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

            let uiView = AdaptyOnboardingPlatformViewWrapper(
                viewId: "rn_native_\(id)",
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
}
