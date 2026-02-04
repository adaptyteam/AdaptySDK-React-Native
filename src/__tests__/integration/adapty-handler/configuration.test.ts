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
  SET_LOG_LEVEL_REQUEST,
  SET_LOG_LEVEL_RESPONSE,
  SET_FALLBACK_RESPONSE_SUCCESS,
  SET_INTEGRATION_IDENTIFIER_RESPONSE_SUCCESS,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Configuration (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      set_log_level: SET_LOG_LEVEL_RESPONSE,
      set_fallback: SET_FALLBACK_RESPONSE_SUCCESS,
      set_integration_identifiers: SET_INTEGRATION_IDENTIFIER_RESPONSE_SUCCESS,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('setLogLevel', () => {
    it('should send SetLogLevel.Request with log level', async () => {
      await adapty.setLogLevel('error');

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'set_log_level',
        expectedRequest: SET_LOG_LEVEL_REQUEST,
      });
    });
  });

  describe('setFallback', () => {
    it('should send SetFallback.Request with iOS fileName', async () => {
      await adapty.setFallback({
        ios: { fileName: 'fallback_asset_123' },
        android: { rawResName: 'fallback_asset_123' },
      });

      const request = extractNativeRequest<
        components['requests']['SetFallback.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('set_fallback');
      // On iOS, it should use asset_id
      expect(request.asset_id || request.path).toBeDefined();
    });
  });

  describe('setIntegrationIdentifier', () => {
    it('should send SetIntegrationIdentifier.Request with key-value pair', async () => {
      await adapty.setIntegrationIdentifier(
        'appmetrica_device_id',
        'device_123',
      );

      const request = extractNativeRequest<
        components['requests']['SetIntegrationIdentifier.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('set_integration_identifiers');
      expect(request.key_values).toEqual({
        appmetrica_device_id: 'device_123',
      });
    });
  });
});
