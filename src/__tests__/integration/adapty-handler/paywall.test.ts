import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import { FetchPolicy } from '@/types/inputs';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PAYWALL_REQUEST,
  GET_PAYWALL_RESPONSE,
  GET_PAYWALL_RESPONSE_ERROR,
  LOG_SHOW_PAYWALL_RESPONSE,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

/**
 * Integration tests for Adapty paywall operations
 *
 * Tests verify:
 * 1. GetPaywall request format and response parsing
 * 2. LogShowPaywall request encoding
 * 3. Paywall field transformations (snake_case → camelCase)
 */
describe('Adapty - Paywall (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_paywall: GET_PAYWALL_RESPONSE,
      log_show_paywall: LOG_SHOW_PAYWALL_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('Basic getPaywall', () => {
    it('should return paywall with default parameters', async () => {
      const paywall = await adapty.getPaywall('test_placement');

      // Verify: GetPaywall.Request sent
      expectNativeCall({
        nativeModule: nativeMock,
        method: 'get_paywall',
        expectedRequest: GET_PAYWALL_REQUEST
      });

      // Verify: response parsed to camelCase
      expect(paywall).toBeDefined();
      expect(paywall.id).toContain('test_placement');
      expect(paywall.name).toBe('test_placement');
      expect(paywall.placement.id).toBe('test_placement');
      expect(paywall.variationId).toBeDefined();
      expect(paywall.hasViewConfiguration).toBe(true);
    });

    it('should return different paywalls for different placementId', async () => {
      // Setup different response for second call
      const response2: components['requests']['GetPaywall.Response'] = {
        success: {
          ...GET_PAYWALL_RESPONSE.success!,
          placement: {
            ...GET_PAYWALL_RESPONSE.success!.placement,
            developer_id: 'placement_two',
          },
          paywall_id: 'paywall_placement_two',
          paywall_name: 'placement_two',
        },
      };

      nativeMock.handler.mockImplementationOnce((_method, _params) => {
        return Promise.resolve(JSON.stringify(GET_PAYWALL_RESPONSE));
      });

      nativeMock.handler.mockImplementationOnce((_method, _params) => {
        return Promise.resolve(JSON.stringify(response2));
      });

      const paywall1 = await adapty.getPaywall('placement_one');
      const paywall2 = await adapty.getPaywall('placement_two');

      // Verify: different paywall_id returned from native
      expect(paywall1.id).toBe('paywall_test_placement');
      expect(paywall2.id).toBe('paywall_placement_two');
      expect(paywall1.name).toBe('test_placement');
      expect(paywall2.name).toBe('placement_two');
      // Verify: placement.id reflects what was returned from native (developer_id)
      expect(paywall1.placement.id).toBe('test_placement');
      expect(paywall2.placement.id).toBe('placement_two');
    });

    it('should return paywall with correct structure', async () => {
      const paywall = await adapty.getPaywall('structure_test');

      // Verify: request sent with correct placement_id
      const request = extractNativeRequest<
        components['requests']['GetPaywall.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.placement_id).toBe('structure_test');

      // Check all required fields
      expect(paywall.id).toBeDefined();
      expect(paywall.name).toBeDefined();
      expect(paywall.variationId).toBeDefined();
      expect(paywall.hasViewConfiguration).toBeDefined();
      expect(paywall.requestLocale).toBeDefined();
      expect(paywall.version).toBeDefined();

      // Check placement structure
      expect(paywall.placement).toBeDefined();
      expect(paywall.placement.id).toBe('test_placement');
      expect(paywall.placement.abTestName).toBeDefined();
      expect(paywall.placement.audienceName).toBeDefined();
      expect(paywall.placement.revision).toBeDefined();
      expect(paywall.placement.audienceVersionId).toBeDefined();

      // Check paywallBuilder (modern structure) or remoteConfig (legacy)
      expect(
        paywall.paywallBuilder !== undefined ||
          paywall.remoteConfig !== undefined,
      ).toBe(true);
      if (paywall.paywallBuilder) {
        expect(paywall.paywallBuilder.id).toBeDefined();
        expect(paywall.paywallBuilder.lang).toBeDefined();
      }

      // Check productIdentifiers
      expect(paywall.productIdentifiers).toBeDefined();
      expect(Array.isArray(paywall.productIdentifiers)).toBe(true);
      expect(paywall.productIdentifiers.length).toBeGreaterThan(0);
    });
  });

  describe('API parameters smoke-test', () => {
    it('should accept all parameters without errors', async () => {
      // Test that method accepts all parameters (locale, fetchPolicy, loadTimeoutMs)
      const paywall = await adapty.getPaywall('test_placement', 'ru', {
        fetchPolicy: FetchPolicy.ReturnCacheDataIfNotExpiredElseLoad,
        maxAgeSeconds: 300,
        loadTimeoutMs: 3000,
      });

      // Verify: request contains parameters
      const request = extractNativeRequest<
        components['requests']['GetPaywall.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.placement_id).toBe('test_placement');
      expect(request.locale).toBe('ru');
      // load_timeout is converted from ms to seconds (3000ms -> 3s)
      expect(request.load_timeout).toBe(3);

      // Verify method didn't crash and returns valid paywall
      expect(paywall).toBeDefined();
      expect(paywall.id).toContain('test_placement');
      expect(paywall.placement.id).toBe('test_placement');
    });
  });

  describe('logShowPaywall', () => {
    it('should log paywall show event after getPaywall', async () => {
      const paywall = await adapty.getPaywall('test_placement');
      nativeMock.handler.mockClear();

      // Should not throw
      await adapty.logShowPaywall(paywall);

      // Verify: LogShowPaywall.Request sent
      const request = extractNativeRequest<
        components['requests']['LogShowPaywall.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('log_show_paywall');
      expect(request.paywall.paywall_id).toBeDefined();
      expect(request.paywall.variation_id).toBeDefined();

      // Note: result is actually `true` (from obj.success in parseMethodResult),
      // not undefined, even though TypeScript signature is Promise<void>
      // This is expected behavior for Void type responses
    });
  });

  describe('Error handling', () => {
    it('should parse AdaptyError from GetPaywall.Response', async () => {
      // Reset bridge and create mock with error response for get_paywall
      resetBridge();
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        get_paywall: GET_PAYWALL_RESPONSE_ERROR,
      });

      // Create new Adapty instance and activate
      adapty = new Adapty();
      await adapty.activate('test_api_key');

      // Execute: get paywall should throw AdaptyError with adaptyCode
      await expect(adapty.getPaywall('nonexistent_placement')).rejects.toMatchObject({
        adaptyCode: 2, // camelCase in JS (from native adapty_code)
      });
    });
  });
});
