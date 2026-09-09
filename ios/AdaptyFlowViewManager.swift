import UIKit
import React

@objc(AdaptyFlowView)
public class AdaptyFlowViewManager: RCTViewManager {
    public override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    public override func view() -> UIView! {
        return AdaptyFlowWrapperView()
    }
}
