import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_ONBOARDING_RESPONSE,
} from './bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Onboarding (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_onboarding: GET_ONBOARDING_RESPONSE,
      get_onboarding_for_default_audience: GET_ONBOARDING_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('getOnboarding', () => {
    it('should send correct GetOnboarding.Request', async () => {
      const onboarding = await adapty.getOnboarding('test_onboarding_placement');

      const request = extractNativeRequest<
        components['requests']['GetOnboarding.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('get_onboarding');
      expect(request.placement_id).toBe('test_onboarding_placement');
      expect(request.load_timeout).toBe(5);
      expect(request.fetch_policy.type).toBe('reload_revalidating_cache_data');

      // Verify response parsing
      expect(onboarding.id).toBeDefined();
      expect(onboarding.name).toBe('test_onboarding_placement');
      expect(onboarding.variationId).toBe('onboarding_variation_456');
    });

    it('should include locale in request when provided', async () => {
      await adapty.getOnboarding('test_placement', 'ru');

      const request = extractNativeRequest<
        components['requests']['GetOnboarding.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.locale).toBe('ru');
    });
  });

  describe('getOnboardingForDefaultAudience', () => {
    it('should send correct GetOnboardingForDefaultAudience.Request', async () => {
      const onboarding = await adapty.getOnboardingForDefaultAudience(
        'test_onboarding_placement',
      );

      const request = extractNativeRequest<
        components['requests']['GetOnboardingForDefaultAudience.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('get_onboarding_for_default_audience');
      expect(request.placement_id).toBe('test_onboarding_placement');
      expect(request.fetch_policy.type).toBe('reload_revalidating_cache_data');
    });
  });
});
