import { OnboardingViewController } from './onboarding-view-controller';
import { AdaptyOnboarding } from '@/types';
import { $bridge } from '@/bridge';
import { AdaptyOnboardingCoder } from '@/coders/adapty-onboarding';
import { OnboardingViewEmitter } from './onboarding-view-emitter';

jest.mock('@/bridge', () => {
  const actual = jest.requireActual('@/bridge');
  return {
    ...actual,
    $bridge: {
      request: jest.fn(),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeAllEventListeners: jest.fn(),
    },
  };
});

jest.mock('@/coders/adapty-onboarding');

jest.mock('./onboarding-view-emitter', () => {
  return {
    OnboardingViewEmitter: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
    })),
  };
});

describe('OnboardingViewController', () => {
  const onboarding: AdaptyOnboarding = {
    id: 'onb-id',
    name: 'Onb Name',
    placement: {
      id: 'pl-id',
      name: 'pl-name',
      channel: 'paywall_builder',
      locale: 'en',
    },
    remoteConfig: undefined,
    variationId: 'var',
    version: 1,
    hasViewConfiguration: true,
    onboardingBuilder: undefined,
    payloadData: undefined,
    requestLocale: 'en',
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates native view and stores id', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({ encoded: true }) }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-1',
      });

      const view = await OnboardingViewController.create(onboarding, {});

      expect($bridge.request).toHaveBeenCalledWith(
        'adapty_ui_create_onboarding_view',
        expect.stringContaining('"method":"adapty_ui_create_onboarding_view"'),
        'AdaptyUiView',
        expect.any(Object),
      );
      expect($bridge.request).toHaveBeenCalledWith(
        'adapty_ui_create_onboarding_view',
        expect.stringContaining(
          '"external_urls_presentation":"browser_in_app"',
        ),
        'AdaptyUiView',
        expect.any(Object),
      );
      expect((view as any).id).toBe('uuid-1');
    });

    it('passes custom externalUrlsPresentation', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({ encoded: true }) }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-custom',
      });

      const view = await OnboardingViewController.create(onboarding, {
        externalUrlsPresentation: 'browser_out_app' as any,
      });

      expect($bridge.request).toHaveBeenCalledWith(
        'adapty_ui_create_onboarding_view',
        expect.stringContaining(
          '"external_urls_presentation":"browser_out_app"',
        ),
        'AdaptyUiView',
        expect.any(Object),
      );
    });

    it('propagates bridge errors', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockRejectedValue(
        new Error('boom'),
      );

      await expect(
        OnboardingViewController.create(onboarding, {}),
      ).rejects.toThrow('boom');
    });
  });

  describe('present', () => {
    it('calls bridge with id', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );
      (jest.mocked($bridge.request) as jest.Mock)
        .mockResolvedValueOnce({ id: 'uuid-2' }) // create
        .mockResolvedValueOnce(undefined); // present

      const view = await OnboardingViewController.create(onboarding, {});
      await expect(view.present()).resolves.toBeUndefined();

      expect($bridge.request).toHaveBeenLastCalledWith(
        'adapty_ui_present_onboarding_view',
        expect.stringContaining('"id":"uuid-2"'),
        'Void',
        expect.any(Object),
      );
    });

    it('throws if id is null', async () => {
      const view = (OnboardingViewController as any).prototype;
      const fresh = Object.create(view) as OnboardingViewController;
      (fresh as any).id = null;

      await expect(fresh.present()).rejects.toThrow('View reference not found');
    });
  });

  describe('dismiss', () => {
    it('calls bridge and unsubscribes listeners', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );
      (jest.mocked($bridge.request) as jest.Mock)
        .mockResolvedValueOnce({ id: 'uuid-3' }) // create
        .mockResolvedValueOnce(undefined); // dismiss

      const removeAllListenersMock = jest.fn();
      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener: jest.fn(),
          removeAllListeners: removeAllListenersMock,
        }),
      );

      const view = await OnboardingViewController.create(onboarding, {});
      view.setEventHandlers({ onClose: () => true });

      await view.dismiss();

      expect($bridge.request).toHaveBeenLastCalledWith(
        'adapty_ui_dismiss_onboarding_view',
        expect.stringContaining('"destroy":false'),
        'Void',
        expect.any(Object),
      );
      expect(removeAllListenersMock).toHaveBeenCalled();
    });

    it('throws if id is null', async () => {
      const view = (OnboardingViewController as any).prototype;
      const fresh = Object.create(view) as OnboardingViewController;
      (fresh as any).id = null;
      await expect(fresh.dismiss()).rejects.toThrow('View reference not found');
    });
  });

  describe('setEventHandlers', () => {
    it('registers provided handlers', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );

      const addListener = jest.fn();
      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener,
          removeAllListeners: jest.fn(),
        }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-4',
      });

      const view = await OnboardingViewController.create(onboarding, {});

      // OnboardingViewEmitter is created during create() with DEFAULT_ONBOARDING_EVENT_HANDLERS
      expect(OnboardingViewEmitter).toHaveBeenCalledWith('uuid-4');

      // Clear addListener calls from DEFAULT_ONBOARDING_EVENT_HANDLERS registration
      addListener.mockClear();

      const handler = jest.fn(() => true);
      const unsubscribe = view.setEventHandlers({ onClose: handler });
      expect(typeof unsubscribe).toBe('function');
      expect(addListener).toHaveBeenCalledWith(
        'onClose',
        handler,
        expect.any(Function),
      );
    });

    it('throws if called before create (no id)', () => {
      const view = (OnboardingViewController as any).prototype;
      const fresh = Object.create(view) as OnboardingViewController;
      (fresh as any).id = null;
      expect(() => fresh.setEventHandlers()).toThrow(
        'View reference not found',
      );
    });

    it('reuses same OnboardingViewEmitter and overrides handlers when called multiple times', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );

      const addListener = jest.fn();
      const removeAllListeners = jest.fn();

      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener,
          removeAllListeners,
        }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-5',
      });

      const view = await OnboardingViewController.create(onboarding, {});

      // OnboardingViewEmitter created once during create()
      expect(OnboardingViewEmitter).toHaveBeenCalledTimes(1);
      expect(OnboardingViewEmitter).toHaveBeenCalledWith('uuid-5');

      // Clear for tracking subsequent calls
      (OnboardingViewEmitter as unknown as jest.Mock).mockClear();
      addListener.mockClear();

      const firstHandler = jest.fn(() => true);
      view.setEventHandlers({ onClose: firstHandler });

      // Should NOT have created new OnboardingViewEmitter
      expect(OnboardingViewEmitter).toHaveBeenCalledTimes(0);

      // Should have called addListener for the first handler
      expect(addListener).toHaveBeenCalledWith(
        'onClose',
        firstHandler,
        expect.any(Function),
      );

      // Clear addListener call count
      addListener.mockClear();

      const secondHandler = jest.fn(() => false);
      view.setEventHandlers({ onClose: secondHandler });

      // Should still NOT have created new OnboardingViewEmitter
      expect(OnboardingViewEmitter).toHaveBeenCalledTimes(0);

      // Should have called addListener for the second handler
      expect(addListener).toHaveBeenCalledWith(
        'onClose',
        secondHandler,
        expect.any(Function),
      );
    });

    it('replaces handler when same event is registered multiple times', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );

      const handlers = new Map();
      const addListener = jest.fn((event, callback) => {
        handlers.set(event, callback);
      });
      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener,
          removeAllListeners: jest.fn(),
        }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-6',
      });

      const view = await OnboardingViewController.create(onboarding, {});

      handlers.clear();
      addListener.mockClear();

      const firstHandler = jest.fn(() => true);
      view.setEventHandlers({ onClose: firstHandler });

      const secondHandler = jest.fn(() => false);
      view.setEventHandlers({ onClose: secondHandler });

      const thirdHandler = jest.fn(() => true);
      view.setEventHandlers({ onClose: thirdHandler });

      expect(addListener).toHaveBeenCalledTimes(3);
      expect(handlers.get('onClose')).toBe(thirdHandler);
      expect(handlers.get('onClose')).not.toBe(firstHandler);
      expect(handlers.get('onClose')).not.toBe(secondHandler);

      const currentHandler = handlers.get('onClose');
      currentHandler();

      expect(thirdHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).not.toHaveBeenCalled();
      expect(firstHandler).not.toHaveBeenCalled();
    });

    it('preserves default handlers when setting custom handlers for different events', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );

      const handlers = new Map();
      const addListener = jest.fn((event, callback) => {
        handlers.set(event, callback);
      });
      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener,
          removeAllListeners: jest.fn(),
        }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-7',
      });

      const view = await OnboardingViewController.create(onboarding, {});

      expect(handlers.has('onClose')).toBe(true);
      const defaultOnClose = handlers.get('onClose');

      addListener.mockClear();

      const customCustomHandler = jest.fn();
      view.setEventHandlers({ onCustom: customCustomHandler });

      expect(handlers.get('onCustom')).toBe(customCustomHandler);
      expect(handlers.get('onClose')).toBe(defaultOnClose);
    });

    it('registers only provided handlers without merging defaults', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );

      const addListener = jest.fn();
      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener,
          removeAllListeners: jest.fn(),
        }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-8',
      });

      const view = await OnboardingViewController.create(onboarding, {});

      addListener.mockClear();

      const customHandler = jest.fn(() => false);
      view.setEventHandlers({ onClose: customHandler });

      expect(addListener).toHaveBeenCalledWith(
        'onClose',
        customHandler,
        expect.any(Function),
      );

      expect(addListener).toHaveBeenCalledTimes(1);
    });
  });
});
