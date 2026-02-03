import { Platform } from 'react-native';
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
  IDENTIFY_RESPONSE_SUCCESS,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

// Save original Platform values
const originalOS = Platform.OS;
const originalSelect = Platform.select;

describe('Adapty - Platform-Specific Parameters (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      identify: IDENTIFY_RESPONSE_SUCCESS,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('identify() - iOS parameters', () => {
    beforeAll(() => {
      Platform.OS = 'ios';
      Platform.select = jest.fn((obj: any) => obj.ios || obj.default);
    });

    afterAll(() => {
      Platform.OS = originalOS;
      Platform.select = originalSelect;
    });

    it('should encode ios.appAccountToken to app_account_token on iOS', async () => {
      await adapty.identify('user_12345', {
        ios: {
          appAccountToken: 'ios_token_abc',
        },
      });

      const request = extractNativeRequest<
        components['requests']['Identify.Request']
      >({
        nativeModule: nativeMock,
      });

      // Verify: iOS parameter encoded
      expect(request.customer_user_id).toBe('user_12345');
      expect(request.parameters?.app_account_token).toBe('ios_token_abc');

      // Verify: Android parameter NOT included
      expect(request.parameters?.obfuscated_account_id).toBeUndefined();
    });

    it('should NOT encode android.obfuscatedAccountId on iOS', async () => {
      await adapty.identify('user_12345', {
        android: {
          obfuscatedAccountId: 'android_account_xyz',
        },
      });

      const request = extractNativeRequest<
        components['requests']['Identify.Request']
      >({
        nativeModule: nativeMock,
      });

      // Verify: Android parameter NOT encoded on iOS
      expect(request.parameters?.obfuscated_account_id).toBeUndefined();
    });
  });

  describe('identify() - Android parameters', () => {
    beforeAll(() => {
      Platform.OS = 'android';
      Platform.select = jest.fn((obj: any) => obj.android || obj.default);
    });

    afterAll(() => {
      Platform.OS = originalOS;
      Platform.select = originalSelect;
    });

    it('should encode android.obfuscatedAccountId to obfuscated_account_id on Android', async () => {
      await adapty.identify('user_12345', {
        android: {
          obfuscatedAccountId: 'android_account_xyz',
        },
      });

      const request = extractNativeRequest<
        components['requests']['Identify.Request']
      >({
        nativeModule: nativeMock,
      });

      // Verify: Android parameter encoded
      expect(request.customer_user_id).toBe('user_12345');
      expect(request.parameters?.obfuscated_account_id).toBe(
        'android_account_xyz',
      );

      // Verify: iOS parameter NOT included
      expect(request.parameters?.app_account_token).toBeUndefined();
    });

    it('should NOT encode ios.appAccountToken on Android', async () => {
      await adapty.identify('user_12345', {
        ios: {
          appAccountToken: 'ios_token_abc',
        },
      });

      const request = extractNativeRequest<
        components['requests']['Identify.Request']
      >({
        nativeModule: nativeMock,
      });

      // Verify: iOS parameter NOT encoded on Android
      expect(request.parameters?.app_account_token).toBeUndefined();
    });
  });
});
