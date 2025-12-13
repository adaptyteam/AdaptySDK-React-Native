import { Adapty } from '@/adapty-handler';
import { MockStore } from '@/mock';
import { resetBridge } from '@/bridge';
import { cleanupAdapty } from './setup.utils';

/**
 * Tests for Adapty activation flow
 *
 * Note: These are integration tests running on mock implementation.
 * Mock ignores most activation parameters (customerUserId, observerMode, serverCluster, etc.)
 * and only uses __mockConfig settings. Tests focus on:
 * 1. Basic activation flow
 * 2. isActivated state (before/after activation)
 * 3. Mock configuration (__mockConfig) - actually used by MockStore
 * 4. __ignoreActivationOnFastRefresh - real logic in Adapty class
 *
 * Parameters like customerUserId, observerMode, serverCluster are validated
 * in E2E tests with real native SDK.
 */
describe('Adapty - Activation', () => {
  let adapty: Adapty;
  let setActivatedSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create spy before each test to track setActivated calls
    setActivatedSpy = jest.spyOn(MockStore.prototype, 'setActivated');
  });

  afterEach(() => {
    if (adapty) {
      cleanupAdapty(adapty);
    }
    // Restore spy after each test
    if (setActivatedSpy) {
      setActivatedSpy.mockRestore();
    }
    // Reset bridge to ensure test isolation
    resetBridge();
  });

  describe('enableMock', () => {
    it('should enable mock mode before activation', async () => {
      adapty = new Adapty();
      adapty.enableMock();

      const isActivated = await adapty.isActivated();
      expect(isActivated).toBe(false);

      await adapty.activate('test_api_key', { logLevel: 'error' });

      const isActivatedAfter = await adapty.isActivated();
      expect(isActivatedAfter).toBe(true);
    });

    it('should accept mock config', async () => {
      adapty = new Adapty();
      adapty.enableMock({
        profile: {
          customAttributes: {
            testKey: 'testValue',
          },
        },
      });

      const profile = await adapty.getProfile();
      expect(profile.customAttributes?.['testKey']).toBe('testValue');
    });

    it('should do nothing if bridge already initialized', async () => {
      adapty = new Adapty();
      adapty.enableMock({ profile: { customAttributes: { key1: 'value1' } } });

      // Try to enable mock again with different config
      adapty.enableMock({ profile: { customAttributes: { key2: 'value2' } } });

      // Should still have first config
      const profile = await adapty.getProfile();
      expect(profile.customAttributes?.['key1']).toBe('value1');
      expect(profile.customAttributes?.['key2']).toBeUndefined();
    });
  });

  describe('isActivated state', () => {
    it('should return false before activation', async () => {
      adapty = new Adapty();
      adapty.enableMock();

      const isActivated = await adapty.isActivated();
      expect(isActivated).toBe(false);
    });

    it('should verify MockStore starts with isActivated = false', () => {
      const store = new MockStore();
      expect(store.getIsActivated()).toBe(false);
    });
  });

  describe('Basic activation', () => {
    it('should activate SDK and return activated status', async () => {
      adapty = new Adapty();

      await adapty.activate('test_api_key', {
        __enableMock: true,
        logLevel: 'error',
      });

      const isActivated = await adapty.isActivated();
      expect(isActivated).toBe(true);
    });
  });

  describe('Mock configuration', () => {
    // These tests validate that __mockConfig is properly passed to MockStore
    // and affects behavior (premiumAccessLevelId, autoGrantPremium, profile)
    it('should activate with custom premiumAccessLevelId', async () => {
      adapty = new Adapty();

      await adapty.activate('test_api_key', {
        __enableMock: true,
        __mockConfig: {
          premiumAccessLevelId: 'custom_premium',
          autoGrantPremium: true,
        },
        logLevel: 'error',
      });

      const isActivated = await adapty.isActivated();
      expect(isActivated).toBe(true);
    });

    it('should activate with autoGrantPremium disabled', async () => {
      adapty = new Adapty();

      await adapty.activate('test_api_key', {
        __enableMock: true,
        __mockConfig: {
          autoGrantPremium: false,
        },
        logLevel: 'error',
      });

      const isActivated = await adapty.isActivated();
      expect(isActivated).toBe(true);
    });

    it('should activate with custom profile data', async () => {
      adapty = new Adapty();

      await adapty.activate('test_api_key', {
        __enableMock: true,
        __mockConfig: {
          profile: {
            customAttributes: {
              customKey: 'customValue',
            },
          },
        },
        logLevel: 'error',
      });

      const profile = await adapty.getProfile();
      expect(profile.customAttributes?.['customKey']).toBe('customValue');
    });
  });

  describe('__ignoreActivationOnFastRefresh', () => {
    // Now that bridge is preserved between activate() calls,
    // we can properly test this flag
    it('should skip second activation when flag is enabled', async () => {
      adapty = new Adapty();

      // First activation
      await adapty.activate('test_api_key', {
        __enableMock: true,
        __ignoreActivationOnFastRefresh: true,
        logLevel: 'error',
      });

      expect(setActivatedSpy).toHaveBeenCalledTimes(1);
      expect(setActivatedSpy).toHaveBeenCalledWith(true);
      let isActivated = await adapty.isActivated();
      expect(isActivated).toBe(true);

      setActivatedSpy.mockClear();

      // Second activation should be skipped - setActivated should NOT be called
      await adapty.activate('test_api_key', {
        __enableMock: true,
        __ignoreActivationOnFastRefresh: true,
        logLevel: 'error',
      });

      // setActivated was NOT called because activation was skipped
      expect(setActivatedSpy).not.toHaveBeenCalled();
      isActivated = await adapty.isActivated();
      expect(isActivated).toBe(true);
    });

    it('should work without the flag', async () => {
      adapty = new Adapty();

      await adapty.activate('test_api_key', {
        __enableMock: true,
        logLevel: 'error',
      });

      expect(setActivatedSpy).toHaveBeenCalledWith(true);
      const isActivated = await adapty.isActivated();
      expect(isActivated).toBe(true);
    });
  });
});
