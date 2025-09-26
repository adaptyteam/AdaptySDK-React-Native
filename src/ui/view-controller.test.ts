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

      const view = await ViewController.create(paywall, {} as any);

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const unsubscribeMock = jest.fn();
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener: jest.fn(),
        removeAllListeners: unsubscribeMock,
      }));
      view.registerEventHandlers({ onCloseButtonPress: () => true });

      await view.dismiss();

      expect($bridge.request).toHaveBeenLastCalledWith(
        'adapty_ui_dismiss_paywall_view',
        expect.stringContaining('"destroy":false'),
        'Void',
        expect.any(Object),
      );
      expect(unsubscribeMock).toHaveBeenCalled();
    });

    it('throws if id is null', async () => {
      const viewProto = (ViewController as any).prototype;
      const fresh = Object.create(viewProto) as ViewController;
      (fresh as any).id = null;
      await expect(fresh.dismiss()).rejects.toThrow('View reference not found');
    });
  });

  describe('registerEventHandlers', () => {
    it('merges defaults and subscribes per provided handlers', async () => {
      const { AdaptyPaywallCoder } = jest.requireMock(
        '@/coders/adapty-paywall',
      );
      (AdaptyPaywallCoder as unknown as jest.Mock).mockImplementation(() => ({
        encode: jest.fn().mockReturnValue({}),
      }));
      (jest.mocked(($bridge as any).request) as jest.Mock).mockResolvedValue({
        id: 'uuid-4',
      });

      const view = await ViewController.create(paywall, {} as any);

      const { ViewEmitter } = jest.requireMock('./view-emitter');
      const addListener = jest.fn();
      (ViewEmitter as unknown as jest.Mock).mockImplementation(() => ({
        addListener,
        removeAllListeners: jest.fn(),
      }));

      const handler = jest.fn(() => true);
      const unsubscribe = view.registerEventHandlers({
        onCloseButtonPress: handler,
      });
      expect(typeof unsubscribe).toBe('function');
      expect(ViewEmitter).toHaveBeenCalledWith('uuid-4');
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
      expect(() => fresh.registerEventHandlers()).toThrow(
        'View reference not found',
      );
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
