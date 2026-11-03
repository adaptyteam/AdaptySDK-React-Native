/**
 * Integration tests for MakePurchase method
 *
 * Tests bridge communication for purchase flow:
 * - Request encoding (camelCase → snake_case)
 * - Response parsing (snake_case → camelCase)
 * - Purchase result types (success, cancelled)
 */

import type { components } from '@/types/api';
import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import {
  createNativeModuleMock,
  expectNativeCall,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  IS_ACTIVATED_RESPONSE_TRUE,
  MAKE_PURCHASE_REQUEST,
  MAKE_PURCHASE_RESPONSE_SUCCESS,
  MAKE_PURCHASE_RESPONSE_CANCELLED,
  MAKE_PROMOTED_PURCHASE_RESPONSE_SUCCESS,
  VIP_PRODUCT,
} from '../shared/bridge-samples';
import type { AdaptyPaywallProduct, AdaptyPromotedProduct } from '@/types';
describe('Adapty - MakePurchase Bridge Integration', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  afterEach(() => {
    if (nativeMock) {
      resetNativeModuleMock(nativeMock);
    }
    // Reset bridge singleton to ensure clean state between tests
    resetBridge();
  });

  describe('Request encoding', () => {
    it('should send product in correct Request format', async () => {
      // Setup native mock to return success response
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        is_activated: IS_ACTIVATED_RESPONSE_TRUE,
        make_purchase: MAKE_PURCHASE_RESPONSE_SUCCESS,
      });

      // Create SDK instance AFTER mock is set up
      adapty = new Adapty();

      // Activate SDK
      await adapty.activate('test_key');

      // Make purchase with VIP product
      await adapty.makePurchase(VIP_PRODUCT);

      // Verify native call with snake_case format
      expectNativeCall<components['requests']['MakePurchase.Request']>({
        nativeModule: nativeMock,
        method: 'make_purchase',
        expectedRequest: MAKE_PURCHASE_REQUEST,
        callIndex: 1,
      }); // call index 1 (0 is activate)
    });

    it('should send the iOS billing plan and the offer under subscription', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        is_activated: IS_ACTIVATED_RESPONSE_TRUE,
        make_purchase: MAKE_PURCHASE_RESPONSE_SUCCESS,
      });

      adapty = new Adapty();
      await adapty.activate('test_key');
      nativeMock.handler.mockClear();

      const product: AdaptyPaywallProduct = {
        ...VIP_PRODUCT,
        subscription: {
          subscriptionPeriod: { unit: 'year', numberOfUnits: 1 },
          offer: {
            identifier: { type: 'introductory' },
            phases: [],
          },
          ios: {
            pricingTerms: {
              billingPlan: 'monthly',
              billingPrice: { amount: 6.99 },
              billingPeriod: { unit: 'month', numberOfUnits: 1 },
              commitmentInfo: {
                price: { amount: 83.88 },
                period: { unit: 'year', numberOfUnits: 1 },
              },
            },
          },
        },
      };

      await adapty.makePurchase(product);

      const request = extractNativeRequest<
        components['requests']['MakePurchase.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('make_purchase');
      // Only the billing plan id goes back to native, not the whole pricing terms
      const expectedSubscription: components['requests']['MakePurchase.Request']['product']['subscription'] =
        {
          pricing_terms: { billing_plan_id: 'monthly' },
          offer: { offer_identifier: { type: 'introductory' } },
        };
      expect(request.product.subscription).toStrictEqual(expectedSubscription);
    });
  });

  describe('Response parsing', () => {
    it('should handle user cancelled purchase', async () => {
      // Setup native mock to return cancelled response
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        is_activated: IS_ACTIVATED_RESPONSE_TRUE,
        make_purchase: MAKE_PURCHASE_RESPONSE_CANCELLED,
      });

      // Create SDK instance AFTER mock is set up
      adapty = new Adapty();

      // Activate SDK
      await adapty.activate('test_key');

      // Make purchase with VIP product
      const result = await adapty.makePurchase(VIP_PRODUCT);

      // Verify cancelled result type
      expect(result).toBeDefined();
      expect(result.type).toBe('user_cancelled');
    });
  });

  describe('makePromotedPurchase', () => {
    it('should send MakePromotedPurchase.Request with the vendor product id', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        make_promoted_purchase: MAKE_PROMOTED_PURCHASE_RESPONSE_SUCCESS,
      });

      adapty = new Adapty();
      await adapty.activate('test_key');
      // extractNativeRequest defaults to callIndex 0, which is the activate
      // call — clear it so index 0 is the method under test.
      nativeMock.handler.mockClear();

      const product: AdaptyPromotedProduct = {
        vendorProductId: 'yearly.premium.6999',
        localizedDescription: 'Get premium features with this plan',
        localizedTitle: 'Yearly Premium Plan',
      };

      await adapty.makePromotedPurchase(product);

      const request = extractNativeRequest<
        components['requests']['MakePromotedPurchase.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('make_promoted_purchase');
      expect(request.product.vendor_product_id).toBe('yearly.premium.6999');
    });

    it('should forward payload_data', async () => {
      // payload_data is how the native side re-identifies the product it handed
      // us; dropping it in getInput would break the purchase with no type error.
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        make_promoted_purchase: MAKE_PROMOTED_PURCHASE_RESPONSE_SUCCESS,
      });

      adapty = new Adapty();
      await adapty.activate('test_key');
      nativeMock.handler.mockClear();

      await adapty.makePromotedPurchase({
        vendorProductId: 'yearly.premium.6999',
        localizedDescription: 'Get premium features with this plan',
        localizedTitle: 'Yearly Premium Plan',
        payloadData: 'examplePayloadData',
      });

      const request = extractNativeRequest<
        components['requests']['MakePromotedPurchase.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.product.payload_data).toBe('examplePayloadData');
    });

    it('should forward the subscription offer identifier nested under subscription.offer', async () => {
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        make_promoted_purchase: MAKE_PROMOTED_PURCHASE_RESPONSE_SUCCESS,
      });

      adapty = new Adapty();
      await adapty.activate('test_key');
      nativeMock.handler.mockClear();

      const product: AdaptyPromotedProduct = {
        vendorProductId: 'yearly.premium.6999',
        localizedDescription: 'Get premium features with this plan',
        localizedTitle: 'Yearly Premium Plan',
        subscription: {
          subscriptionPeriod: { unit: 'year', numberOfUnits: 1 },
          offer: {
            identifier: { type: 'introductory', id: 'test_intro_offer' },
            phases: [],
          },
        },
      };

      await adapty.makePromotedPurchase(product);

      const request = extractNativeRequest<
        components['requests']['MakePromotedPurchase.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(
        request.product.subscription?.offer?.offer_identifier,
      ).toStrictEqual({ type: 'introductory', id: 'test_intro_offer' });
    });
  });
});
