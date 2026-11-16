import { TurboModuleRegistry } from 'react-native';
import { initBridge, resetBridge } from '@/bridge';

type ReactNative = typeof import('react-native');

const getModule = TurboModuleRegistry.get as jest.Mock;

describe('bridge module resolution', () => {
  beforeEach(() => {
    resetBridge();
    getModule.mockClear();
  });

  it('resolves RNAdapty through TurboModuleRegistry', () => {
    initBridge(false);
    expect(getModule).toHaveBeenCalledWith('RNAdapty');
  });

  it('mock mode never touches the native registry', () => {
    initBridge(true);
    expect(getModule).not.toHaveBeenCalled();
  });

  it('keeps the existing error when the module is missing', () => {
    getModule.mockReturnValueOnce(null);
    expect(() => initBridge(false)).toThrow(
      'Adapty NativeModule is not defined',
    );
  });

  it('keeps the existing error without TurboModuleRegistry (react-native-web)', () => {
    const RN = jest.requireMock<ReactNative>('react-native');
    // The cached mock wins over a doMock factory, even in isolateModules
    jest.resetModules();
    try {
      jest.isolateModules(() => {
        // react-native-web exports no TurboModuleRegistry
        jest.doMock('react-native', () => {
          const { TurboModuleRegistry: _omitted, ...rest } = RN;
          return rest;
        });
        const bridge = require('@/bridge') as typeof import('@/bridge');
        expect(() => bridge.initBridge(false)).toThrow(
          'Adapty NativeModule is not defined',
        );
      });
    } finally {
      jest.doMock('react-native', () => RN);
    }
  });

  it('does not look the module up at import', () => {
    jest.isolateModules(() => {
      const RN = require('react-native') as ReactNative;
      const get = RN.TurboModuleRegistry.get as jest.Mock;
      get.mockClear();
      require('@/index');
      expect(get).not.toHaveBeenCalled();
    });
  });
});
