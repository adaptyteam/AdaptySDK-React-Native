/**
 * This file exposes all the API, that is needed by documentation,
 * not for the end user.
 */
export * from '@/adapty-handler';
export * from '@/adapty-error';
// Types
export * from './types/error';
export * from './types/index';
export {
  LogLevel,
  FetchPolicy,
  AdaptyAndroidSubscriptionUpdateReplacementMode,
  type GetPlacementParamsInput,
  type GetPlacementForDefaultAudienceParamsInput,
  type MakePurchaseParamsInput,
  type FileLocation,
  type IdentifyParamsInput,
  type GetPaywallProductsParamsInput,
  type AdaptyAndroidPurchaseParams,
  type AdaptyAndroidSubscriptionUpdateParameters,
} from '@adapty/core';
export * from './ui/types';
export { FlowViewController } from './ui/flow-view-controller';
export { OnboardingViewController } from './ui/onboarding-view-controller';
export * from './mock/types';
// UI functions & components
export { createFlowView } from './ui/create-flow-view';
export { createOnboardingView } from './ui/create-onboarding-view';
export {
  AdaptyFlowView,
  type AdaptyFlowViewProps,
} from './ui/AdaptyFlowView';
export {
  AdaptyOnboardingView,
  type AdaptyOnboardingViewProps,
} from './ui/AdaptyOnboardingView';
// Utilities
export { isRunningInExpoGo, shouldEnableMock } from './utils/env-detection';

export { AdaptyError, LogContext, LogScope } from '@adapty/core';
export type { ActivateParamsInput, LogArgs } from '@adapty/core';
