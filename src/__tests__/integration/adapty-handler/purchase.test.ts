import { Adapty } from '@/adapty-handler';
import type { AdaptyPaywallProduct, AdaptyPurchaseResult } from '@/types';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';

describe('Adapty - Purchase', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    adapty = await createAdaptyInstance();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
  });

  describe('Purchase with access levels', () => {
    it('should use config.premiumAccessLevelId when set', async () => {
      const product: AdaptyPaywallProduct = {
        ios: {
          isFamilyShareable: false,
        },
        vendorProductId: 'com.example.vip',
        adaptyId: 'adapty_vip',
        paywallProductIndex: 0,
        localizedDescription: 'VIP Access Plan',
        localizedTitle: 'VIP Access',
        regionCode: 'US',
        variationId: 'variation_vip',
        paywallABTestName: 'test_ab_vip',
        paywallName: 'VIP Paywall',
        accessLevelId: 'vip_premium',
        productType: 'subscription',
        payloadData: 'vip_payload',
        price: {
          amount: 19.99,
          currencyCode: 'USD',
          currencySymbol: '$',
          localizedString: '$19.99',
        },
      };

      // Make purchase
      const result: AdaptyPurchaseResult = await adapty.makePurchase(product);

      // Verify result structure
      expect(result).toBeDefined();
      expect(result.type).toBe('success');

      if (result.type === 'success') {
        expect(result.profile).toBeDefined();
        expect(result.profile.accessLevels).toBeDefined();

        // config.premiumAccessLevelId has priority over product.accessLevelId
        const accessLevels = Object.keys(result.profile.accessLevels || {});

        expect(accessLevels).toContain('config_premium');
        expect(accessLevels).not.toContain('vip_premium');

        // Verify the access level details
        expect(result.profile.accessLevels?.['config_premium']).toBeDefined();
        expect(result.profile.accessLevels?.['config_premium']?.isActive).toBe(
          true,
        );
      }
    });

    it('should override all products with config.premiumAccessLevelId', async () => {
      const products: AdaptyPaywallProduct[] = [
        {
          ios: { isFamilyShareable: false },
          vendorProductId: 'com.example.basic',
          adaptyId: 'adapty_basic',
          paywallProductIndex: 0,
          localizedDescription: 'Basic Plan',
          localizedTitle: 'Basic',
          variationId: 'variation_1',
          paywallABTestName: 'test_ab',
          paywallName: 'Subscription Paywall',
          accessLevelId: 'basic_access',
          productType: 'subscription',
          payloadData: 'payload',
          price: {
            amount: 4.99,
            currencyCode: 'USD',
            currencySymbol: '$',
            localizedString: '$4.99',
          },
        },
        {
          ios: { isFamilyShareable: false },
          vendorProductId: 'com.example.pro',
          adaptyId: 'adapty_pro',
          paywallProductIndex: 1,
          localizedDescription: 'Pro Plan',
          localizedTitle: 'Pro',
          variationId: 'variation_1',
          paywallABTestName: 'test_ab',
          paywallName: 'Subscription Paywall',
          accessLevelId: 'pro_access',
          productType: 'subscription',
          payloadData: 'payload',
          price: {
            amount: 9.99,
            currencyCode: 'USD',
            currencySymbol: '$',
            localizedString: '$9.99',
          },
        },
        {
          ios: { isFamilyShareable: false },
          vendorProductId: 'com.example.enterprise',
          adaptyId: 'adapty_enterprise',
          paywallProductIndex: 2,
          localizedDescription: 'Enterprise Plan',
          localizedTitle: 'Enterprise',
          variationId: 'variation_1',
          paywallABTestName: 'test_ab',
          paywallName: 'Subscription Paywall',
          accessLevelId: 'enterprise_access',
          productType: 'subscription',
          payloadData: 'payload',
          price: {
            amount: 49.99,
            currencyCode: 'USD',
            currencySymbol: '$',
            localizedString: '$49.99',
          },
        },
      ];

      // Purchase all three products
      const results: AdaptyPurchaseResult[] = [];
      for (const product of products) {
        const result = await adapty.makePurchase(product);
        results.push(result);
      }

      // All purchases grant 'config_premium' because it's set in config
      // This is useful for testing - you can control which access level is granted
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const product = products[i];

        if (result && result.type === 'success' && product) {
          const accessLevels = Object.keys(result.profile.accessLevels || {});

          // All purchases grant 'config_premium' because config.premiumAccessLevelId is set
          expect(accessLevels).toContain('config_premium');
          expect(accessLevels).not.toContain(product.accessLevelId);
        }
      }
    });
  });

  describe('Product accessLevelId usage', () => {
    it('should use product.accessLevelId when config.premiumAccessLevelId not set', async () => {
      // Create instance WITHOUT config.premiumAccessLevelId
      const adaptyNoConfig = await createAdaptyInstance({
        // NO premiumAccessLevelId - should use product's
        premiumAccessLevelId: undefined,
        autoGrantPremium: true,
      });

      const product: AdaptyPaywallProduct = {
        ios: { isFamilyShareable: false },
        vendorProductId: 'com.example.expected',
        adaptyId: 'adapty_expected',
        paywallProductIndex: 0,
        localizedDescription: 'Expected',
        localizedTitle: 'Expected',
        variationId: 'expected_var',
        paywallABTestName: 'expected_ab',
        paywallName: 'Expected Paywall',
        accessLevelId: 'expected_access',
        productType: 'subscription',
        payloadData: 'expected',
        price: {
          amount: 1.99,
          currencyCode: 'USD',
          currencySymbol: '$',
          localizedString: '$1.99',
        },
      };

      const result = await adaptyNoConfig.makePurchase(product);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        const accessLevels = Object.keys(result.profile.accessLevels || {});
        expect(accessLevels).toContain('expected_access');
        expect(accessLevels).not.toContain('premium');
      }

      cleanupAdapty(adaptyNoConfig);
    });

    it('should not grant access when autoGrantPremium is false', async () => {
      const adaptyNoGrant = await createAdaptyInstance({
        autoGrantPremium: false,
      });

      const product: AdaptyPaywallProduct = {
        ios: { isFamilyShareable: false },
        vendorProductId: 'com.example.noaccess',
        adaptyId: 'adapty_noaccess',
        paywallProductIndex: 0,
        localizedDescription: 'No Access Product',
        localizedTitle: 'No Access',
        variationId: 'no_access_var',
        paywallABTestName: 'no_access_ab',
        paywallName: 'No Access Paywall',
        accessLevelId: 'should_not_be_granted',
        productType: 'subscription',
        payloadData: 'no_access',
        price: {
          amount: 4.99,
          currencyCode: 'USD',
          currencySymbol: '$',
          localizedString: '$4.99',
        },
      };

      const result = await adaptyNoGrant.makePurchase(product);

      expect(result.type).toBe('success');
      if (result.type === 'success') {
        const accessLevels = Object.keys(result.profile.accessLevels || {});
        expect(accessLevels).toHaveLength(0);
      }

      cleanupAdapty(adaptyNoGrant);
    });
  });
});
