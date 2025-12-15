import { Platform } from 'react-native';
import { isRunningInExpoGo } from './env-detection';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('env-detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (globalThis as any).expo;
  });

  describe('isRunningInExpoGo', () => {
    it('should return false when ExpoGo module is not present', () => {
      expect(isRunningInExpoGo()).toBe(false);
    });

    it('should return true when ExpoGo native module exists', () => {
      (globalThis as any).expo = { modules: { ExpoGo: true } };

      jest.isolateModules(() => {
        const { isRunningInExpoGo: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });

    it('should return false when ExpoGo module is null', () => {
      (globalThis as any).expo = { modules: { ExpoGo: null } };

      jest.isolateModules(() => {
        const { isRunningInExpoGo: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(false);
      });
    });

    it('should return false when ExpoGo module is undefined', () => {
      (globalThis as any).expo = { modules: { ExpoGo: undefined } };

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
      (globalThis as any).expo = { modules: { ExpoGo: true } };

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });

    it('should return true when in Expo Go on Android', () => {
      Platform.OS = 'android';
      (globalThis as any).expo = { modules: { ExpoGo: true } };

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });

    it('should return true when on web even without Expo Go', () => {
      Platform.OS = 'web' as any;
      delete (globalThis as any).expo;

      jest.isolateModules(() => {
        const { shouldEnableMock: freshCheck } = require('./env-detection');
        expect(freshCheck()).toBe(true);
      });
    });
  });
});
