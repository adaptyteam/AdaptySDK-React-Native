import type { IPlatformAdapter, ISdkMetadataAdapter } from '@adapty/core';
/**
 * React Native implementation of IPlatformAdapter
 * Wraps Platform.OS from react-native
 */
export declare class ReactNativePlatformAdapter implements IPlatformAdapter {
    get OS(): 'ios' | 'android' | 'web' | 'unknown';
}
/**
 * React Native implementation of ISdkMetadataAdapter
 * Provides SDK name and version metadata
 */
export declare class ReactNativeSdkMetadataAdapter implements ISdkMetadataAdapter {
    get sdkName(): string;
    get sdkVersion(): string;
}
//# sourceMappingURL=index.d.ts.map