#import "React/RCTViewManager.h"

// RN 0.88 removes this macro only with both legacy interop layers off; the Fabric component serves the view there
#ifdef RCT_EXPORT_MODULE_NO_LOAD
@interface RCT_EXTERN_MODULE(AdaptyFlowView, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(viewId, NSString)
RCT_EXPORT_VIEW_PROPERTY(flowJson, NSString)

@end
#endif
