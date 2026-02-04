import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PAYWALL_RESPONSE,
  OPEN_WEB_PAYWALL_RESPONSE_SUCCESS,
  CREATE_WEB_PAYWALL_URL_RESPONSE,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Web Paywall (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_paywall: GET_PAYWALL_RESPONSE,
      open_web_paywall: OPEN_WEB_PAYWALL_RESPONSE_SUCCESS,
      create_web_paywall_url: CREATE_WEB_PAYWALL_URL_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('openWebPaywall', () => {
    it('should send OpenWebPaywall.Request with paywall', async () => {
      // First, get a paywall
      const paywall = await adapty.getPaywall('test_placement');
      nativeMock.handler.mockClear();

      await adapty.openWebPaywall(paywall, 'browser_out_app');

      const request = extractNativeRequest<
        components['requests']['OpenWebPaywall.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('open_web_paywall');
      expect(request.open_in).toBe('browser_out_app');
      expect(request.paywall).toBeDefined();
      expect(request.paywall?.paywall_id).toBe('paywall_test_placement');
    });
  });

  describe('createWebPaywallUrl', () => {
    it('should send CreateWebPaywallUrl.Request and return URL', async () => {
      // First, get a paywall
      const paywall = await adapty.getPaywall('test_placement');
      nativeMock.handler.mockClear();

      const url = await adapty.createWebPaywallUrl(paywall);

      const request = extractNativeRequest<
        components['requests']['CreateWebPaywallUrl.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('create_web_paywall_url');
      expect(request.paywall).toBeDefined();
      expect(request.paywall?.paywall_id).toBe('paywall_test_placement');
      expect(url).toBe('https://example.adapty.io/web-paywall-url');
    });
  });
});
