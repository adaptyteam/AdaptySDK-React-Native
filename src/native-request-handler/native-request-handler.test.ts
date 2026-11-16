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
});
