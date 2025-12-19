import type { AdaptyPaywallProduct, AdaptyPaywall } from '@/types';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';

describe('Adapty - Paywall Products', () => {
  describe('Paywall products with variation', () => {
    it('should extract variationId from paywall', async () => {
      const customProduct: AdaptyPaywallProduct = {
        ios: { isFamilyShareable: false },
        vendorProductId: 'com.special.product',
        adaptyId: 'special_adapty_id',
        paywallProductIndex: 0,
        localizedDescription: 'Special Product',
        localizedTitle: 'Special',
        variationId: 'special_variation_123',
        paywallABTestName: 'test_ab',
        paywallName: 'Special Paywall',
        accessLevelId: 'special_access',
        productType: 'subscription',
        payloadData: 'special',
        price: {
          amount: 199.99,
          currencyCode: 'USD',
          currencySymbol: '$',
          localizedString: '$199.99',
        },
      };

      // Create Adapty instance with custom products for specific variationId
      const adaptyWithCustom = await createAdaptyInstance({
        products: {
          special_variation_123: [customProduct],
        },
      });

      // Create paywall with matching variationId
      const paywall: AdaptyPaywall = {
        hasViewConfiguration: false,
        id: 'test_paywall',
        name: 'Test Paywall',
        variationId: 'special_variation_123',
        version: 1,
        requestLocale: 'en',
        productIdentifiers: [
          {
            vendorProductId: 'com.example.default',
            adaptyProductId: 'default_id',
          },
        ],
        // Note: 'products' is deprecated in public API, but still used internally by encoder
        products: [
          {
            vendorId: 'com.example.default',
            adaptyId: 'default_id',
            accessLevelId: 'premium',
            productType: 'subscription',
          },
        ],
        remoteConfig: {
          lang: 'en',
          data: {},
          dataString: '{}',
        },
        placement: {
          id: 'test_placement',
          abTestName: 'test_ab',
          audienceName: 'all_users',
          revision: 1,
          audienceVersionId: 'v1',
        },
      };

      // Get paywall products
      const products = await adaptyWithCustom.getPaywallProducts(paywall);

      // When variationId matches, custom product should be returned
      expect(products).toBeDefined();
      expect(products.length).toBe(1);
      expect(products[0]?.vendorProductId).toBe('com.special.product');
      expect(products[0]?.adaptyId).toBe('special_adapty_id');

      cleanupAdapty(adaptyWithCustom);
    });
  });
});

