import { NativeModules, NativeEventEmitter } from 'react-native';
import type { components } from '@/types/api';

/**
 * Native Module Mock Utilities
 *
 * Provides utilities for mocking NativeModules.RNAdapty in integration tests.
 * Enables spy-based assertions on native bridge communication.
 */

/**
 * Type for native module handler function
 * Matches signature of actual native handler: (method, params) => Promise<JSON string>
 */
type NativeHandlerFn = (
  method: string,
  params: { args: string },
) => Promise<string>;

/**
 * Mock implementation of RNAdapty native module
 * Provides jest spy capabilities for assertions
 */
export interface MockNativeModule {
  /**
   * Returns constants required by NativeRequestHandler
   * Must include HANDLER key with handler method name
   */
  getConstants: jest.Mock<Record<string, string>>;

  /**
   * Handler function that processes SDK requests
   * Spied for assertions on method calls and parameters
   */
  handler: jest.MockedFunction<NativeHandlerFn>;
}

/**
 * Response registry for mapping method names to their typed responses
 * Extended in Phase 2 to support profile, purchase, paywall methods
 */
interface ResponseRegistry {
  activate?: components['requests']['Activate.Response'];
  is_activated?: components['requests']['IsActivated.Response'];
  get_profile?: components['requests']['GetProfile.Response'];
  update_profile?: components['requests']['UpdateProfile.Response'];
  get_paywall?: components['requests']['GetPaywall.Response'];
  get_paywall_products?: components['requests']['GetPaywallProducts.Response'];
  log_show_paywall?: components['requests']['LogShowPaywall.Response'];
  make_purchase?: components['requests']['MakePurchase.Response'];
}

/**
 * Creates a mocked RNAdapty native module with typed responses
 *
 * The mock intercepts calls to NativeModules.RNAdapty.handler() and returns
 * predefined responses as JSON strings (mimicking actual native behavior).
 *
 * @param responses - Registry mapping method names to their typed responses
 * @returns Mocked native module with spy capabilities
 *
 * @example
 * ```typescript
 * const nativeMock = createNativeModuleMock({
 *   activate: { success: true },
 *   is_activated: { success: true },
 * });
 *
 * // Use SDK normally
 * await adapty.activate('test_key');
 *
 * // Assert on native calls
 * expect(nativeMock.handler).toHaveBeenCalledWith(
 *   'activate',
 *   { args: expect.any(String) }
 * );
 * ```
 */
export function createNativeModuleMock(
  responses: ResponseRegistry = {},
): MockNativeModule {
  // Create handler mock that returns registered responses
  const handlerMock = jest.fn<Promise<string>, [string, { args: string }]>(
    (method, _params) => {
      // Get response for this method from registry
      const response = responses[method as keyof ResponseRegistry];

      if (!response) {
        return Promise.reject(
          new Error(`No mock response registered for method: ${method}`),
        );
      }

      // Return response as JSON string (like real native bridge)
      return Promise.resolve(JSON.stringify(response));
    },
  );

  const mock: MockNativeModule = {
    getConstants: jest.fn(() => ({ HANDLER: 'handler' })),
    handler: handlerMock,
  };

  // Install mock into NativeModules
  (NativeModules as any).RNAdapty = mock;

  // Improve NativeEventEmitter mock to support event emission
  if (!(NativeEventEmitter as any).__mocked) {
    (NativeEventEmitter as any) = jest.fn().mockImplementation(() => {
      const emitter = getTestEmitter();
      return {
        addListener: emitter.addListener.bind(emitter),
        emit: emitter.emit.bind(emitter),
        removeAllListeners: emitter.removeAllListeners.bind(emitter),
      };
    });
    (NativeEventEmitter as any).__mocked = true;
  }

  return mock;
}

