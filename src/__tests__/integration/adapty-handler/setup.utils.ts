import { Adapty } from '@/adapty-handler';

/**
 * Setup utilities for integration tests
 * Updated to use NativeModuleMock approach instead of MockStore
 */

/**
 * Cleans up Adapty instance by removing all listeners
 *
 * @param adapty - Adapty instance to cleanup
 */
export function cleanupAdapty(adapty: Adapty | null | undefined): void {
  if (!adapty) return;
  adapty.removeAllListeners();
}
