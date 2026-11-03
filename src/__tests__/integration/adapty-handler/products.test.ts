/**
 * Paywall Products Integration Tests
 *
 * Tests product fetching and parsing:
 * - GetPaywallProducts.Request format (flow encoded in snake_case)
 * - Response parsing to camelCase
 * - variationId extraction from flow
 */

import { Platform } from 'react-native';
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
        hasViewConfiguration: false,
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
            // Note: 'products' is not on the public AdaptyFlowPaywall type, but kept at
            // runtime for coder.encode(flow) — assertion hides excess property from TS
            products: [
              {
                vendorId: 'com.example.monthly',
                adaptyId: 'monthly_id',
                accessLevelId: 'premium',
                productType: 'subscription',
              },
            ],
          } as AdaptyFlow['paywalls'][number],
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
        hasViewConfiguration: false,
        placement,
        responseCreatedAt: 1704067200000,
        paywalls: [
          {
            placement,
            id: 'test_paywall_id',
            name: 'Test Paywall',
            variationId: 'test_variation_123',
            productIdentifiers: [],
            // `products` kept at runtime for coder.encode(flow) — assertion hides excess property from TS
            products: [],
          } as AdaptyFlow['paywalls'][number],
        ],
      };

      // Execute: get paywall products should throw AdaptyError with adaptyCode
      await expect(adapty.getPaywallProducts(flow)).rejects.toMatchObject({
        adaptyCode: 2, // camelCase in JS (from native adapty_code)
      });
    });
  });

  describe('Android subscription decoding', () => {
    const originalOS = Platform.OS;

    const androidProduct: components['defs']['AdaptyPaywallProduct.Response'] =
      {
        vendor_product_id: 'com.example.yearly',
        adapty_product_id: 'yearly_id',
        access_level_id: 'premium',
        product_type: 'subscription',
        paywall_product_index: 0,
        paywall_variation_id: 'test_variation_123',
        paywall_ab_test_name: 'test_ab',
        paywall_name: 'Test Flow',
        localized_description: 'Yearly Premium Subscription',
        localized_title: 'Premium Yearly',
        price: { amount: 59.99, localized_string: '$59.99' },
        subscription: {
          base_plan_id: 'yearly-base',
          renewal_type: 'autorenewable',
          period: { unit: 'year', number_of_units: 1 },
        },
      };

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
      hasViewConfiguration: false,
      placement,
      responseCreatedAt: 1704067200000,
      paywalls: [
        {
          placement,
          id: 'test_paywall_id',
          name: 'Test Paywall',
          variationId: 'test_variation_123',
          productIdentifiers: [],
          // `products` kept at runtime for coder.encode(flow) — assertion hides excess property from TS
          products: [],
        } as AdaptyFlow['paywalls'][number],
      ],
    };

    async function getProducts(
      response: components['requests']['GetPaywallProducts.Response'],
    ) {
      resetBridge();
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        get_paywall_products: response,
      });
      adapty = new Adapty();
      await adapty.activate('test_api_key');
      return adapty.getPaywallProducts(flow);
    }

    beforeAll(() => {
      Platform.OS = 'android';
    });

    afterAll(() => {
      Platform.OS = originalOS;
    });

    it('should decode base_plan_id into subscription.android', async () => {
      const products = await getProducts({ success: [androidProduct] });

      expect(products[0]?.subscription?.android).toEqual({
        basePlanId: 'yearly-base',
        renewalType: 'autorenewable',
      });
    });

    it('should reject products whose Android subscription lacks base_plan_id', async () => {
      const { base_plan_id: _basePlanId, ...subscription } =
        androidProduct.subscription!;

      await expect(
        getProducts({ success: [{ ...androidProduct, subscription }] }),
      ).rejects.toMatchObject({ adaptyCode: 2006 });
    });
  });
});
