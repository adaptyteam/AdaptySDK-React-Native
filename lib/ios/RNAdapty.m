#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNAdapty, NSObject)

RCT_EXTERN_METHOD(presentCodeRedemptionSheet)

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
                  getPurchaseInfo: (NSDictionary)options
                  resolver:        (RCTPromiseResolveBlock)resolve
                  rejecter:        (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  restorePurchases:  (RCTPromiseResolveBlock)resolve
                  rejecter:         (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  makePurchase: (NSString)productId
                  variationId: (NSString)variationId
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
                  getPaywalls: (NSDictionary)options
                  resolver:    (RCTPromiseResolveBlock)resolve
                  rejecter:    (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
                  setExternalAnalyticsEnabled: (BOOL)isEnabled
                  resolver:                    (RCTPromiseResolveBlock)resolve
                  rejecter:                    (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  setVariationID: (NSString)variationId
                  transactionId:  (NSString)transactionId
                  resolver:       (RCTPromiseResolveBlock)resolve
                  rejecter:       (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  getAPNSToken: (RCTPromiseResolveBlock)resolve
                  rejecter:     (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
                  setAPNSToken: (NSString)apns
                  resolver:    (RCTPromiseResolveBlock)resolve
                  rejecter:    (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
                  logShowPaywall: (NSString)variationId
                  resolver:    (RCTPromiseResolveBlock)resolve
                  rejecter:    (RCTPromiseRejectBlock)reject
)

@end
