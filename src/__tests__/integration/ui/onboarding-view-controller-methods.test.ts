import { resetBridge } from '@/bridge';
import { createOnboardingView } from '@/ui/create-onboarding-view';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import type { components } from '@/types/api';
import type { AdaptyOnboarding } from '@/types';
import {
  createNativeModuleMock,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_ONBOARDING_RESPONSE,
  ADAPTY_UI_CREATE_ONBOARDING_VIEW_RESPONSE,
  ADAPTY_UI_PRESENT_ONBOARDING_VIEW_RESPONSE,
  ADAPTY_UI_DISMISS_ONBOARDING_VIEW_RESPONSE,
} from '../shared/bridge-samples';
import { Adapty } from '@/adapty-handler';
import { cleanupAdapty } from '../adapty-handler/setup.utils';

/**
 * Integration tests for OnboardingViewController methods
 *
 * Tests verify bridge communication for onboarding UI methods:
 * - Request encoding (camelCase → snake_case)
 * - Response parsing (snake_case → camelCase)
 * - Parameter handling (externalUrlsPresentation, iOS styles)
 *
 * Note: Event handling tests are separate in onboarding/events/
 */
describe('OnboardingViewController Methods (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;
  let onboarding: AdaptyOnboarding;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_onboarding: GET_ONBOARDING_RESPONSE,
      adapty_ui_create_onboarding_view: ADAPTY_UI_CREATE_ONBOARDING_VIEW_RESPONSE,
      adapty_ui_present_onboarding_view: ADAPTY_UI_PRESENT_ONBOARDING_VIEW_RESPONSE,
      adapty_ui_dismiss_onboarding_view: ADAPTY_UI_DISMISS_ONBOARDING_VIEW_RESPONSE,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    onboarding = await adapty.getOnboarding('test_onboarding_placement');
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('createOnboardingView', () => {
    it('should send AdaptyUICreateOnboardingView.Request with default parameters', async () => {
      const view = await createOnboardingView(onboarding);

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreateOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_create_onboarding_view');
      expect(request.onboarding).toBeDefined();
      expect(request.onboarding.onboarding_id).toBe('onboarding_123');
      expect(request.onboarding.variation_id).toBe('onboarding_variation_456');
      expect(request.external_urls_presentation).toBe('browser_in_app'); // default

      // Verify response parsing
      expect((view as any).id).toBe('mock_onboarding_view_789');
    });

    it('should encode custom externalUrlsPresentation', async () => {
      const view = await createOnboardingView(onboarding, {
        externalUrlsPresentation: 'browser_out_app',
      });

      const request = extractNativeRequest<
        components['requests']['AdaptyUICreateOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.external_urls_presentation).toBe('browser_out_app');
    });
  });

  describe('present', () => {
    it('should send AdaptyUIPresentOnboardingView.Request', async () => {
      const view = await createOnboardingView(onboarding);
      nativeMock.handler.mockClear();

      await view.present({ iosPresentationStyle: 'page_sheet' });

      const request = extractNativeRequest<
        components['requests']['AdaptyUIPresentOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_present_onboarding_view');
      expect(request.id).toBe('mock_onboarding_view_789');
      expect(request.ios_presentation_style).toBe('page_sheet');
    });
  });

  describe('dismiss', () => {
    it('should send AdaptyUIDismissOnboardingView.Request', async () => {
      const view = await createOnboardingView(onboarding);
      nativeMock.handler.mockClear();

      await view.dismiss();

      const request = extractNativeRequest<
        components['requests']['AdaptyUIDismissOnboardingView.Request']
      >({
        nativeModule: nativeMock
      });

      expect(request.method).toBe('adapty_ui_dismiss_onboarding_view');
      expect(request.id).toBe('mock_onboarding_view_789');
      expect(request.destroy).toBe(false);
    });
  });
});
