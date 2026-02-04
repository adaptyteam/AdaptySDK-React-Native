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
  IDENTIFY_REQUEST,
  IDENTIFY_RESPONSE_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_RESPONSE_SUCCESS,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - User Management (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      identify: IDENTIFY_RESPONSE_SUCCESS,
      logout: LOGOUT_RESPONSE_SUCCESS,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('identify', () => {
    it('should send Identify.Request with customer_user_id', async () => {
      await adapty.identify('user_12345');

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'identify',
        expectedRequest: IDENTIFY_REQUEST,
      });
    });

    it('should include iOS parameters when provided', async () => {
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

      expect(request.customer_user_id).toBe('user_12345');
      expect(request.parameters?.app_account_token).toBe('ios_token_abc');
    });
  });

  describe('logout', () => {
    it('should send Logout.Request', async () => {
      await adapty.logout();

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'logout',
        expectedRequest: LOGOUT_REQUEST,
      });
    });
  });
});
