import * as Input from '@/types/inputs';
import { Platform } from 'react-native';

type Model = Input.MakePurchaseParamsInput;
type Serializable = Record<string, any>;

function isDeprecatedType(
  data: any,
): data is { android?: Input.AdaptyAndroidSubscriptionUpdateParameters } {
  return (
    data &&
    data.android &&
    'oldSubVendorProductId' in data.android &&
    'prorationMode' in data.android
  );
}

export class AdaptyPurchaseParamsCoder {
  encode(data: Model): Serializable {
    if (Platform.OS !== 'android') {
      return {};
    }

    const purchaseParams: Serializable = {};

    if (isDeprecatedType(data)) {
      if (data.android) {
        purchaseParams['subscription_update_params'] = {
          replacement_mode: data.android.prorationMode,
          old_sub_vendor_product_id: data.android.oldSubVendorProductId,
        };

        if (data.android.isOfferPersonalized) {
          purchaseParams['is_offer_personalized'] =
            data.android.isOfferPersonalized;
        }
      }
      return purchaseParams;
    }

    if (data.android) {
      if (data.android.subscriptionUpdateParams) {
        purchaseParams['subscription_update_params'] = {
          replacement_mode: data.android.subscriptionUpdateParams.prorationMode,
          old_sub_vendor_product_id:
            data.android.subscriptionUpdateParams.oldSubVendorProductId,
        };
      }

      if (data.android.isOfferPersonalized !== undefined) {
        purchaseParams['is_offer_personalized'] =
          data.android.isOfferPersonalized;
      }

      if (data.android.obfuscatedAccountId) {
        purchaseParams['obfuscated_account_id'] =
          data.android.obfuscatedAccountId;
      }

      if (data.android.obfuscatedProfileId) {
        purchaseParams['obfuscated_profile_id'] =
          data.android.obfuscatedProfileId;
      }
    }

    return purchaseParams;
  }
}
