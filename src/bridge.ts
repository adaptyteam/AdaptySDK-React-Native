import { EmitterSubscription } from 'react-native';
import { NativeRequestHandler } from '@/native-request-handler';
import { MockRequestHandler } from '@/mock';
import type { AdaptyMockConfig } from '@/mock/types';
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

/**
 * Internal bridge handler - can be either Native or Mock depending on configuration
 */
let _bridge:
  | NativeRequestHandler<MethodName, string>
  | MockRequestHandler<MethodName, string>
  | null = null;

/**
 * Initialize bridge with either native or mock handler
 * @param enableMock - Whether to use mock mode
 * @param mockConfig - Configuration for mock mode
 */
export function initBridge(
  enableMock: boolean = false,
  mockConfig?: AdaptyMockConfig,
): void {
  if (enableMock) {
    _bridge = new MockRequestHandler<MethodName, string>(mockConfig);
  } else {
    _bridge = new NativeRequestHandler<MethodName, string>(MODULE_NAME);
  }
}

/**
 * Check if bridge has been initialized
 * @returns true if bridge is initialized, false otherwise
 */
export function isBridgeInitialized(): boolean {
  return _bridge !== null;
}

/**
 * Reset bridge to null (for testing purposes only)
 * @internal
 */
export function resetBridge(): void {
  if (_bridge) {
    _bridge.removeAllEventListeners();
  }
  _bridge = null;
}

/**
 * Bridge handler - automatically initializes with native handler if not yet initialized
 * For mock mode, call initBridge(true) in activate() before using
 */
export const $bridge = {
  get request() {
    if (!_bridge) initBridge(false);
    return _bridge!.request.bind(_bridge);
  },
  addEventListener<Event extends string, CallbackData>(
    event: Event,
    cb: (this: { rawValue: any }, data: CallbackData) => void | Promise<void>,
  ): EmitterSubscription {
    if (!_bridge) initBridge(false);
    return _bridge!.addEventListener(event, cb);
  },
  addRawEventListener<
    Event extends string,
    Cb extends (event: any) => void | Promise<void>,
  >(event: Event, cb: Cb): EmitterSubscription {
    if (!_bridge) initBridge(false);
    return _bridge!.addRawEventListener(event, cb);
  },
  removeAllEventListeners(): void {
    if (!_bridge) initBridge(false);
    return _bridge!.removeAllEventListeners();
  },
};
