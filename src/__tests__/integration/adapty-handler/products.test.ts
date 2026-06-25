/**
 * Paywall Products Integration Tests
 *
 * Tests product fetching and parsing:
 * - GetPaywallProducts.Request format (flow encoded in snake_case)
 * - Response parsing to camelCase
 * - variationId extraction from flow
 */

import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import type { AdaptyFlow } from '@/types';
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
    it('should encode flow in snake_case and parse products to camelCase', async () => {
      // Activate SDK
      await adapty.activate('test_api_key');

      // Create flow with camelCase fields
      const placement = {
        id: 'test_placement',
        abTestName: 'test_ab',
        audienceName: 'all_users',
        revision: 1,
        audienceVersionId: 'v1',
      };
      const flow: AdaptyFlow = {
        id: 'test_flow_id',
        name: 'Test Flow',
        variationId: 'test_variation_123',
        placement,
        responseCreatedAt: 1704067200000,
        paywalls: [
          {
            placement,
            id: 'test_paywall_id',
            name: 'Test Paywall',
            variationId: 'test_variation_123',
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
          },
        ],
      };

      // Get paywall products
      const products = await adapty.getPaywallProducts(flow);

      // Verify GetPaywallProducts.Request sent with snake_case flow
      const request = extractNativeRequest<
        components['requests']['GetPaywallProducts.Request']
      >({
        nativeModule: nativeMock,
        callIndex: 1,
      }); // Call index 1 (after activate)

      expect(request.method).toBe('get_paywall_products');
      expect(request.flow).toMatchObject({
        flow_id: 'test_flow_id',
        flow_name: 'Test Flow',
        variation_id: 'test_variation_123',
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
        paywallName: 'Test Flow', // from GET_PAYWALL_PRODUCTS_RESPONSE sample
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

      // Create minimal flow for the request
      const placement = {
        id: 'test_placement',
        abTestName: 'test_ab',
        audienceName: 'all_users',
        revision: 1,
        audienceVersionId: 'v1',
      };
      const flow: AdaptyFlow = {
        id: 'test_flow_id',
        name: 'Test Flow',
        variationId: 'test_variation_123',
        placement,
        responseCreatedAt: 1704067200000,
        paywalls: [
          {
            placement,
            id: 'test_paywall_id',
            name: 'Test Paywall',
            variationId: 'test_variation_123',
            productIdentifiers: [],
            products: [],
          },
        ],
      };

      // Execute: get paywall products should throw AdaptyError with adaptyCode
      await expect(adapty.getPaywallProducts(flow)).rejects.toMatchObject({
        adaptyCode: 2, // camelCase in JS (from native adapty_code)
      });
    });
  });
});
