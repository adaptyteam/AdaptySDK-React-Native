@objc(AdaptyPaywallView)
class AdaptyPaywallViewManager: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func view() -> UIView! {
        return AdaptyPaywallWrapperView()
    }
}
