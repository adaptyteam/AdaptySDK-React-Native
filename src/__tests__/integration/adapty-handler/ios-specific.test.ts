import { Platform } from 'react-native';
import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  PRESENT_CODE_REDEMPTION_SHEET_REQUEST,
  PRESENT_CODE_REDEMPTION_SHEET_RESPONSE,
  UPDATE_COLLECTING_REFUND_DATA_CONSENT_REQUEST,
  UPDATE_COLLECTING_REFUND_DATA_CONSENT_RESPONSE_SUCCESS,
  UPDATE_REFUND_PREFERENCE_REQUEST,
  UPDATE_REFUND_PREFERENCE_RESPONSE_SUCCESS,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

// Save original values
const originalOS = Platform.OS;
const originalSelect = Platform.select;

describe('Adapty - iOS-specific methods (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  describe('iOS behavior', () => {
    beforeAll(() => {
      // Override for iOS tests
      Platform.OS = 'ios';
      Platform.select = jest.fn((obj: any) => obj.ios || obj.default);
    });

    afterAll(() => {
      // Restore original values
      Platform.OS = originalOS;
      Platform.select = originalSelect;
    });

    beforeEach(async () => {
      resetBridge();
      adapty = new Adapty();

      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        present_code_redemption_sheet: PRESENT_CODE_REDEMPTION_SHEET_RESPONSE,
        update_collecting_refund_data_consent:
          UPDATE_COLLECTING_REFUND_DATA_CONSENT_RESPONSE_SUCCESS,
        update_refund_preference: UPDATE_REFUND_PREFERENCE_RESPONSE_SUCCESS,
      });

      await adapty.activate('test_api_key', { logLevel: 'error' });
      nativeMock.handler.mockClear();
    });

    afterEach(() => {
      cleanupAdapty(adapty);
      resetNativeModuleMock(nativeMock);
      resetBridge();
    });

    it('presentCodeRedemptionSheet should call native on iOS', async () => {
      await adapty.presentCodeRedemptionSheet();

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'present_code_redemption_sheet',
        expectedRequest: PRESENT_CODE_REDEMPTION_SHEET_REQUEST,
      });
    });

    it('updateCollectingRefundDataConsent should call native on iOS', async () => {
      await adapty.updateCollectingRefundDataConsent(true);

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'update_collecting_refund_data_consent',
        expectedRequest: UPDATE_COLLECTING_REFUND_DATA_CONSENT_REQUEST,
      });
    });

    it('updateRefundPreference should call native on iOS', async () => {
      await adapty.updateRefundPreference('grant');

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'update_refund_preference',
        expectedRequest: UPDATE_REFUND_PREFERENCE_REQUEST,
      });
    });
  });

  describe('Android behavior for iOS-only methods', () => {
    beforeAll(() => {
      Platform.OS = 'android';
      Platform.select = jest.fn((obj: any) => obj.android || obj.default);
    });

    afterAll(() => {
      Platform.OS = originalOS;
      Platform.select = originalSelect;
    });

    beforeEach(async () => {
      resetBridge();
      adapty = new Adapty();

      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
      });

      await adapty.activate('test_api_key', { logLevel: 'error' });
      nativeMock.handler.mockClear();
    });

    afterEach(() => {
      cleanupAdapty(adapty);
      resetNativeModuleMock(nativeMock);
      resetBridge();
    });

    it('presentCodeRedemptionSheet should resolve immediately on Android', async () => {
      await adapty.presentCodeRedemptionSheet();

      // On Android there should be no native call
      expect(nativeMock.handler).not.toHaveBeenCalled();
    });

    it('updateCollectingRefundDataConsent should resolve immediately on Android', async () => {
      await adapty.updateCollectingRefundDataConsent(true);

      expect(nativeMock.handler).not.toHaveBeenCalled();
    });

    it('updateRefundPreference should resolve immediately on Android', async () => {
      await adapty.updateRefundPreference('grant');

      expect(nativeMock.handler).not.toHaveBeenCalled();
    });
  });
});
