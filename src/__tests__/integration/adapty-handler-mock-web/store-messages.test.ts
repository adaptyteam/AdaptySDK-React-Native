import { Adapty } from '@/adapty-handler';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';

/**
 * The mock never receives store messages, so the queue is always empty and
 * showing does nothing. These tests guard Expo Go and the web preview: a
 * method missing from the mock resolves undefined instead of an array.
 */
describe('Adapty - Store messages (mock mode)', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    adapty = await createAdaptyInstance();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
  });

  it('should resolve an empty pending list', async () => {
    await expect(adapty.getPendingStoreMessageTypes()).resolves.toStrictEqual(
      [],
    );
  });

  it('should resolve showStoreMessages', async () => {
    await expect(
      adapty.showStoreMessages({ ios: { filter: ['billing_issue'] } }),
    ).resolves.toBeUndefined();
  });
});
