import {
  NativeRequestHandler,
  ParamMap as GenericParamMap,
} from '@/native-request-handler';

import type { MethodName, ParamKey } from '@/types/bridge';

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

export class ParamMap extends GenericParamMap<ParamKey> {
  constructor() {
    super();
  }
}

export const $bridge = new NativeRequestHandler<MethodName, ParamMap>(
  MODULE_NAME,
);
