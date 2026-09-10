import UIKit
import React

@objc(AdaptyOnboardingViewManager)
public class AdaptyOnboardingViewManager: RCTViewManager {
    public override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    public override func view() -> UIView! {
        return AdaptyOnboardingWrapperView()
    }
}
