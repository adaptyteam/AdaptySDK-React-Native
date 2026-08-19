import type { EmitterSubscription } from 'react-native';
import { BridgeEventEmitter } from '@/bridge-event-emitter';
import { $bridge } from '@/bridge';
import { Log } from '@/logger';

jest.mock('@/bridge', () => ({
  $bridge: { addEventListener: jest.fn() },
}));

const addEventListener = $bridge.addEventListener as jest.Mock;

describe('BridgeEventEmitter', () => {
  let remove: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    remove = jest.fn();
    addEventListener.mockReturnValue({
      remove,
    } as unknown as EmitterSubscription);
  });

  /** The promoted-purchase configuration, which is the only live one. */
  function makeEmitter(
    fallback?: (payload: string) => Promise<unknown> | void,
  ): BridgeEventEmitter<string> {
    return new BridgeEventEmitter<string>(
      'did_receive_promoted_purchase',
      'onPromotedPurchaseReceived',
      fallback,
    );
  }

  /**
   * Starts observing and returns the callback the emitter handed the bridge, so
   * a test can drive it the way native would, without a real emitter.
   */
  function observe<Payload>(
    emitter: BridgeEventEmitter<Payload>,
  ): (payload: Payload) => void {
    emitter.startObserving();
    const lastCall = addEventListener.mock.calls.at(-1);
    return lastCall![1] as (payload: Payload) => void;
  }

  describe('startObserving', () => {
    it('subscribes to the event id it was given', () => {
      makeEmitter().startObserving();

      expect(addEventListener).toHaveBeenCalledTimes(1);
      expect(addEventListener.mock.calls[0]![0]).toBe(
        'did_receive_promoted_purchase',
      );
    });

    it('is idempotent, so repeated activation does not double-subscribe', () => {
      const emitter = makeEmitter();

      emitter.startObserving();
      emitter.startObserving();
      emitter.startObserving();

      expect(addEventListener).toHaveBeenCalledTimes(1);
      expect(remove).not.toHaveBeenCalled();
    });
  });

  describe('fallback', () => {
    it('runs when no handler is registered', () => {
      const fallback = jest.fn();

      observe(makeEmitter(fallback))('payload');

      expect(fallback).toHaveBeenCalledWith('payload');
    });

    it('does not run while a handler is registered', () => {
      const fallback = jest.fn();
      const emitter = makeEmitter(fallback);
      const emit = observe(emitter);
      emitter.addListener(() => {});

      emit('payload');

      expect(fallback).not.toHaveBeenCalled();
    });

    it('is optional - an event with no fallback dispatches nothing', () => {
      const emitter = new BridgeEventEmitter<string>(
        'did_load_latest_profile',
        'onLatestProfileLoad',
      );

      expect(() => observe(emitter)('payload')).not.toThrow();
    });

    it('survives a fallback that throws synchronously', () => {
      const fallback = jest.fn(() => {
        throw new Error('sync boom');
      });

      expect(() => observe(makeEmitter(fallback))('payload')).not.toThrow();
    });

    it('logs a rejecting fallback under the log scope instead of letting it escape', async () => {
      const warn = jest.spyOn(Log, 'warn').mockImplementation(() => {});
      const fallback = jest.fn().mockRejectedValue(new Error('nope'));
      const rejections: unknown[] = [];
      const onRejection = (reason: unknown) => rejections.push(reason);
      process.on('unhandledRejection', onRejection);

      try {
        observe(makeEmitter(fallback))('payload');
        await new Promise(resolve => setImmediate(resolve));

        expect(rejections).toHaveLength(0);
        expect(warn.mock.calls[0]![0]).toBe('onPromotedPurchaseReceived');
        expect(warn.mock.calls[0]![1]()).toBe('Fallback threw: Error: nope');
      } finally {
        process.removeListener('unhandledRejection', onRejection);
        warn.mockRestore();
      }
    });
  });

  describe('addListener', () => {
    it('dispatches the payload to every registered handler', () => {
      const emitter = makeEmitter(jest.fn());
      const emit = observe(emitter);
      const first: string[] = [];
      const second: string[] = [];
      emitter.addListener(p => {
        first.push(p);
      });
      emitter.addListener(p => {
        second.push(p);
      });

      emit('payload');

      expect(first).toStrictEqual(['payload']);
      expect(second).toStrictEqual(['payload']);
    });

    it('keeps dispatching when a handler throws synchronously', () => {
      const emitter = makeEmitter(jest.fn());
      const emit = observe(emitter);
      const reached: string[] = [];
      emitter.addListener(() => {
        throw new Error('sync boom');
      });
      emitter.addListener(p => {
        reached.push(p);
      });

      emit('payload');

      expect(reached).toStrictEqual(['payload']);
    });

    it('logs a rejecting async handler under the log scope instead of letting it escape', async () => {
      const warn = jest.spyOn(Log, 'warn').mockImplementation(() => {});
      const emitter = makeEmitter(jest.fn());
      const emit = observe(emitter);
      const rejections: unknown[] = [];
      const onRejection = (reason: unknown) => rejections.push(reason);
      process.on('unhandledRejection', onRejection);

      try {
        emitter.addListener(async () => {
          throw new Error('async boom');
        });
        emit('payload');
        await new Promise(resolve => setImmediate(resolve));

        expect(rejections).toHaveLength(0);
        expect(warn.mock.calls[0]![0]).toBe('onPromotedPurchaseReceived');
        expect(warn.mock.calls[0]![1]()).toBe(
          'Handler threw: Error: async boom',
        );
      } finally {
        process.removeListener('unhandledRejection', onRejection);
        warn.mockRestore();
      }
    });

    it('logs nothing when a handler returns normally', () => {
      const warn = jest.spyOn(Log, 'warn').mockImplementation(() => {});
      const emitter = makeEmitter(jest.fn());
      const emit = observe(emitter);
      emitter.addListener(() => {});

      emit('payload');

      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });

    it('gives each registration its own removable entry, even for one function reference', () => {
      const fallback = jest.fn();
      const emitter = makeEmitter(fallback);
      const emit = observe(emitter);
      const runs: string[] = [];
      const handler = (p: string) => {
        runs.push(p);
      };

      const first = emitter.addListener(handler);
      emitter.addListener(handler);
      first.remove();
      emit('payload');

      expect(runs).toStrictEqual(['payload']);
      expect(fallback).not.toHaveBeenCalled();
    });

    it('restores the fallback once the last handler is removed', () => {
      const fallback = jest.fn();
      const emitter = makeEmitter(fallback);
      const emit = observe(emitter);
      const subscription = emitter.addListener(() => {});

      subscription.remove();
      emit('payload');

      expect(fallback).toHaveBeenCalledWith('payload');
    });

    it('treats a repeated remove() as a no-op', () => {
      const fallback = jest.fn();
      const emitter = makeEmitter(fallback);
      const emit = observe(emitter);
      const runs: string[] = [];
      const first = emitter.addListener(p => {
        runs.push(p);
      });
      emitter.addListener(p => {
        runs.push(p);
      });

      first.remove();
      first.remove();
      emit('payload');

      expect(runs).toHaveLength(1);
      expect(fallback).not.toHaveBeenCalled();
    });
  });

  describe('restoreAfterBridgeTeardown', () => {
    it('drops the handlers and resubscribes when it had been observing', () => {
      const emitter = makeEmitter(jest.fn());
      emitter.startObserving();
      emitter.addListener(() => {});

      emitter.restoreAfterBridgeTeardown();

      expect(addEventListener).toHaveBeenCalledTimes(2);
    });

    it('does not subscribe when it had never observed', () => {
      makeEmitter(jest.fn()).restoreAfterBridgeTeardown();

      expect(addEventListener).not.toHaveBeenCalled();
    });

    it('never removes its own subscription', () => {
      const emitter = makeEmitter(jest.fn());
      emitter.startObserving();

      emitter.restoreAfterBridgeTeardown();

      expect(remove).not.toHaveBeenCalled();
    });

    it('leaves the fallback in charge afterwards', () => {
      const fallback = jest.fn();
      const emitter = makeEmitter(fallback);
      emitter.startObserving();
      emitter.addListener(() => {});

      emitter.restoreAfterBridgeTeardown();
      const emit = addEventListener.mock.calls.at(-1)![1] as (
        p: string,
      ) => void;
      emit('payload');

      expect(fallback).toHaveBeenCalledWith('payload');
    });
  });
});
