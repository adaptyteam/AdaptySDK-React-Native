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

      const view = await OnboardingViewController.create(onboarding);

      expect($bridge.request).toHaveBeenCalledWith(
        'adapty_ui_create_onboarding_view',
        expect.stringContaining('"method":"adapty_ui_create_onboarding_view"'),
        'AdaptyUiView',
        expect.any(Object),
      );
      expect((view as any).id).toBe('uuid-1');
    });

    it('propagates bridge errors', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );

      (jest.mocked($bridge.request) as jest.Mock).mockRejectedValue(
        new Error('boom'),
      );

      await expect(OnboardingViewController.create(onboarding)).rejects.toThrow(
        'boom',
      );
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

      const view = await OnboardingViewController.create(onboarding);
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

      const view = await OnboardingViewController.create(onboarding);

      // register handlers to set unsubscribeAllListeners
      const unsubscribeMock = jest.fn();
      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener: jest.fn(),
          removeAllListeners: unsubscribeMock,
        }),
      );
      view.setEventHandlers({ onClose: () => true });

      await view.dismiss();

      expect($bridge.request).toHaveBeenLastCalledWith(
        'adapty_ui_dismiss_onboarding_view',
        expect.stringContaining('"destroy":false'),
        'Void',
        expect.any(Object),
      );
      expect(unsubscribeMock).toHaveBeenCalled();
    });

    it('throws if id is null', async () => {
      const view = (OnboardingViewController as any).prototype;
      const fresh = Object.create(view) as OnboardingViewController;
      (fresh as any).id = null;
      await expect(fresh.dismiss()).rejects.toThrow('View reference not found');
    });
  });

  describe('setEventHandlers', () => {
    it('merges defaults and subscribes per provided handlers', async () => {
      (AdaptyOnboardingCoder as unknown as jest.Mock).mockImplementation(
        () => ({ encode: jest.fn().mockReturnValue({}) }),
      );
      (jest.mocked($bridge.request) as jest.Mock).mockResolvedValue({
        id: 'uuid-4',
      });

      const view = await OnboardingViewController.create(onboarding);

      const addListener = jest.fn();
      (OnboardingViewEmitter as unknown as jest.Mock).mockImplementation(
        () => ({
          addListener,
          removeAllListeners: jest.fn(),
        }),
      );

      const handler = jest.fn(() => true);
      const unsubscribe = view.setEventHandlers({ onClose: handler });
      expect(typeof unsubscribe).toBe('function');
      expect(OnboardingViewEmitter).toHaveBeenCalledWith('uuid-4');
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
  });
});
