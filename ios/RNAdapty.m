#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(RNAdapty, RCTEventEmitter)

RCT_EXTERN_METHOD(
                  handle:   (NSString)method
                  args:     (NSDictionary)args
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

@end
