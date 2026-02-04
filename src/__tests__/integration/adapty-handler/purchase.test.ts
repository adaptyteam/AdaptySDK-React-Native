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
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  IS_ACTIVATED_RESPONSE_TRUE,
  MAKE_PURCHASE_REQUEST,
  MAKE_PURCHASE_RESPONSE_SUCCESS,
  MAKE_PURCHASE_RESPONSE_CANCELLED,
  VIP_PRODUCT,
} from '../shared/bridge-samples';
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
        callIndex: 1
      }); // call index 1 (0 is activate)
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
});
