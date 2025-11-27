import { NativeModules, Platform } from 'react-native';
import { isRunningInExpoGo } from './env-detection';

jest.mock('react-native', () => ({
  NativeModules: {},
  Platform: {
    OS: 'ios',
  },
}));

describe('env-detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isRunningInExpoGo', () => {
    it('should return false when ExpoGo module is not present', () => {
      expect(isRunningInExpoGo()).toBe(false);
    });

    it('should return true when ExpoGo native module exists', () => {
      (NativeModules as any).ExpoGo = { someMethod: jest.fn() };

      jest.isolateModules(() => {
        const { isRunningInExpoGo: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });

    it('should return false when ExpoGo module is null', () => {
      (NativeModules as any).ExpoGo = null;

      jest.isolateModules(() => {
        const { isRunningInExpoGo: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(false);
      });
    });

    it('should return false when ExpoGo module is undefined', () => {
      (NativeModules as any).ExpoGo = undefined;

      jest.isolateModules(() => {
        const { isRunningInExpoGo: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(false);
      });
    });
  });

  describe('shouldEnableMock', () => {
    it('should return false when not in Expo Go and not on web', () => {
      Platform.OS = 'ios';

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(false);
      });
    });

    it('should return true when running on web', () => {
      Platform.OS = 'web' as any;

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });

    it('should return true when in Expo Go', () => {
      Platform.OS = 'ios';
      (NativeModules as any).ExpoGo = { someMethod: jest.fn() };

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });

    it('should return true when in Expo Go on Android', () => {
      Platform.OS = 'android';
      (NativeModules as any).ExpoGo = { someMethod: jest.fn() };

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });

    it('should return true when on web even without Expo Go', () => {
      Platform.OS = 'web' as any;
      delete (NativeModules as any).ExpoGo;

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });
  });
});

