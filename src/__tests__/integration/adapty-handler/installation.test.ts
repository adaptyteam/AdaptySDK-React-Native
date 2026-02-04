import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import {
  createNativeModuleMock,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_CURRENT_INSTALLATION_STATUS_REQUEST,
  GET_CURRENT_INSTALLATION_STATUS_RESPONSE_DETERMINED,
  GET_CURRENT_INSTALLATION_STATUS_RESPONSE_NOT_DETERMINED,
  GET_CURRENT_INSTALLATION_STATUS_RESPONSE_NOT_AVAILABLE,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Installation Status (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_current_installation_status:
        GET_CURRENT_INSTALLATION_STATUS_RESPONSE_DETERMINED,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('getCurrentInstallationStatus', () => {
    it('should send GetCurrentInstallationStatus.Request', async () => {
      await adapty.getCurrentInstallationStatus();

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'get_current_installation_status',
        expectedRequest: GET_CURRENT_INSTALLATION_STATUS_REQUEST,
      });
    });

    it('should return status "determined" with installation details', async () => {
      const status = await adapty.getCurrentInstallationStatus();

      expect(status.status).toBe('determined');
      if (status.status === 'determined') {
        expect(status.details.installId).toBe('install_abc123');
        expect(status.details.installTime).toBeInstanceOf(Date);
        expect(status.details.appLaunchCount).toBe(42);
        expect(status.details.payload).toBe('test_payload_data');
      }
    });

    it('should return status "not_determined" without details', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        get_current_installation_status:
          GET_CURRENT_INSTALLATION_STATUS_RESPONSE_NOT_DETERMINED,
      });

      resetBridge();
      adapty = new Adapty();
      await adapty.activate('test_api_key', { logLevel: 'error' });

      const status = await adapty.getCurrentInstallationStatus();

      expect(status.status).toBe('not_determined');
      expect(status).not.toHaveProperty('details');
    });

    it('should return status "not_available" without details', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        get_current_installation_status:
          GET_CURRENT_INSTALLATION_STATUS_RESPONSE_NOT_AVAILABLE,
      });

      resetBridge();
      adapty = new Adapty();
      await adapty.activate('test_api_key', { logLevel: 'error' });

      const status = await adapty.getCurrentInstallationStatus();

      expect(status.status).toBe('not_available');
      expect(status).not.toHaveProperty('details');
    });
  });
});
