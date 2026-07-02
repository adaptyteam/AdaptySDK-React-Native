#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(AdaptyFlowView, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(viewId, NSString)
RCT_EXPORT_VIEW_PROPERTY(flowJson, NSString)

@end
