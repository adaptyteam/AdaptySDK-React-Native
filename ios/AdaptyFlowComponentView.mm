#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/RNAdaptySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNAdaptySpec/Props.h>
#import <react/renderer/components/RNAdaptySpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

NS_ASSUME_NONNULL_BEGIN
// Mirrors the Swift class by hand; never import any *-Swift.h here
@interface AdaptyFlowWrapperView : UIView
@property (nonatomic, strong) NSString *viewId;
@property (nonatomic, strong) NSString *flowJson;
@end
NS_ASSUME_NONNULL_END

// Fabric host of the Swift wrapper that the legacy view manager also serves
@interface AdaptyFlowComponentView : RCTViewComponentView <RCTAdaptyFlowViewViewProtocol>
@end

@implementation AdaptyFlowComponentView {
  AdaptyFlowWrapperView *_wrapper;
}

// Registers through RCTViewComponentView +load where the C provider is compiled out (dynamic frameworks)
+ (void)load
{
  [super load];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<AdaptyFlowViewComponentDescriptor>();
}

// The wrapper owns a native view tied to viewId, so it is never reused for another instance
+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const AdaptyFlowViewProps>();
    _props = defaultProps;
    _wrapper = [[AdaptyFlowWrapperView alloc] initWithFrame:CGRectZero];
    self.contentView = _wrapper;
  }
  return self;
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<const AdaptyFlowViewProps>(_props);
  const auto &newViewProps = *std::static_pointer_cast<const AdaptyFlowViewProps>(props);
  if (oldViewProps.viewId != newViewProps.viewId) {
    _wrapper.viewId = [NSString stringWithUTF8String:newViewProps.viewId.c_str()] ?: @"";
  }
  if (oldViewProps.flowJson != newViewProps.flowJson) {
    _wrapper.flowJson = [NSString stringWithUTF8String:newViewProps.flowJson.c_str()] ?: @"";
  }
  [super updateProps:props oldProps:oldProps];
}

@end

// C linkage: RN 0.75-0.76 static builds reference it from the generated RCTThirdPartyFabricComponentsProvider
extern "C" Class<RCTComponentViewProtocol> AdaptyFlowViewCls(void);
Class<RCTComponentViewProtocol> AdaptyFlowViewCls(void)
{
  return AdaptyFlowComponentView.class;
}
#endif
