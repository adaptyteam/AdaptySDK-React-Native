#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNAdapty, NSObject)
RCT_EXTERN_METHOD(
                  activate:     (NSString)sdkKey
                  uId:          (NSString)uId
                  observerMode: (BOOL)observerMode
                  logLevel:     (NSString)logLevel
)

RCT_EXTERN_METHOD(
                  updateAttribution:  (NSDictionary)dict
                  source:             (NSString)source
                  resolver:           (RCTPromiseResolveBlock)resolve
                  rejecter:           (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  identify: (NSString)uId
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  logout:   (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  updateProfile:  (NSDictionary)dict
                  resolver:       (RCTPromiseResolveBlock)resolve
                  rejecter:       (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  getPurchaseInfo: (RCTPromiseResolveBlock)resolve
                  rejecter:        (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  restorePurchases:  (RCTPromiseResolveBlock)resolve
                  rejecter:         (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  makePurchase: (NSString)productId
                  resolver:     (RCTPromiseResolveBlock)resolve
                  rejecter:     (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  validateReceipt: (NSString)receipt
                  resolver:     (RCTPromiseResolveBlock)resolve
                  rejecter:     (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  getPromo: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
                  getPaywalls: (RCTPromiseResolveBlock)resolve
                  rejecter:    (RCTPromiseRejectBlock)reject
)

@end
