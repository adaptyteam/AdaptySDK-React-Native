import { Adapty } from '@/adapty-handler';
import type { AdaptyPaywallProduct, AdaptyProfile } from '@/types';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';

describe('Adapty - Purchase Event', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    adapty = await createAdaptyInstance();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
  });

  it('should emit onLatestProfileLoad event after purchase with correct format', async () => {
    const product: AdaptyPaywallProduct = {
      ios: { isFamilyShareable: false },
      vendorProductId: 'com.example.test',
      adaptyId: 'adapty_test',
      paywallProductIndex: 0,
      localizedDescription: 'Test Product',
      localizedTitle: 'Test',
      regionCode: 'US',
      variationId: 'variation_test',
      paywallABTestName: 'test_ab',
      paywallName: 'Test Paywall',
      accessLevelId: 'test_premium',
      productType: 'subscription',
      payloadData: 'test_payload',
      price: {
        amount: 9.99,
        currencyCode: 'USD',
        currencySymbol: '$',
        localizedString: '$9.99',
      },
    };

    const profileUpdates: AdaptyProfile[] = [];

    const listener = adapty.addEventListener('onLatestProfileLoad', profile => {
      profileUpdates.push(profile);

      // Verify no circular references by serializing
      expect(() => JSON.stringify(profile)).not.toThrow();
    });

    try {
      const result = await adapty.makePurchase(product);
      expect(result.type).toBe('success');

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(profileUpdates).toHaveLength(1);
      expect(profileUpdates[0]?.profileId).toBeDefined();
      expect(profileUpdates[0]?.accessLevels?.['config_premium']).toBeDefined();
      expect(
        profileUpdates[0]?.accessLevels?.['config_premium']?.isActive,
      ).toBe(true);
    } finally {
      listener.remove();
    }
  });
});
