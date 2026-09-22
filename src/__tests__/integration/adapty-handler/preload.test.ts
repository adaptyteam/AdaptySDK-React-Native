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
  ACTIVATE_RESPONSE_SUCCESS,
  PRELOAD_FLOWS_REQUEST,
  PRELOAD_FLOWS_RESPONSE,
  PRELOAD_FLOWS_FOR_DEFAULT_AUDIENCE_REQUEST,
  PRELOAD_FLOWS_FOR_DEFAULT_AUDIENCE_RESPONSE,
  PRELOAD_FLOWS_RESPONSE_ERROR,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

/**
 * Integration tests for placement preload operations
 *
 * Tests verify:
 * 1. PreloadFlows request format, including the ms -> s timeout conversion
 * 2. PreloadFlowsForDefaultAudience request format, which carries no timeout
 * 3. Error propagation from an aggregated native failure
 */
describe('Adapty - Placement preload (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      preload_flows: PRELOAD_FLOWS_RESPONSE,
      preload_flows_for_default_audience:
        PRELOAD_FLOWS_FOR_DEFAULT_AUDIENCE_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('preloadFlows', () => {
    it('should send PreloadFlows.Request with the default timeout', async () => {
      await adapty.preloadFlows([
        'test_flow_placement',
        'other_flow_placement',
      ]);

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'preload_flows',
        expectedRequest: PRELOAD_FLOWS_REQUEST,
      });
    });

    it('should convert loadTimeoutMs to seconds', async () => {
      await adapty.preloadFlows(['test_flow_placement'], {
        loadTimeoutMs: 3000,
      });

      const request = extractNativeRequest<
        components['requests']['PreloadFlows.Request']
      >({
        nativeModule: nativeMock,
      });

      // load_timeout is converted from ms to seconds (3000ms -> 3s)
      expect(request.load_timeout).toBe(3);
      expect(request.placement_ids).toEqual(['test_flow_placement']);
    });

    // The empty list still reaches the bridge: it is the native side that
    // returns without a request, not this layer.
    it('should forward an empty placement list to the bridge', async () => {
      await adapty.preloadFlows([]);

      const request = extractNativeRequest<
        components['requests']['PreloadFlows.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.placement_ids).toEqual([]);
    });
  });

  describe('preloadFlowsForDefaultAudience', () => {
    it('should send PreloadFlowsForDefaultAudience.Request', async () => {
      await adapty.preloadFlowsForDefaultAudience(['test_flow_placement']);

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'preload_flows_for_default_audience',
        expectedRequest: PRELOAD_FLOWS_FOR_DEFAULT_AUDIENCE_REQUEST,
      });

      const request = extractNativeRequest<
        components['requests']['PreloadFlowsForDefaultAudience.Request']
      >({
        nativeModule: nativeMock,
      });

      // The schema has no timeout for the default audience variant
      expect(request).not.toHaveProperty('load_timeout');
    });
  });

  describe('Activation gating', () => {
    // preload_flows is deliberately absent from nonWaitingMethods: both native
    // SDKs route it through withActivatedSDK and fail with notActivated (2002)
    // until activate resolves.
    it('should hold preloadFlows until an in-flight activate resolves', async () => {
      resetBridge();

      let releaseActivate: () => void = () => {};
      const activateGate = new Promise<void>(resolve => {
        releaseActivate = resolve;
      });

      const gatedMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        preload_flows: PRELOAD_FLOWS_RESPONSE,
      });

      const respond = gatedMock.handler.getMockImplementation()!;
      gatedMock.handler.mockImplementation(async (method, params) => {
        if (method === 'activate') {
          await activateGate;
        }
        return respond(method, params);
      });

      const flush = () => new Promise(resolve => setImmediate(resolve));
      const calledPreload = () =>
        gatedMock.handler.mock.calls.some(
          ([method]) => method === 'preload_flows',
        );

      const gatedAdapty = new Adapty();
      const activation = gatedAdapty.activate('test_api_key', {
        logLevel: 'error',
      });
      await flush();

      const preload = gatedAdapty.preloadFlows(['test_flow_placement']);
      await flush();

      expect(calledPreload()).toBe(false);

      releaseActivate();
      await activation;
      await preload;

      expect(calledPreload()).toBe(true);

      cleanupAdapty(gatedAdapty);
      resetNativeModuleMock(gatedMock);
    });
  });

  describe('Error handling', () => {
    it('should parse the aggregated AdaptyError from PreloadFlows.Response', async () => {
      resetBridge();
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        preload_flows: PRELOAD_FLOWS_RESPONSE_ERROR,
      });

      adapty = new Adapty();
      await adapty.activate('test_api_key');

      await expect(
        adapty.preloadFlows(['test_flow_placement']),
      ).rejects.toMatchObject({
        adaptyCode: 2005,
      });
    });
  });
});
