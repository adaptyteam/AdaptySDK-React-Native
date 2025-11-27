@objc(AdaptyOnboardingViewManager)
class AdaptyOnboardingViewManager: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> UIView! {
        return AdaptyOnboardingWrapperView()
    }
}
