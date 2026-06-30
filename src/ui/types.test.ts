import { DEFAULT_FLOW_EVENT_HANDLERS } from './types';
import { adapty } from '@/adapty-instance';
import { Log } from '@/logger';

// Lets a fire-and-forget `.catch(...)` settle before assertions.
const flushMicrotasks = () => new Promise(resolve => setImmediate(resolve));

describe('DEFAULT_FLOW_EVENT_HANDLERS — native-delegating defaults', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('onUrlPress', () => {
    it('delegates to adapty.openWebUrl with url and openIn', () => {
      const openWebUrl = jest
        .spyOn(adapty, 'openWebUrl')
        .mockResolvedValue(undefined);

      const result = DEFAULT_FLOW_EVENT_HANDLERS.onUrlPress(
        'https://adapty.io',
        'browser_in_app',
      );

      expect(openWebUrl).toHaveBeenCalledTimes(1);
      expect(openWebUrl).toHaveBeenCalledWith(
        'https://adapty.io',
        'browser_in_app',
      );
      // Keeps the flow view open
      expect(result).toBe(false);
    });

    it('keeps the view open and logs when openWebUrl rejects', async () => {
      jest.spyOn(adapty, 'openWebUrl').mockRejectedValueOnce(new Error('boom'));
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {});

      const result = DEFAULT_FLOW_EVENT_HANDLERS.onUrlPress(
        'https://adapty.io',
        'browser_out_app',
      );
      expect(result).toBe(false);

      await flushMicrotasks();
      expect(warnSpy).toHaveBeenCalled();
    });
  });

  describe('onRequestAppReview', () => {
    it('delegates to adapty.requestAppReview', () => {
      const requestAppReview = jest
        .spyOn(adapty, 'requestAppReview')
        .mockResolvedValue(undefined);

      const result = DEFAULT_FLOW_EVENT_HANDLERS.onRequestAppReview();

      expect(requestAppReview).toHaveBeenCalledTimes(1);
      // Keeps the flow view open
      expect(result).toBe(false);
    });

    it('keeps the view open and logs when requestAppReview rejects', async () => {
      jest
        .spyOn(adapty, 'requestAppReview')
        .mockRejectedValueOnce(new Error('boom'));
      const warnSpy = jest.spyOn(Log, 'warn').mockImplementation(() => {});

      const result = DEFAULT_FLOW_EVENT_HANDLERS.onRequestAppReview();
      expect(result).toBe(false);

      await flushMicrotasks();
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
