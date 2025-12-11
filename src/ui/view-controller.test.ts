import { ViewController } from './view-controller';
import type { AdaptyPaywall } from '@/types';
import { $bridge } from '@/bridge';

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

jest.mock('@/coders/adapty-paywall');
jest.mock('@/coders/adapty-ui-dialog-config');

jest.mock('./view-emitter', () => {
  return {
    ViewEmitter: jest.fn().mockImplementation(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
    })),
  };
});

describe('ViewController', () => {
  const paywall: AdaptyPaywall = {
    id: 'pw-id',
    name: 'PW Name',
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
    paywallBuilder: undefined,
    payloadData: undefined,
    requestLocale: 'en',
    products: [],
    productIdentifiers: [],
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates native view and stores id (with defaults applied)', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({ encoded: true }),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock).mockResolvedValue({
        id: 'uuid-1',
      });

      const view = await ViewController.create(paywall, {} as any);

      expect($bridge.request).toHaveBeenCalledWith(
        'adapty_ui_create_paywall_view',
        expect.stringContaining('"method":"adapty_ui_create_paywall_view"'),
        'AdaptyUiView',
        expect.any(Object),
      );
      expect((view as any).id).toBe('uuid-1');
    });

    it('propagates bridge errors', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock).mockRejectedValue(
        new Error('boom'),
      );

      await expect(ViewController.create(paywall, {} as any)).rejects.toThrow(
        'boom',
      );
    });
  });

  describe('present', () => {
    it('calls bridge with id', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock)
        .mockResolvedValueOnce({ id: 'uuid-2' }) // create
        .mockResolvedValueOnce(undefined); // present

      const view = await ViewController.create(paywall, {} as any);
      await expect(view.present()).resolves.toBeUndefined();

      expect($bridge.request).toHaveBeenLastCalledWith(
        'adapty_ui_present_paywall_view',
        expect.stringContaining('"id":"uuid-2"'),
        'Void',
        expect.any(Object),
      );
    });

    it('throws if id is null', async () => {
      const viewProto = (ViewController as any).prototype;
      const fresh = Object.create(viewProto) as ViewController;
      (fresh as any).id = null;

      await expect(fresh.present()).rejects.toThrow('View reference not found');
    });
  });

  describe('dismiss', () => {
    it('calls bridge and unsubscribes listeners', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock)
        .mockResolvedValueOnce({ id: 'uuid-3' }) // create
        .mockResolvedValueOnce(undefined); // dismiss

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const removeAllListenersMock = jest.fn();
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener: jest.fn(),
        removeAllListeners: removeAllListenersMock,
      }));

      const view = await ViewController.create(paywall, {} as any);
      view.setEventHandlers({ onCloseButtonPress: () => true });

      await view.dismiss();

      expect($bridge.request).toHaveBeenLastCalledWith(
        'adapty_ui_dismiss_paywall_view',
        expect.stringContaining('"destroy":false'),
        'Void',
        expect.any(Object),
      );
      expect(removeAllListenersMock).toHaveBeenCalled();
    });

    it('throws if id is null', async () => {
      const viewProto = (ViewController as any).prototype;
      const fresh = Object.create(viewProto) as ViewController;
      (fresh as any).id = null;
      await expect(fresh.dismiss()).rejects.toThrow('View reference not found');
    });
  });

  describe('setEventHandlers', () => {
    it('registers provided handlers', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const addListener = jest.fn();
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener,
        removeAllListeners: jest.fn(),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock).mockResolvedValue({
        id: 'uuid-4',
      });

      const view = await ViewController.create(paywall, {} as any);

      // ViewEmitter is created during create() with DEFAULT_EVENT_HANDLERS
      expect(ViewEmitter).toHaveBeenCalledWith('uuid-4');

      const handler = jest.fn(() => true);
      const unsubscribe = view.setEventHandlers({
        onCloseButtonPress: handler,
      });
      expect(typeof unsubscribe).toBe('function');
      expect(addListener).toHaveBeenCalledWith(
        'onCloseButtonPress',
        handler,
        expect.any(Function),
      );
    });

    it('throws if called before create (no id)', () => {
      const viewProto = (ViewController as any).prototype;
      const fresh = Object.create(viewProto) as ViewController;
      (fresh as any).id = null;
      expect(() => fresh.setEventHandlers()).toThrow(
        'View reference not found',
      );
    });

    it('reuses same ViewEmitter and overrides handlers when called multiple times', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const addListener = jest.fn();
      const removeAllListeners = jest.fn();

      // Mock ViewEmitter instance BEFORE create
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener,
        removeAllListeners,
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock).mockResolvedValue({
        id: 'uuid-5',
      });

      const view = await ViewController.create(paywall, {} as any);

      // ViewEmitter created once during create()
      expect(ViewEmitter).toHaveBeenCalledTimes(1);
      expect(ViewEmitter).toHaveBeenCalledWith('uuid-5');

      // Clear for tracking subsequent calls
      (ViewEmitter as unknown as jest.Mock).mockClear();
      addListener.mockClear();

      const firstHandler = jest.fn(() => true);
      view.setEventHandlers({ onCloseButtonPress: firstHandler });

      // Should NOT have created new ViewEmitter
      expect(ViewEmitter).toHaveBeenCalledTimes(0);

      // Should have called addListener for the first handler
      expect(addListener).toHaveBeenCalledWith(
        'onCloseButtonPress',
        firstHandler,
        expect.any(Function),
      );

      // Clear addListener call count
      addListener.mockClear();

      const secondHandler = jest.fn(() => false);
      view.setEventHandlers({ onCloseButtonPress: secondHandler });

      // Should still NOT have created new ViewEmitter
      expect(ViewEmitter).toHaveBeenCalledTimes(0);

      // Should have called addListener for the second handler
      expect(addListener).toHaveBeenCalledWith(
        'onCloseButtonPress',
        secondHandler,
        expect.any(Function),
      );
    });

    it('replaces handler when same event is registered multiple times', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const handlers = new Map();
      const addListener = jest.fn((event, callback) => {
        // Simulate ViewEmitter behavior: replace existing handler
        handlers.set(event, callback);
      });
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener,
        removeAllListeners: jest.fn(),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock).mockResolvedValue({
        id: 'uuid-7',
      });

      const view = await ViewController.create(paywall, {} as any);

      // Clear handlers set during create
      handlers.clear();
      addListener.mockClear();

      const firstHandler = jest.fn(() => true);
      view.setEventHandlers({ onCloseButtonPress: firstHandler });

      const secondHandler = jest.fn(() => false);
      view.setEventHandlers({ onCloseButtonPress: secondHandler });

      const thirdHandler = jest.fn(() => true);
      view.setEventHandlers({ onCloseButtonPress: thirdHandler });

      // All three handlers should have been registered
      expect(addListener).toHaveBeenCalledTimes(3);

      // But only the last one should remain in the handlers map
      expect(handlers.get('onCloseButtonPress')).toBe(thirdHandler);
      expect(handlers.get('onCloseButtonPress')).not.toBe(firstHandler);
      expect(handlers.get('onCloseButtonPress')).not.toBe(secondHandler);

      // If we simulate calling the handler, only the third one should be called
      const currentHandler = handlers.get('onCloseButtonPress');
      currentHandler();

      expect(thirdHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).not.toHaveBeenCalled();
      expect(firstHandler).not.toHaveBeenCalled();
    });

    it('preserves default handlers when setting custom handlers for different events', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const handlers = new Map();
      const addListener = jest.fn((event, callback) => {
        // Simulate ViewEmitter behavior: store handlers in a map
        handlers.set(event, callback);
      });
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener,
        removeAllListeners: jest.fn(),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock).mockResolvedValue({
        id: 'uuid-8',
      });

      const view = await ViewController.create(paywall, {} as any);

      // After create, default handlers should be registered
      // (onCloseButtonPress, onAndroidSystemBack, onRestoreCompleted, onPurchaseCompleted, onUrlPress)
      expect(handlers.has('onCloseButtonPress')).toBe(true);
      expect(handlers.has('onAndroidSystemBack')).toBe(true);
      expect(handlers.has('onRestoreCompleted')).toBe(true);
      expect(handlers.has('onPurchaseCompleted')).toBe(true);
      expect(handlers.has('onUrlPress')).toBe(true);

      const defaultOnAndroidSystemBack = handlers.get('onAndroidSystemBack');
      const defaultOnRestoreCompleted = handlers.get('onRestoreCompleted');
      const defaultOnUrlPress = handlers.get('onUrlPress');

      // Now override only onCloseButtonPress
      const customCloseHandler = jest.fn(() => false);
      view.setEventHandlers({ onCloseButtonPress: customCloseHandler });

      // onCloseButtonPress should be replaced
      expect(handlers.get('onCloseButtonPress')).toBe(customCloseHandler);

      // But other default handlers should remain unchanged
      expect(handlers.get('onAndroidSystemBack')).toBe(
        defaultOnAndroidSystemBack,
      );
      expect(handlers.get('onRestoreCompleted')).toBe(
        defaultOnRestoreCompleted,
      );
      expect(handlers.get('onUrlPress')).toBe(defaultOnUrlPress);
      expect(handlers.has('onPurchaseCompleted')).toBe(true);
    });

    it('registers only provided handlers without merging defaults', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const addListener = jest.fn();
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener,
        removeAllListeners: jest.fn(),
      }));

      (jest.mocked(($bridge as any).request) as jest.Mock).mockResolvedValue({
        id: 'uuid-6',
      });

      const view = await ViewController.create(paywall, {} as any);

      // Clear mock call count from default handlers registration during create
      addListener.mockClear();

      const customHandler = jest.fn(() => false);
      view.setEventHandlers({
        onCloseButtonPress: customHandler,
      });

      // Should only call addListener for the provided handler
      expect(addListener).toHaveBeenCalledWith(
        'onCloseButtonPress',
        customHandler,
        expect.any(Function),
      );

      // Should NOT call addListener for default handlers (they were set during create)
      expect(addListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('showDialog', () => {
    it('encodes config and returns action', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));
      const { AdaptyUiDialogConfigCoder } = jest.requireMock(
        '@/coders/adapty-ui-dialog-config',
      );
      (AdaptyUiDialogConfigCoder as unknown as jest.Mock).mockImplementation(
        () => ({
          encode: jest.fn().mockReturnValue({ cfg: true }),
        }),
      );

      (jest.mocked(($bridge as any).request) as jest.Mock)
        .mockResolvedValueOnce({ id: 'uuid-5' }) // create
        .mockResolvedValueOnce('primary'); // showDialog result

      const view = await ViewController.create(paywall, {} as any);

      const result = await view.showDialog({
        primaryActionTitle: 'OK',
        content: 'Hi',
      });
      expect(result).toBe('primary');

      expect($bridge.request).toHaveBeenLastCalledWith(
        'adapty_ui_show_dialog',
        expect.stringContaining('"id":"uuid-5"'),
        'Void',
        expect.any(Object),
      );
    });

    it('throws if id is null', async () => {
      const viewProto = (ViewController as any).prototype;
      const fresh = Object.create(viewProto) as ViewController;
      (fresh as any).id = null;
      await expect(
        fresh.showDialog({ primaryActionTitle: 'OK' } as any),
      ).rejects.toThrow('View reference not found');
    });
  });
});
