import type { IPlatformAdapter, ISdkMetadataAdapter } from '@adapty/core';
import { Platform } from 'react-native';
import version from '@/version';

/**
 * React Native implementation of IPlatformAdapter
 * Wraps Platform.OS from react-native
 */
export class ReactNativePlatformAdapter implements IPlatformAdapter {
  get OS(): 'ios' | 'android' | 'web' | 'unknown' {
    const os = Platform.OS;
    if (os === 'ios' || os === 'android') {
      return os;
    }
    if (os === 'web') {
      return 'web';
    }
    return 'unknown';
  }
}

/**
 * React Native implementation of ISdkMetadataAdapter
 * Provides SDK name and version metadata
 */
export class ReactNativeSdkMetadataAdapter implements ISdkMetadataAdapter {
  get sdkName(): string {
    return 'react-native';
  }

  get sdkVersion(): string {
    return version;
  }
}
