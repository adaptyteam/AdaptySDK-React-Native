import { Adapty } from '@/adapty-handler';
import { FetchPolicy } from '@adapty/core';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';
import { createMockFlow } from './helpers.utils';

describe('Adapty - Flow', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    adapty = await createAdaptyInstance();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
  });

  describe('Basic getFlow', () => {
    it('should return flow with default parameters', async () => {
      const flow = await adapty.getFlow('test_placement');

      expect(flow).toBeDefined();
      expect(flow.id).toContain('test_placement');
      expect(flow.name).toBe('test_placement');
      expect(flow.placement.id).toBe('test_placement');
      expect(flow.variationId).toBeDefined();
      expect(flow.responseCreatedAt).toBeDefined();
      expect(Array.isArray(flow.variations)).toBe(true);
      expect(flow.variations.length).toBeGreaterThan(0);
    });

    it('should return different flows for different placementId', async () => {
      const flow1 = await adapty.getFlow('placement_one');
      const flow2 = await adapty.getFlow('placement_two');

      expect(flow1.id).toContain('placement_one');
      expect(flow2.id).toContain('placement_two');
      expect(flow1.name).toBe('placement_one');
      expect(flow2.name).toBe('placement_two');
      expect(flow1.placement.id).toBe('placement_one');
      expect(flow2.placement.id).toBe('placement_two');
    });

    it('should return flow with correct structure', async () => {
      const flow = await adapty.getFlow('structure_test');

      // Check all required fields
      expect(flow.id).toBeDefined();
      expect(flow.name).toBeDefined();
      expect(flow.variationId).toBeDefined();
      expect(flow.responseCreatedAt).toBeDefined();

      // Check placement structure
      expect(flow.placement).toBeDefined();
      expect(flow.placement.id).toBe('structure_test');
      expect(flow.placement.abTestName).toBeDefined();
      expect(flow.placement.audienceName).toBeDefined();
      expect(flow.placement.revision).toBeDefined();
      expect(flow.placement.audienceVersionId).toBeDefined();

      // Check variations (flow-shape)
      expect(flow.variations).toBeDefined();
      expect(Array.isArray(flow.variations)).toBe(true);
      expect(flow.variations.length).toBeGreaterThan(0);

      // Check productIdentifiers on the first variation
      expect(flow.variations[0]!.productIdentifiers).toBeDefined();
      expect(Array.isArray(flow.variations[0]!.productIdentifiers)).toBe(true);
      expect(flow.variations[0]!.productIdentifiers.length).toBeGreaterThan(0);
    });
  });

  describe('Custom flow via mockConfig', () => {
    it('should return custom flow when provided in config', async () => {
      const customFlow = createMockFlow({
        name: 'Custom Premium Flow',
        variationId: 'custom_variation_123',
        remoteConfigs: [
          {
            lang: 'en',
            data: {
              title: 'Unlock Premium Features',
              subtitle: 'Get access to all premium content',
            },
            dataString:
              '{"title":"Unlock Premium Features","subtitle":"Get access to all premium content"}',
          },
        ],
      });

      const adaptyWithCustom = await createAdaptyInstance({
        flows: {
          custom_placement: customFlow,
        },
      });

      const flow = await adaptyWithCustom.getFlow('custom_placement');

      expect(flow.name).toBe('Custom Premium Flow');
      expect(flow.variationId).toBe('custom_variation_123');
      expect(flow.remoteConfigs?.[0]?.data?.['title']).toBe(
        'Unlock Premium Features',
      );
      expect(flow.remoteConfigs?.[0]?.data?.['subtitle']).toBe(
        'Get access to all premium content',
      );

      cleanupAdapty(adaptyWithCustom);
    });
  });

  describe('API parameters smoke-test', () => {
    it('should accept all parameters without errors', async () => {
      // Test that method accepts all parameters (fetchPolicy, loadTimeoutMs)
      // Note: Mock ignores these parameters, but we verify API contract is stable
      const flow = await adapty.getFlow('test_placement', {
        fetchPolicy: FetchPolicy.ReturnCacheDataIfNotExpiredElseLoad,
        maxAgeSeconds: 300,
        loadTimeoutMs: 3000,
      });

      // Verify method didn't crash and returns valid flow
      expect(flow).toBeDefined();
      expect(flow.id).toContain('test_placement');
      expect(flow.placement.id).toBe('test_placement');

      // Note: We don't check that fetchPolicy/timeout affected the result
      // because mock implementation ignores them. This is just a smoke-test
      // to ensure API contract is stable and TypeScript compiles correctly.
    });
  });

  describe('logShowFlow', () => {
    it('should log flow show event after getFlow', async () => {
      const flow = await adapty.getFlow('test_placement');

      // Should not throw
      const result = await adapty.logShowFlow(flow);

      expect(result).toBeUndefined();
    });
  });
});
