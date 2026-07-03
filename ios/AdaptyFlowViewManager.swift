@objc(AdaptyFlowView)
class AdaptyFlowViewManager: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func view() -> UIView! {
        return AdaptyFlowWrapperView()
    }
}
