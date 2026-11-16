import type { HostComponent } from 'react-native';
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';
import type {
  NativeAdaptyFlowViewProps,
  NativeAdaptyOnboardingViewProps,
} from './types';

// Static view configs: bridgeless renderers read them instead of asking native.
/** @internal */
export const FLOW_VIEW_CONFIG = {
  uiViewClassName: 'AdaptyFlowView',
  validAttributes: { viewId: true, flowJson: true },
} as const;

/** @internal */
export const ONBOARDING_VIEW_CONFIG = {
  uiViewClassName: 'AdaptyOnboardingView',
  validAttributes: { viewId: true, onboardingJson: true },
} as const;

export const AdaptyFlowViewHost: HostComponent<NativeAdaptyFlowViewProps> =
  get<NativeAdaptyFlowViewProps>('AdaptyFlowView', () => FLOW_VIEW_CONFIG);

export const AdaptyOnboardingViewHost: HostComponent<NativeAdaptyOnboardingViewProps> =
  get<NativeAdaptyOnboardingViewProps>(
    'AdaptyOnboardingView',
    () => ONBOARDING_VIEW_CONFIG,
  );
