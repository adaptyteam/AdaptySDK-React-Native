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
  ADAPTY_UI_OPEN_URL_RESPONSE_SUCCESS,
  ADAPTY_UI_REQUEST_APP_REVIEW_RESPONSE_SUCCESS,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Flow native actions (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      adapty_ui_open_url: ADAPTY_UI_OPEN_URL_RESPONSE_SUCCESS,
      adapty_ui_request_app_review: ADAPTY_UI_REQUEST_APP_REVIEW_RESPONSE_SUCCESS,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('openWebUrl', () => {
    it('should send AdaptyUIOpenUrl.Request with url and open_in', async () => {
      await adapty.openWebUrl('https://adapty.io', 'browser_in_app');

      const request = extractNativeRequest<
        components['requests']['AdaptyUIOpenUrl.Request']
      >({ nativeModule: nativeMock });

      expect(request.method).toBe('adapty_ui_open_url');
      expect(request.url).toBe('https://adapty.io');
      expect(request.open_in).toBe('browser_in_app');
    });

    it('should omit open_in when openIn is not provided', async () => {
      await adapty.openWebUrl('https://adapty.io');

      const request = extractNativeRequest<
        components['requests']['AdaptyUIOpenUrl.Request']
      >({ nativeModule: nativeMock });

      expect(request.method).toBe('adapty_ui_open_url');
      expect(request.url).toBe('https://adapty.io');
      expect(request.open_in).toBeUndefined();
    });
  });

  describe('requestAppReview', () => {
    it('should send AdaptyUIRequestAppReview.Request', async () => {
      await adapty.requestAppReview();

      const request = extractNativeRequest<
        components['requests']['AdaptyUIRequestAppReview.Request']
      >({ nativeModule: nativeMock });

      expect(request.method).toBe('adapty_ui_request_app_review');
    });
  });
});
