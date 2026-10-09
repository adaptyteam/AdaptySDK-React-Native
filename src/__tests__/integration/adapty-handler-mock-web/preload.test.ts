import { Adapty } from '@/adapty-handler';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';

/**
 * Preload has nothing to return, so the mock handler treats it as a void call.
 * These tests guard Expo Go and the web preview: a method missing from the
 * mock's void group rejects instead of resolving.
 */
describe('Adapty - Placement preload', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    adapty = await createAdaptyInstance();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
  });

  it('should resolve preloadFlows', async () => {
    await expect(
      adapty.preloadFlows(['test_placement', 'other_placement']),
    ).resolves.toBeUndefined();
  });

  it('should resolve preloadFlows with a custom timeout', async () => {
    await expect(
      adapty.preloadFlows(['test_placement'], { loadTimeoutMs: 3000 }),
    ).resolves.toBeUndefined();
  });

  it('should resolve preloadFlowsForDefaultAudience', async () => {
    await expect(
      adapty.preloadFlowsForDefaultAudience(['test_placement']),
    ).resolves.toBeUndefined();
  });
});
