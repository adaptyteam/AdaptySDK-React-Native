import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_REQUEST_MINIMAL,
  ACTIVATE_REQUEST_WITH_CUSTOMER_USER_ID,
  ACTIVATE_RESPONSE_SUCCESS,
  ACTIVATE_RESPONSE_ERROR,
  IS_ACTIVATED_REQUEST,
  IS_ACTIVATED_RESPONSE_TRUE,
  IS_ACTIVATED_RESPONSE_FALSE,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

/**
 * Integration tests for Adapty activation flow
 *
 * These tests verify the FULL bridge communication path:
 * 1. SDK encodes parameters via AdaptyConfigurationCoder (camelCase → snake_case)
 * 2. Bridge sends correctly formatted JSON to NativeModules.RNAdapty
 * 3. Native responses are parsed back to JS format (snake_case → camelCase)
 *
 * All request/response formats are validated against api.d.ts types.
 */
describe('Adapty - Activation (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(() => {
    // Create fresh Adapty instance
    adapty = new Adapty();
  });

  afterEach(() => {
    if (adapty) {
      cleanupAdapty(adapty);
    }

    if (nativeMock) {
      resetNativeModuleMock(nativeMock);
    }

    resetBridge();
  });

  describe('Basic activation', () => {
    it('should send correct Activate.Request with minimal params', async () => {
      // Setup: mock native module with success response
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        is_activated: IS_ACTIVATED_RESPONSE_TRUE,
      });

      // Execute: activate SDK
      await adapty.activate('test_api_key_12345');

      // Verify: SDK sent correct request format to native
      expectNativeCall({
        nativeModule: nativeMock,
        method: 'activate',
        expectedRequest: ACTIVATE_REQUEST_MINIMAL,
      });

      // Verify: activation succeeded
      const isActivated = await adapty.isActivated();
      expect(isActivated).toBe(true);
    });

    it('should send Activate.Request with log_level in snake_case', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
      });

      // Execute: activate with logLevel option
      await adapty.activate('test_api_key_12345', {
        logLevel: 'error', // camelCase in JS
      });

      // Verify: request contains log_level in snake_case
      const request = extractNativeRequest<
        components['requests']['Activate.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.configuration.log_level).toBe('error'); // snake_case
      expect((request.configuration as any).logLevel).toBeUndefined(); // no camelCase
    });

    it('should send Activate.Request with customer_user_id', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
      });

      // Execute: activate with customerUserId
      await adapty.activate('test_api_key_12345', {
        customerUserId: 'user_123', // camelCase in JS
        logLevel: 'error',
      });

      // Verify: matches expected request structure
      expectNativeCall({
        nativeModule: nativeMock,
        method: 'activate',
        expectedRequest: ACTIVATE_REQUEST_WITH_CUSTOMER_USER_ID,
      });

      // Verify: snake_case format
      const request = extractNativeRequest<
        components['requests']['Activate.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.configuration.customer_user_id).toBe('user_123');
    });

    it('should handle Activate.Response error', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_ERROR,
      });

      // Execute: activation should throw
      await expect(adapty.activate('invalid_key')).rejects.toThrow();

      // Verify: native was called
      expect(nativeMock.handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('isActivated state', () => {
    it('should return false before activation', async () => {
      nativeMock = createNativeModuleMock({
        is_activated: IS_ACTIVATED_RESPONSE_FALSE,
      });

      // Execute: check activation status
      const isActivated = await adapty.isActivated();

      // Verify: returns false
      expect(isActivated).toBe(false);

      // Verify: sent correct IsActivated.Request
      expectNativeCall({
        nativeModule: nativeMock,
        method: 'is_activated',
        expectedRequest: IS_ACTIVATED_REQUEST,
      });
    });

    it('should return true after successful activation', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        is_activated: IS_ACTIVATED_RESPONSE_TRUE,
      });

      // Execute: activate then check
      await adapty.activate('test_api_key_12345');
      const isActivated = await adapty.isActivated();

      // Verify: returns true
      expect(isActivated).toBe(true);

      // Verify: two calls made
      expect(nativeMock.handler).toHaveBeenCalledTimes(2);

      // First call: activate
      const firstCall = nativeMock.handler.mock.calls[0];
      expect(firstCall?.[0]).toBe('activate');

      // Second call: is_activated
      const secondCall = nativeMock.handler.mock.calls[1];
      expect(secondCall?.[0]).toBe('is_activated');
    });
  });

  describe('Configuration encoding', () => {
    it('should encode all configuration fields in snake_case', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
      });

      // Execute: activate with full configuration
      await adapty.activate('test_api_key_12345', {
        customerUserId: 'user_123',
        observerMode: true,
        serverCluster: 'eu',
        logLevel: 'verbose',
        ipAddressCollectionDisabled: true,
      });

      // Verify: all fields encoded in snake_case
      const request = extractNativeRequest<
        components['requests']['Activate.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.configuration).toMatchObject({
        api_key: 'test_api_key_12345',
        customer_user_id: 'user_123',
        observer_mode: true,
        server_cluster: 'eu',
        log_level: 'verbose',
        ip_address_collection_disabled: true,
      });

      // Verify: no camelCase fields leaked
      const configAny = request.configuration as any;
      expect(configAny.customerUserId).toBeUndefined();
      expect(configAny.observerMode).toBeUndefined();
      expect(configAny.serverCluster).toBeUndefined();
      expect(configAny.logLevel).toBeUndefined();
      expect(configAny.ipAddressCollectionDisabled).toBeUndefined();
    });

    it('should include api_key and default fields', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
      });

      // Execute: activate with only api_key
      await adapty.activate('test_api_key_12345');

      // Verify: api_key is present (SDK adds other default fields)
      const request = extractNativeRequest<
        components['requests']['Activate.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.configuration.api_key).toBe('test_api_key_12345');
      // SDK adds default fields like cross_platform_sdk_name, activate_ui, etc.
      expect(request.configuration.cross_platform_sdk_name).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should parse AdaptyError from Activate.Response', async () => {
      const errorResponse: components['requests']['Activate.Response'] = {
        error: {
          adapty_code: 2002,
          message: 'Invalid API key',
          detail: 'The provided API key is not valid',
        },
      };

      nativeMock = createNativeModuleMock({
        activate: errorResponse,
      });

      // Execute: activation should throw AdaptyError with adaptyCode
      await expect(adapty.activate('invalid_key')).rejects.toMatchObject({
        adaptyCode: 2002, // camelCase in JS (from native adapty_code)
      });
    });

    it('should handle native module rejection', async () => {
      nativeMock = createNativeModuleMock({
        // No response registered - will reject
      });

      // Execute: should throw error
      await expect(adapty.activate('test_key')).rejects.toThrow(
        'No mock response registered for method: activate',
      );
    });
  });

  describe('Response parsing', () => {
    it('should parse success response correctly', async () => {
      nativeMock = createNativeModuleMock({
        activate: { success: true },
      });

      // Execute: should not throw
      await expect(adapty.activate('test_key')).resolves.not.toThrow();
    });

    it('should handle IsActivated.Response boolean value', async () => {
      nativeMock = createNativeModuleMock({
        is_activated: { success: true },
      });

      // Execute
      const result = await adapty.isActivated();

      // Verify: returns boolean from success field
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Type safety verification', () => {
    it('should have strictly typed request structure', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
      });

      await adapty.activate('test_key');

      // Extract request with explicit type
      const request = extractNativeRequest<
        components['requests']['Activate.Request']
      >({
        nativeModule: nativeMock,
      });

      // Verify values
      expect(request.method).toBe('activate');
      expect(request.configuration.api_key).toBe('test_key');

      // TypeScript should error if accessing non-existent properties
      // @ts-expect-error - this property doesn't exist in api.d.ts
      expect(request.configuration.nonExistentField).toBeUndefined();
    });

    it('should have strictly typed response structure', async () => {
      const typedResponse: components['requests']['Activate.Response'] = {
        success: true,
      };

      nativeMock = createNativeModuleMock({
        activate: typedResponse,
      });

      await adapty.activate('test_key');

      // TypeScript enforces response type
      expect(typedResponse).toHaveProperty('success');
    });
  });
});
