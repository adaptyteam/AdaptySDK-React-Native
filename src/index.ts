import { adapty } from './adapty-instance';

export * from './types/error';
export * from './types/index';
export {
  LogLevel,
  FetchPolicy,
  AdaptyAndroidSubscriptionUpdateReplacementMode,
  type ActivateParamsInput,
  type GetPlacementParamsInput,
  type GetPlacementForDefaultAudienceParamsInput,
  type PreloadPlacementsParamsInput,
  type MakePurchaseParamsInput,
  type FileLocation,
  type IdentifyParamsInput,
  type GetPaywallProductsParamsInput,
  type AdaptyAndroidPurchaseParams,
} from '@adapty/core';
export { consoleLogSink } from '@/logger';
export type { LogSink, LoggerConfig, LogEvent } from '@/logger';
export { AdaptyError } from './adapty-error';
export * from './utils/env-detection';
export * from './mock/types';

export { adapty };
export * from './ui';
