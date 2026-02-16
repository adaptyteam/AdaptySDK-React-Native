import { CoderFactory } from '@adapty/core';
import {
  ReactNativePlatformAdapter,
  ReactNativeSdkMetadataAdapter,
} from '@/adapters';

/**
 * Singleton instance of CoderFactory for React Native SDK
 * Initialized with React Native platform and SDK metadata adapters
 */
export const coderFactory = new CoderFactory({
  platform: new ReactNativePlatformAdapter(),
  sdkMetadata: new ReactNativeSdkMetadataAdapter(),
});
