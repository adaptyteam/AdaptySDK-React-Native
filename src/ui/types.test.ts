import { DEFAULT_FLOW_EVENT_HANDLERS } from './types';
import { $bridge } from '@/bridge';
import { Log } from '@/logger';

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

const requestMock = $bridge.request as unknown as jest.Mock;

// Lets a fire-and-forget `.catch(...)` settle before assertions.
const flushMicrotasks = () => new Promise(resolve => setImmediate(resolve));

describe('DEFAULT_FLOW_EVENT_HANDLERS — native-delegating defaults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    requestMock.mockResolvedValue(undefined);
  });

  describe('onUrlPress', () => {
    it('delegates to native adapty_ui_open_url with url and open_in', () => {
      const result = DEFAULT_FLOW_EVENT_HANDLERS.onUrlPress(
        'https://adapty.io',
        'browser_in_app',
      );

      expect(requestMock).toHaveBeenCalledTimes(1);
      const [method, body, resultType] = requestMock.mock.calls[0];
      expect(method).toBe('adapty_ui_open_url');
      expect(resultType).toBe('Void');
      expect(JSON.parse(body)).toEqual({
        method: 'adapty_ui_open_url',
        url: 'https://adapty.io',
        open_in: 'browser_in_app',
      });
      // Keeps the paywall view open
      expect(result).toBe(false);
    });

    it('keeps the view open and logs when the native call rejects', async () => {
      requestMock.mockRejectedValueOnce(new Error('boom'));
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {});

      const result = DEFAULT_FLOW_EVENT_HANDLERS.onUrlPress(
        'https://adapty.io',
        'browser_out_app',
      );
      expect(result).toBe(false);

      await flushMicrotasks();
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });

  describe('onRequestAppReview', () => {
    it('delegates to native adapty_ui_request_app_review', () => {
      const result = DEFAULT_FLOW_EVENT_HANDLERS.onRequestAppReview();

      expect(requestMock).toHaveBeenCalledTimes(1);
      const [method, body, resultType] = requestMock.mock.calls[0];
      expect(method).toBe('adapty_ui_request_app_review');
      expect(resultType).toBe('Void');
      expect(JSON.parse(body)).toEqual({
        method: 'adapty_ui_request_app_review',
      });
      // Keeps the paywall view open
      expect(result).toBe(false);
    });

    it('keeps the view open and logs when the native call rejects', async () => {
      requestMock.mockRejectedValueOnce(new Error('boom'));
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {});

      const result = DEFAULT_FLOW_EVENT_HANDLERS.onRequestAppReview();
      expect(result).toBe(false);

      await flushMicrotasks();
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });
});
