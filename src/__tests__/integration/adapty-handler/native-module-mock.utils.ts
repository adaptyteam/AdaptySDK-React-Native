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
  get_onboarding?: components['requests']['GetOnboarding.Response'];
  get_onboarding_for_default_audience?: components['requests']['GetOnboardingForDefaultAudience.Response'];
  identify?: components['requests']['Identify.Response'];
  logout?: components['requests']['Logout.Response'];
  restore_purchases?: components['requests']['RestorePurchases.Response'];
  open_web_paywall?: components['requests']['OpenWebPaywall.Response'];
  create_web_paywall_url?: components['requests']['CreateWebPaywallUrl.Response'];
  set_log_level?: components['requests']['SetLogLevel.Response'];
  set_fallback?: components['requests']['SetFallback.Response'];
  set_integration_identifiers?: components['requests']['SetIntegrationIdentifier.Response'];
  present_code_redemption_sheet?: components['requests']['PresentCodeRedemptionSheet.Response'];
  update_collecting_refund_data_consent?: components['requests']['UpdateCollectingRefundDataConsent.Response'];
  update_refund_preference?: components['requests']['UpdateRefundPreference.Response'];
}

/**
 * Options for extractNativeRequest function
 */
interface ExtractNativeRequestOptions {
  nativeModule: MockNativeModule;
  callIndex?: number; // default = 0
}

/**
 * Options for expectNativeCall function
 */
interface ExpectNativeCallOptions<T extends { method: string }> {
  nativeModule: MockNativeModule;
  method: string;
  expectedRequest: T;
  callIndex?: number; // default = 0
}

/**
 * Options for emitNativeEvent function
 */
interface EmitNativeEventOptions {
  eventName: string;
  eventData: any;
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
 * @param options - Extraction options
 * @param options.nativeModule - Mocked native module
 * @param options.callIndex - Which call to inspect (default: 0 = first call)
 * @returns Parsed request object with type safety
 *
 * @example
 * ```typescript
 * const request = extractNativeRequest<
 *   components['requests']['Activate.Request']
 * >({
 *   nativeModule: nativeMock,
 *   callIndex: 1
 * });
 *
 * expect(request.configuration.api_key).toBe('test_key');
 * ```
 */
export function extractNativeRequest<T>(
  options: ExtractNativeRequestOptions
): T {
  const { nativeModule, callIndex = 0 } = options;

  const calls = nativeModule.handler.mock.calls;

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
 * @param options - Verification options
 * @param options.nativeModule - Mocked native module
 * @param options.method - Expected method name (e.g., 'activate')
 * @param options.expectedRequest - Expected request structure
 * @param options.callIndex - Which call to verify (default: 0 = first call)
 *
 * @example
 * ```typescript
 * expectNativeCall({
 *   nativeModule: nativeMock,
 *   method: 'activate',
 *   expectedRequest: ACTIVATE_REQUEST_MINIMAL
 * });
 * ```
 */
export function expectNativeCall<T extends { method: string }>(
  options: ExpectNativeCallOptions<T>
): void {
  const { nativeModule, method: expectedMethod, expectedRequest, callIndex = 0 } = options;

  const calls = nativeModule.handler.mock.calls;

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
  resetTestEmitter();
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
 * Resets the global test emitter
 * Should be called in afterEach to ensure clean state between tests
 */
export function resetTestEmitter(): void {
  if (globalTestEmitter) {
    globalTestEmitter.removeAllListeners();
    globalTestEmitter = null;
  }
}

/**
 * Emits a mock native event for testing
 *
 * @param options - Event emission options
 * @param options.eventName - Native event name (e.g., 'did_load_latest_profile')
 * @param options.eventData - Event data as object (will be JSON.stringified)
 *
 * @example
 * ```typescript
 * emitNativeEvent({
 *   eventName: 'did_load_latest_profile',
 *   eventData: EVENT_DID_LOAD_LATEST_PROFILE
 * });
 * ```
 */
export function emitNativeEvent(options: EmitNativeEventOptions): void {
  const { eventName, eventData } = options;
  const emitter = getTestEmitter();
  emitter.emit(eventName, JSON.stringify(eventData));
}
