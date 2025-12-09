#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(AdaptyOnboardingViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(viewId, NSString)
RCT_EXPORT_VIEW_PROPERTY(onboardingJson, NSString)

@end
