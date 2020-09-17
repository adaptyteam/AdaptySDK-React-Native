//
//  Counter.m
//  CounterApp
//
//  Created by Ivan on 12.09.2020.
//

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(RNAdapty, RCTEventEmitter)
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
@end
