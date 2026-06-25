import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_FLOW_RESPONSE,
  OPEN_WEB_PAYWALL_RESPONSE_SUCCESS,
  CREATE_WEB_PAYWALL_URL_RESPONSE,
} from '../shared/bridge-samples';
import { createMockProduct } from '../adapty-handler-mock-web/helpers.utils';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Web Paywall (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_flow: GET_FLOW_RESPONSE,
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
    it('should send OpenWebPaywall.Request with product', async () => {
      const product = createMockProduct();

      await adapty.openWebPaywall(product, 'browser_out_app');

      const request = extractNativeRequest<
        components['requests']['OpenWebPaywall.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('open_web_paywall');
      expect(request.open_in).toBe('browser_out_app');
      expect(request.product).toBeDefined();
      expect(request.product?.vendor_product_id).toBe('com.example.product');
      expect(request.paywall).toBeUndefined();
    });

    it('should send OpenWebPaywall.Request with paywall', async () => {
      const flow = await adapty.getFlow('test_placement');
      const paywall = flow.variations[0]!;
      nativeMock.handler.mockClear();

      await adapty.openWebPaywall(paywall, 'browser_in_app');

      const request = extractNativeRequest<
        components['requests']['OpenWebPaywall.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('open_web_paywall');
      expect(request.open_in).toBe('browser_in_app');
      expect(request.paywall).toBeDefined();
      expect(request.paywall?.paywall_id).toBe('paywall_test_placement');
      expect(request.product).toBeUndefined();
    });
  });

  describe('createWebPaywallUrl', () => {
    it('should send CreateWebPaywallUrl.Request with product and return URL', async () => {
      const product = createMockProduct();

      const url = await adapty.createWebPaywallUrl(product);

      const request = extractNativeRequest<
        components['requests']['CreateWebPaywallUrl.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('create_web_paywall_url');
      expect(request.product).toBeDefined();
      expect(request.product?.vendor_product_id).toBe('com.example.product');
      expect(request.paywall).toBeUndefined();
      expect(url).toBe('https://example.adapty.io/web-paywall-url');
    });

    it('should send CreateWebPaywallUrl.Request with paywall and return URL', async () => {
      const flow = await adapty.getFlow('test_placement');
      const paywall = flow.variations[0]!;
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
      expect(request.product).toBeUndefined();
      expect(url).toBe('https://example.adapty.io/web-paywall-url');
    });
  });
});