/**
 * Extracts and parses the request sent to native module
 *
 * @param mock - Mocked native module returned by createNativeModuleMock
 * @param callIndex - Which call to inspect (default: 0 = first call)
 * @returns Parsed request object with type safety
 *
 * @example
 * ```typescript
 * const request = extractNativeRequest<
 *   components['requests']['Activate.Request']
 * >(nativeMock, 0);
 *
 * expect(request.configuration.api_key).toBe('test_key');
 * expect(request.configuration.log_level).toBe('error');
 * ```
 */
export function extractNativeRequest<T>(
  mock: MockNativeModule,
  callIndex: number = 0,
): T {
  const calls = mock.handler.mock.calls;

  if (calls.length <= callIndex) {
    throw new Error(
      `No call at index ${callIndex}. Total calls: ${calls.length}`,
    );
  }

  const call = calls[callIndex];
  if (!call) {
    throw new Error(`Call at index ${callIndex} is undefined`);
  }

  const [, params] = call;
  const parsedArgs = JSON.parse(params.args) as T;

  return parsedArgs;
}

/**
 * Verifies that native module was called with correct request format
 *
 * Uses toMatchObject for partial matching - SDK may add extra fields like
 * cross_platform_sdk_name, activate_ui, media_cache, etc.
 *
 * @param mock - Mocked native module
 * @param expectedMethod - Expected method name (e.g., 'activate')
 * @param expectedRequest - Expected request structure (will be compared against actual)
 * @param callIndex - Which call to verify (default: 0 = first call)
 *
 * @example
 * ```typescript
 * expectNativeCall(
 *   nativeMock,
 *   'activate',
 *   ACTIVATE_REQUEST_MINIMAL,
 *   0
 * );
 * ```
 */
export function expectNativeCall<T extends { method: string }>(
  mock: MockNativeModule,
  expectedMethod: string,
  expectedRequest: T,
  callIndex: number = 0,
): void {
  const calls = mock.handler.mock.calls;

  if (calls.length <= callIndex) {
    throw new Error(
      `No call at index ${callIndex}. Total calls: ${calls.length}`,
    );
  }

  const call = calls[callIndex];
  if (!call) {
    throw new Error(`Call at index ${callIndex} is undefined`);
  }

  const [actualMethod, params] = call;
  const actualRequest = JSON.parse(params.args) as T;

  expect(actualMethod).toBe(expectedMethod);
  expect(actualRequest).toMatchObject(expectedRequest);
}

/**
 * Resets native module mock for next test
 * Clears call history and mock state
 *
 * @param mock - Mocked native module to reset
 *
 * @example
 * ```typescript
 * afterEach(() => {
 *   resetNativeModuleMock(nativeMock);
 * });
 * ```
 */
export function resetNativeModuleMock(mock: MockNativeModule): void {
  mock.handler.mockClear();
  mock.getConstants.mockClear();
}

/**
 * Simple event emitter for testing
 */
class TestEventEmitter {
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  addListener(event: string, callback: (...args: any[]) => void): { remove: () => void } {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return {
      remove: () => {
        this.listeners.get(event)?.delete(callback);
      },
    };
  }

  emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

// Global test emitter instance
let globalTestEmitter: TestEventEmitter | null = null;

/**
 * Get or create global test emitter for event testing
 */
export function getTestEmitter(): TestEventEmitter {
  if (!globalTestEmitter) {
    globalTestEmitter = new TestEventEmitter();
  }
  return globalTestEmitter;
}

/**
 * Emits a mock native event for testing
 *
 * @param eventName - Native event name (e.g., 'did_load_latest_profile')
 * @param eventData - Event data as object (will be JSON.stringified)
 *
 * @example
 * ```typescript
 * emitNativeEvent('did_load_latest_profile', EVENT_DID_LOAD_LATEST_PROFILE);
 * ```
 */
export function emitNativeEvent(eventName: string, eventData: any): void {
  const emitter = getTestEmitter();
  emitter.emit(eventName, JSON.stringify(eventData));
}
