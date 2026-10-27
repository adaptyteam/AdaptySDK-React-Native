#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNAdaptySpec/RNAdaptySpec.h>
#endif

NS_ASSUME_NONNULL_BEGIN

// Mirrors the Swift class by hand; never import any *-Swift.h here (duplicate interface error).
@interface RNAdaptyImpl : NSObject
@property (class, nonatomic, readonly) NSArray<NSString *> *supportedEvents;
@property (nonatomic) BOOL hasListeners;
- (instancetype)initWithSendEvent:(void (^)(NSString *name, NSString *body))sendEvent;
- (void)handle:(NSString *)method args:(NSString *)args completion:(void (^)(NSString *response))completion;
- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;
@end

NS_ASSUME_NONNULL_END

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNAdapty : RCTEventEmitter <NativeRNAdaptySpec>
#else
@interface RNAdapty : RCTEventEmitter <RCTBridgeModule>
#endif
@end

#ifdef RCT_NEW_ARCH_ENABLED
// A spec <-> .mm selector mismatch fails the build instead of crashing at runtime
#pragma clang diagnostic push
#pragma clang diagnostic error "-Wprotocol"
#endif

@implementation RNAdapty {
  RNAdaptyImpl *_impl;
}

RCT_EXPORT_MODULE(RNAdapty)

// UI Thread is required to properly work with StoreKit SDK
+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (instancetype)init
{
  if ((self = [super init])) {
    __weak RNAdapty *weakSelf = self;
    _impl = [[RNAdaptyImpl alloc] initWithSendEvent:^(NSString *name, NSString *body) {
      [weakSelf sendEventWithName:name body:body];
    }];
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return RNAdaptyImpl.supportedEvents;
}

- (void)startObserving
{
  _impl.hasListeners = YES;
}

- (void)stopObserving
{
  _impl.hasListeners = NO;
}

RCT_EXPORT_METHOD(handle : (NSString *)method args : (NSDictionary *)args resolve : (RCTPromiseResolveBlock)
                      resolve reject : (RCTPromiseRejectBlock)reject)
{
  id json = args[@"args"];
  [_impl handle:method
            args:[json isKindOfClass:NSString.class] ? json : @""
      completion:^(NSString *response) {
        resolve(response);
      }];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeRNAdaptySpecJSI>(params);
}
#endif

@end

#ifdef RCT_NEW_ARCH_ENABLED
#pragma clang diagnostic pop
#endif
