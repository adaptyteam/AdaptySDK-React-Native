/**
 * Paywall Products Integration Tests
 *
 * Tests product fetching and parsing:
 * - GetPaywallProducts.Request format (paywall encoded in snake_case)
 * - Response parsing to camelCase
 * - variationId extraction from paywall
 */

import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import type { AdaptyPaywall } from '@/types';
import {
  createNativeModuleMock,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PAYWALL_PRODUCTS_RESPONSE,
  GET_PAYWALL_PRODUCTS_RESPONSE_ERROR,
} from '../shared/bridge-samples';
describe('Adapty - Paywall Products', () => {
  let nativeMock: MockNativeModule;
  let adapty: Adapty;

  beforeEach(() => {
    // Create native module mock with responses
    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_paywall_products: GET_PAYWALL_PRODUCTS_RESPONSE,
    });

    // Create SDK instance
    adapty = new Adapty();
  });

  afterEach(() => {
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('GetPaywallProducts request and response', () => {
    it('should encode paywall in snake_case and parse products to camelCase', async () => {
      // Activate SDK
      await adapty.activate('test_api_key');

      // Create paywall with camelCase fields
      const paywall: AdaptyPaywall = {
        hasViewConfiguration: false,
        id: 'test_paywall_id',
        name: 'Test Paywall',
        variationId: 'test_variation_123',
        version: 1,
        requestLocale: 'en',
        productIdentifiers: [
          {
            vendorProductId: 'com.example.monthly',
            adaptyProductId: 'monthly_id',
          },
        ],
        // Note: 'products' is deprecated in public API, but still used internally by encoder
        products: [
          {
            vendorId: 'com.example.monthly',
            adaptyId: 'monthly_id',
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
      const products = await adapty.getPaywallProducts(paywall);

      // Verify GetPaywallProducts.Request sent with snake_case paywall
      const request = extractNativeRequest<
        components['requests']['GetPaywallProducts.Request']
      >({
        nativeModule: nativeMock,
        callIndex: 1
      }); // Call index 1 (after activate)

      expect(request.method).toBe('get_paywall_products');
      expect(request.paywall).toMatchObject({
        paywall_id: 'test_paywall_id',
        paywall_name: 'Test Paywall',
        variation_id: 'test_variation_123',
        request_locale: 'en',
        placement: {
          developer_id: 'test_placement', // id → developer_id
          ab_test_name: 'test_ab',
          audience_name: 'all_users',
          placement_audience_version_id: 'v1', // audienceVersionId → placement_audience_version_id
        },
      });

      // Verify products parsed from response (snake_case → camelCase)
      expect(products).toBeDefined();
      expect(products.length).toBe(1);
      expect(products[0]).toMatchObject({
        vendorProductId: 'com.example.monthly',
        adaptyId: 'monthly_id',
        accessLevelId: 'premium',
        productType: 'subscription',
        paywallProductIndex: 0,
        variationId: 'test_variation_123', // extracted from paywall_variation_id
        paywallABTestName: 'test_ab',
        paywallName: 'Test Paywall',
        localizedDescription: 'Monthly Premium Subscription',
        localizedTitle: 'Premium Monthly',
        price: {
          amount: 9.99,
          currencyCode: 'USD',
          currencySymbol: '$',
          localizedString: '$9.99',
        },
      });
    });
  });

  describe('Error handling', () => {
    it('should parse AdaptyError from GetPaywallProducts.Response', async () => {
      // Reset bridge and create mock with error response for get_paywall_products
      resetBridge();
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        get_paywall_products: GET_PAYWALL_PRODUCTS_RESPONSE_ERROR,
      });

      // Create new Adapty instance and activate SDK
      adapty = new Adapty();
      await adapty.activate('test_api_key');

      // Create minimal paywall for the request
      const paywall: AdaptyPaywall = {
        hasViewConfiguration: false,
        id: 'test_paywall_id',
        name: 'Test Paywall',
        variationId: 'test_variation_123',
        version: 1,
        requestLocale: 'en',
        productIdentifiers: [],
        products: [],
        placement: {
          id: 'test_placement',
          abTestName: 'test_ab',
          audienceName: 'all_users',
          revision: 1,
          audienceVersionId: 'v1',
        },
      };

      // Execute: get paywall products should throw AdaptyError with adaptyCode
      await expect(adapty.getPaywallProducts(paywall)).rejects.toMatchObject({
        adaptyCode: 2, // camelCase in JS (from native adapty_code)
      });
    });
  });
});
