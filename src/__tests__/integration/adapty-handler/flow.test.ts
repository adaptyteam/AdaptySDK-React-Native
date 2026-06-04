import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import { FetchPolicy } from '@adapty/core';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_FLOW_REQUEST,
  GET_FLOW_RESPONSE,
  GET_FLOW_RESPONSE_ERROR,
  GET_FLOW_FOR_DEFAULT_AUDIENCE_REQUEST,
  GET_FLOW_FOR_DEFAULT_AUDIENCE_RESPONSE,
  LOG_SHOW_FLOW_RESPONSE,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

/**
 * Integration tests for Adapty flow operations
 *
 * Tests verify:
 * 1. GetFlow request format and response parsing
 * 2. GetFlowForDefaultAudience request and response
 * 3. LogShowFlow request encoding
 * 4. Flow field transformations (snake_case → camelCase)
 */
describe('Adapty - Flow (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_flow: GET_FLOW_RESPONSE,
      get_flow_for_default_audience: GET_FLOW_FOR_DEFAULT_AUDIENCE_RESPONSE,
      log_show_flow: LOG_SHOW_FLOW_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('Basic getFlow', () => {
    it('should return flow with default parameters', async () => {
      const flow = await adapty.getFlow('test_placement');

      // Verify: GetFlow.Request sent
      expectNativeCall({
        nativeModule: nativeMock,
        method: 'get_flow',
        expectedRequest: GET_FLOW_REQUEST,
      });

      // Verify: response parsed to camelCase
      expect(flow).toBeDefined();
      expect(flow.id).toBe('flow_test_placement');
      expect(flow.name).toBe('test_placement');
      expect(flow.placement.id).toBe('test_placement');
      expect(flow.variationId).toBe('variation_123');
      expect(flow.variations).toBeDefined();
      expect(Array.isArray(flow.variations)).toBe(true);
      expect(flow.variations.length).toBeGreaterThan(0);
    });

    it('should return different flows for different placementId', async () => {
      // Setup different response for second call
      const response2: components['requests']['GetFlow.Response'] = {
        success: {
          ...GET_FLOW_RESPONSE.success!,
          placement: {
            ...GET_FLOW_RESPONSE.success!.placement,
            developer_id: 'placement_two',
          },
          flow_id: 'flow_placement_two',
          flow_name: 'placement_two',
        },
      };

      nativeMock.handler.mockImplementationOnce((_method, _params) => {
        return Promise.resolve(JSON.stringify(GET_FLOW_RESPONSE));
      });

      nativeMock.handler.mockImplementationOnce((_method, _params) => {
        return Promise.resolve(JSON.stringify(response2));
      });

      const flow1 = await adapty.getFlow('placement_one');
      const flow2 = await adapty.getFlow('placement_two');

      // Verify: different flow_id returned from native
      expect(flow1.id).toBe('flow_test_placement');
      expect(flow2.id).toBe('flow_placement_two');
      expect(flow1.name).toBe('test_placement');
      expect(flow2.name).toBe('placement_two');
      // Verify: placement.id reflects what was returned from native (developer_id)
      expect(flow1.placement.id).toBe('test_placement');
      expect(flow2.placement.id).toBe('placement_two');
    });

    it('should return flow with correct structure', async () => {
      const flow = await adapty.getFlow('structure_test');

      // Verify: request sent with correct placement_id
      const request = extractNativeRequest<
        components['requests']['GetFlow.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.placement_id).toBe('structure_test');

      // Check all required fields
      expect(flow.id).toBeDefined();
      expect(flow.name).toBeDefined();
      expect(flow.variationId).toBeDefined();
      expect(flow.responseCreatedAt).toBeDefined();

      // Check placement structure
      expect(flow.placement).toBeDefined();
      expect(flow.placement.id).toBe('test_placement');
      expect(flow.placement.abTestName).toBeDefined();
      expect(flow.placement.audienceName).toBeDefined();
      expect(flow.placement.revision).toBeDefined();
      expect(flow.placement.audienceVersionId).toBeDefined();

      // Check variations (flow-shape)
      expect(flow.variations).toBeDefined();
      expect(Array.isArray(flow.variations)).toBe(true);
      expect(flow.variations.length).toBeGreaterThan(0);

      // Check productIdentifiers on the first variation
      expect(flow.variations[0]!.productIdentifiers).toBeDefined();
      expect(Array.isArray(flow.variations[0]!.productIdentifiers)).toBe(true);
      expect(flow.variations[0]!.productIdentifiers.length).toBeGreaterThan(0);
    });
  });

  describe('API parameters smoke-test', () => {
    it('should accept all parameters without errors', async () => {
      // Test that method accepts all parameters (locale, fetchPolicy, loadTimeoutMs)
      const flow = await adapty.getFlow('test_placement', 'ru', {
        fetchPolicy: FetchPolicy.ReturnCacheDataIfNotExpiredElseLoad,
        maxAgeSeconds: 300,
        loadTimeoutMs: 3000,
      });

      // Verify: request contains parameters
      const request = extractNativeRequest<
        components['requests']['GetFlow.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.placement_id).toBe('test_placement');
      // locale is forwarded to native at runtime (not part of the typed wire shape)
      expect((request as { locale?: string }).locale).toBe('ru');
      // load_timeout is converted from ms to seconds (3000ms -> 3s)
      expect(request.load_timeout).toBe(3);

      // Verify method didn't crash and returns valid flow
      expect(flow).toBeDefined();
      expect(flow.id).toBe('flow_test_placement');
      expect(flow.placement.id).toBe('test_placement');
    });
  });

  describe('getFlowForDefaultAudience', () => {
    it('should send GetFlowForDefaultAudience.Request', async () => {
      const flow = await adapty.getFlowForDefaultAudience(
        'test_placement_default',
      );

      // Verify: GetFlowForDefaultAudience.Request sent
      expectNativeCall({
        nativeModule: nativeMock,
        method: 'get_flow_for_default_audience',
        expectedRequest: GET_FLOW_FOR_DEFAULT_AUDIENCE_REQUEST,
      });

      // Verify: response parsed to camelCase
      expect(flow).toBeDefined();
      expect(flow.id).toBe('flow_default_audience');
      expect(flow.name).toBe('test_placement_default');
      expect(flow.placement.id).toBe('test_placement_default');
      expect(flow.placement.audienceName).toBe('default_audience');
      expect(flow.variationId).toBe('default_variation_123');
    });

    it('should include locale when provided', async () => {
      await adapty.getFlowForDefaultAudience('test_placement_default', 'ru');

      const request = extractNativeRequest<
        components['requests']['GetFlowForDefaultAudience.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('get_flow_for_default_audience');
      expect(request.placement_id).toBe('test_placement_default');
      // locale is forwarded to native at runtime (not part of the typed wire shape)
      expect((request as { locale?: string }).locale).toBe('ru');
    });
  });

  describe('logShowFlow', () => {
    it('should log flow show event after getFlow', async () => {
      const flow = await adapty.getFlow('test_placement');
      nativeMock.handler.mockClear();

      // Should not throw
      await adapty.logShowFlow(flow);

      // Verify: LogShowFlow.Request sent
      const request = extractNativeRequest<
        components['requests']['LogShowFlow.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('log_show_flow');
      expect(request.flow.flow_id).toBeDefined();
      expect(request.flow.variation_id).toBeDefined();

      // Note: result is actually `true` (from obj.success in parseMethodResult),
      // not undefined, even though TypeScript signature is Promise<void>
      // This is expected behavior for Void type responses
    });
  });

  describe('Error handling', () => {
    it('should parse AdaptyError from GetFlow.Response', async () => {
      // Reset bridge and create mock with error response for get_flow
      resetBridge();
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        get_flow: GET_FLOW_RESPONSE_ERROR,
      });

      // Create new Adapty instance and activate
      adapty = new Adapty();
      await adapty.activate('test_api_key');

      // Execute: get flow should throw AdaptyError with adaptyCode
      await expect(
        adapty.getFlow('nonexistent_placement'),
      ).rejects.toMatchObject({
        adaptyCode: 2, // camelCase in JS (from native adapty_code)
      });
    });
  });
});
