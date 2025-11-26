import { AdaptyPurchaseParamsCoder } from './adapty-purchase-params';
import * as Input from '@/types/inputs';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

describe('AdaptyPurchaseParamsCoder', () => {
  let coder: AdaptyPurchaseParamsCoder;

  beforeEach(() => {
    coder = new AdaptyPurchaseParamsCoder();
  });

  describe('encode', () => {
    it('should handle deprecated type', () => {
      const params: Input.MakePurchaseParamsInput = {
        android: {
          oldSubVendorProductId: 'old_product_id',
          prorationMode:
            Input.AdaptyAndroidSubscriptionUpdateReplacementMode
              .ChargeProratedPrice,
          isOfferPersonalized: true,
        },
      };

      const result = coder.encode(params);
      expect(result).toEqual({
        subscription_update_params: {
          replacement_mode: 'charge_prorated_price',
          old_sub_vendor_product_id: 'old_product_id',
        },
        is_offer_personalized: true,
      });
    });

    it('should handle new type', () => {
      const params: Input.MakePurchaseParamsInput = {
        android: {
          subscriptionUpdateParams: {
            oldSubVendorProductId: 'old_product_id',
            prorationMode:
              Input.AdaptyAndroidSubscriptionUpdateReplacementMode
                .ChargeProratedPrice,
          },
          isOfferPersonalized: true,
        },
      };

      const result = coder.encode(params);
      expect(result).toEqual({
        subscription_update_params: {
          replacement_mode: 'charge_prorated_price',
          old_sub_vendor_product_id: 'old_product_id',
        },
        is_offer_personalized: true,
      });
    });

    it('should handle empty params', () => {
      const params: Input.MakePurchaseParamsInput = {};

      const result = coder.encode(params);
      expect(result).toEqual({});
    });

    it('should return empty object for non-Android platforms', () => {
      const originalPlatform = require('react-native').Platform;
      require('react-native').Platform = { OS: 'ios' };

      const params: Input.MakePurchaseParamsInput = {
        android: {
          subscriptionUpdateParams: {
            oldSubVendorProductId: 'old_product_id',
            prorationMode:
              Input.AdaptyAndroidSubscriptionUpdateReplacementMode
                .ChargeProratedPrice,
          },
          isOfferPersonalized: true,
        },
      };

      const result = coder.encode(params);
      expect(result).toEqual({});

      require('react-native').Platform = originalPlatform;
    });
  });
});
