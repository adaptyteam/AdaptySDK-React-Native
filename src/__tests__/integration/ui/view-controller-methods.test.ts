import { resetBridge } from '@/bridge';
import { createPaywallView } from '@/ui/create-paywall-view';
import type { components } from '@/types/api';
import type { AdaptyPaywall } from '@/types';
import {
  createNativeModuleMock,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PAYWALL_RESPONSE,
  ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_PRESENT_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_DISMISS_PAYWALL_VIEW_RESPONSE,
  ADAPTY_UI_SHOW_DIALOG_RESPONSE_PRIMARY,
} from '../shared/bridge-samples';
import { Adapty } from '@/adapty-handler';
import { cleanupAdapty } from '../adapty-handler/setup.utils';

/**
 * Integration tests for ViewController methods (Paywall UI)
 *
 * Tests verify bridge communication for UI methods:
 * - Request encoding (camelCase → snake_case)
 * - Response parsing (snake_case → camelCase)
 * - Parameter handling (prefetchProducts, loadTimeoutMs, iOS styles)
 *
 * Note: Event handling tests are separate in paywall/events/
 */
describe('ViewController Methods (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;
  let paywall: AdaptyPaywall;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_paywall: GET_PAYWALL_RESPONSE,
      adapty_ui_create_paywall_view: ADAPTY_UI_CREATE_PAYWALL_VIEW_RESPONSE,
      adapty_ui_present_paywall_view: ADAPTY_UI_PRESENT_PAYWALL_VIEW_RESPONSE,
      adapty_ui_dismiss_paywall_view: ADAPTY_UI_DISMISS_PAYWALL_VIEW_RESPONSE,
      adapty_ui_show_dialog: ADAPTY_UI_SHOW_DIALOG_RESPONSE_PRIMARY,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    paywall = await adapty.getPaywall('test_placement');
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('createPaywallView', () => {
    it('should send AdaptyUICreatePaywallView.Request with default parameters', async () => {
      const view = await createPaywallView(paywall);

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreatePaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_create_paywall_view');
      expect(request.paywall).toBeDefined();
      expect(request.paywall.paywall_id).toBe('paywall_test_placement');
      expect(request.paywall.variation_id).toBe('variation_123');
      expect(request.preload_products).toBe(true); // default
      expect(request.load_timeout).toBe(5); // 5000ms → 5s

      // Verify response parsing
      expect((view as any).id).toBe('mock_paywall_view_123');
    });

    it('should encode custom parameters', async () => {
      await createPaywallView(paywall, {
        prefetchProducts: false,
        loadTimeoutMs: 3000,
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreatePaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.preload_products).toBe(false);
      expect(request.load_timeout).toBe(3); // 3000ms → 3s
    });
  });

  describe('present', () => {
    it('should send request with default full_screen presentation style', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.present();

      const request = extractNativeRequest<
        components['requests']['AdaptyUIPresentPaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_present_paywall_view');
      expect(request.id).toBe('mock_paywall_view_123');
      expect(request.ios_presentation_style).toBe('full_screen');
    });

    it('should encode page_sheet presentation style', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.present({ iosPresentationStyle: 'page_sheet' });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIPresentPaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.ios_presentation_style).toBe('page_sheet');
    });
  });

  describe('dismiss', () => {
    it('should send AdaptyUIDismissPaywallView.Request', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.dismiss();

      const request = extractNativeRequest<
        components['requests']['AdaptyUIDismissPaywallView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_dismiss_paywall_view');
      expect(request.id).toBe('mock_paywall_view_123');
      expect(request.destroy).toBe(false);
    });
  });

  describe('showDialog', () => {
    it('should encode dialog configuration correctly', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      const result = await view.showDialog({
        title: 'Confirm Action',
        content: 'Are you sure?',
        primaryActionTitle: 'Yes',
        secondaryActionTitle: 'No',
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIShowDialog.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_show_dialog');
      expect(request.id).toBe('mock_paywall_view_123');
      expect(request.configuration.title).toBe('Confirm Action');
      expect(request.configuration.content).toBe('Are you sure?');
      expect(request.configuration.default_action_title).toBe('Yes');
      expect(request.configuration.secondary_action_title).toBe('No');

      // Verify response parsing
      expect(result).toBe('primary');
    });

    it('should handle dialog with only primary action', async () => {
      const view = await createPaywallView(paywall);
      nativeMock.handler.mockClear();

      await view.showDialog({
        title: 'Alert',
        content: 'This is an alert',
        primaryActionTitle: 'OK',
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIShowDialog.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.configuration.secondary_action_title).toBeUndefined();
    });
  });
});
