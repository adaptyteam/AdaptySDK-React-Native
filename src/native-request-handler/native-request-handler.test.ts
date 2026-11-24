import type { NativeEventEmitter } from 'react-native';
import type { Spec } from '@/specs/NativeRNAdapty';
import { NativeRequestHandler } from './native-request-handler';

describe('NativeRequestHandler', () => {
  it('throws when the native module is missing', () => {
    expect(() => new NativeRequestHandler<string, string>(null)).toThrow(
      'Adapty NativeModule is not defined',
    );
  });

  it('sends the method and the { args } envelope to handle', async () => {
    const getConstants = jest.fn();
    const module = {
      handle: jest.fn().mockResolvedValue('{"success":true}'),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
      getConstants,
    } as unknown as Spec & { handle: jest.Mock };

    const handler = new NativeRequestHandler<string, string>(module);
    const result = await handler.request<boolean>(
      'is_activated',
      '{"method":"is_activated"}',
      'Boolean',
    );

    expect(result).toBe(true);
    expect(module.handle).toHaveBeenCalledWith('is_activated', {
      args: '{"method":"is_activated"}',
    });
    expect(getConstants).not.toHaveBeenCalled();
  });

  describe('listener tracking', () => {
    // The global react-native mock's emitter returns no subscriptions
    const createHandler = () => {
      const handler = new NativeRequestHandler<string, string>({
        handle: jest.fn(),
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      } as unknown as Spec);
      const nativeRemoves: jest.Mock[] = [];
      handler._emitter = {
        addListener: jest.fn(() => {
          const remove = jest.fn();
          nativeRemoves.push(remove);
          return { remove };
        }),
      } as unknown as NativeEventEmitter;
      return { handler, nativeRemoves };
    };

    it('drops a subscription from the set on remove; a second remove is a no-op', () => {
      const { handler, nativeRemoves } = createHandler();
      const raw = handler.addRawEventListener('raw_event', jest.fn());
      const parsed = handler.addEventListener('parsed_event', jest.fn());
      expect(handler._listeners.size).toBe(2);

      raw.remove();
      expect(handler._listeners.size).toBe(1);
      raw.remove();
      expect(handler._listeners.size).toBe(1);
      expect(nativeRemoves[0]).toHaveBeenCalledTimes(1);

      parsed.remove();
      parsed.remove();
      expect(handler._listeners.size).toBe(0);
      expect(nativeRemoves[1]).toHaveBeenCalledTimes(1);
    });

    it('removeAllEventListeners removes only the remaining subscriptions', () => {
      const { handler, nativeRemoves } = createHandler();
      handler.addRawEventListener('raw_event', jest.fn()).remove();
      handler.addRawEventListener('raw_event', jest.fn());
      handler.addEventListener('parsed_event', jest.fn());

      handler.removeAllEventListeners();
      expect(handler._listeners.size).toBe(0);
      nativeRemoves.forEach(remove => expect(remove).toHaveBeenCalledTimes(1));
    });
  });
});
