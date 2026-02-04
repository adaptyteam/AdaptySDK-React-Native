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
  RESTORE_PURCHASES_REQUEST,
  RESTORE_PURCHASES_RESPONSE_WITH_PREMIUM,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Restore Purchases (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      restore_purchases: RESTORE_PURCHASES_RESPONSE_WITH_PREMIUM,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  it('should send RestorePurchases.Request and return profile', async () => {
    const profile = await adapty.restorePurchases();

    expectNativeCall({
      nativeModule: nativeMock,
      method: 'restore_purchases',
      expectedRequest: RESTORE_PURCHASES_REQUEST,
    });

    // Verify response parsed to AdaptyProfile
    expect(profile.profileId).toBe('restored_profile_123');
    expect(profile.accessLevels?.['premium']).toBeDefined();
    expect(profile.accessLevels?.['premium']?.isActive).toBe(true);
  });
});
