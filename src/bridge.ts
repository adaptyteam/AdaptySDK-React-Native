import { NativeRequestHandler } from '@/native-request-handler';

import type { MethodName } from '@/types/bridge';

/**
 * Name of bridge package
 * React Native looks for a module with provided name
 * via NativeModules API
 *
 * Must be the same as string:
 * - iOS: RNAdapty.m & RNAdapty.swift. Also match in RCT_EXTERN_MODULE
 * - Android: AdaptyReactModule.kt (getName)
 */
export const MODULE_NAME = 'RNAdapty';

export const $bridge = new NativeRequestHandler<MethodName, string>(
  MODULE_NAME,
);
