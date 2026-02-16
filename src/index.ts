import { Adapty } from './adapty-handler';

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
export { AdaptyError } from './adapty-error';
export * from './utils/env-detection';
export * from './mock/types';

export const adapty = new Adapty();
export * from './ui';
