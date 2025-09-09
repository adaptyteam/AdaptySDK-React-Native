#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(AdaptyPaywallView, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(viewId, NSString)
RCT_EXPORT_VIEW_PROPERTY(paywallJson, NSString)

@end
