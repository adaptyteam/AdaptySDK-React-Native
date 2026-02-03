import { Adapty } from '@/adapty-handler';
import type { AdaptyPaywall } from '@/types';
import { FetchPolicy } from '@/types/inputs';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';

describe('Adapty - Paywall', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    adapty = await createAdaptyInstance();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
  });

  describe('Basic getPaywall', () => {
    it('should return paywall with default parameters', async () => {
      const paywall = await adapty.getPaywall('test_placement');

      expect(paywall).toBeDefined();
      expect(paywall.id).toContain('test_placement');
      expect(paywall.name).toBe('test_placement');
      expect(paywall.placement.id).toBe('test_placement');
      expect(paywall.variationId).toBeDefined();
      expect(paywall.hasViewConfiguration).toBe(true);
    });

    it('should return different paywalls for different placementId', async () => {
      const paywall1 = await adapty.getPaywall('placement_one');
      const paywall2 = await adapty.getPaywall('placement_two');

      expect(paywall1.id).toContain('placement_one');
      expect(paywall2.id).toContain('placement_two');
      expect(paywall1.name).toBe('placement_one');
      expect(paywall2.name).toBe('placement_two');
      expect(paywall1.placement.id).toBe('placement_one');
      expect(paywall2.placement.id).toBe('placement_two');
    });

    it('should return paywall with correct structure', async () => {
      const paywall = await adapty.getPaywall('structure_test');

      // Check all required fields
      expect(paywall.id).toBeDefined();
      expect(paywall.name).toBeDefined();
      expect(paywall.variationId).toBeDefined();
      expect(paywall.hasViewConfiguration).toBeDefined();
      expect(paywall.requestLocale).toBeDefined();
      expect(paywall.version).toBeDefined();

      // Check placement structure
      expect(paywall.placement).toBeDefined();
      expect(paywall.placement.id).toBe('structure_test');
      expect(paywall.placement.abTestName).toBeDefined();
      expect(paywall.placement.audienceName).toBeDefined();
      expect(paywall.placement.revision).toBeDefined();
      expect(paywall.placement.audienceVersionId).toBeDefined();

      // Check paywallBuilder (modern structure) or remoteConfig (legacy)
      expect(
        paywall.paywallBuilder !== undefined ||
          paywall.remoteConfig !== undefined,
      ).toBe(true);
      if (paywall.paywallBuilder) {
        expect(paywall.paywallBuilder.id).toBeDefined();
        expect(paywall.paywallBuilder.lang).toBeDefined();
      }

      // Check productIdentifiers
      expect(paywall.productIdentifiers).toBeDefined();
      expect(Array.isArray(paywall.productIdentifiers)).toBe(true);
      expect(paywall.productIdentifiers.length).toBeGreaterThan(0);
    });
  });

  describe('Custom paywall via mockConfig', () => {
    it('should return custom paywall when provided in config', async () => {
      const customPaywall: Partial<AdaptyPaywall> = {
        name: 'Custom Premium Paywall',
        variationId: 'custom_variation_123',
        remoteConfig: {
          lang: 'en',
          data: {
            title: 'Unlock Premium Features',
            subtitle: 'Get access to all premium content',
          },
          dataString:
            '{"title":"Unlock Premium Features","subtitle":"Get access to all premium content"}',
        },
      };

      const adaptyWithCustom = await createAdaptyInstance({
        paywalls: {
          custom_placement: customPaywall,
        },
      });

      const paywall = await adaptyWithCustom.getPaywall('custom_placement');

      expect(paywall.name).toBe('Custom Premium Paywall');
      expect(paywall.variationId).toBe('custom_variation_123');
      expect(paywall.remoteConfig?.data?.['title']).toBe(
        'Unlock Premium Features',
      );
      expect(paywall.remoteConfig?.data?.['subtitle']).toBe(
        'Get access to all premium content',
      );
      // Should still have placement ID from mock
      expect(paywall.placement.id).toBe('custom_placement');

      cleanupAdapty(adaptyWithCustom);
    });
  });

  describe('API parameters smoke-test', () => {
    it('should accept all parameters without errors', async () => {
      // Test that method accepts all parameters (locale, fetchPolicy, loadTimeoutMs)
      // Note: Mock ignores these parameters, but we verify API contract is stable
      const paywall = await adapty.getPaywall('test_placement', 'ru', {
        fetchPolicy: FetchPolicy.ReturnCacheDataIfNotExpiredElseLoad,
        maxAgeSeconds: 300,
        loadTimeoutMs: 3000,
      });

      // Verify method didn't crash and returns valid paywall
      expect(paywall).toBeDefined();
      expect(paywall.id).toContain('test_placement');
      expect(paywall.placement.id).toBe('test_placement');

      // Note: We don't check that locale/fetchPolicy/timeout affected the result
      // because mock implementation ignores them. This is just a smoke-test
      // to ensure API contract is stable and TypeScript compiles correctly.
    });
  });

  describe('logShowPaywall', () => {
    it('should log paywall show event after getPaywall', async () => {
      const paywall = await adapty.getPaywall('test_placement');

      // Should not throw
      const result = await adapty.logShowPaywall(paywall);

      expect(result).toBeUndefined();
    });
  });
});
