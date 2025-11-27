"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPurchaseParamsCoder = void 0;
const react_native_1 = require("react-native");
function isDeprecatedType(data) {
    return (data &&
        data.android &&
        'oldSubVendorProductId' in data.android &&
        'prorationMode' in data.android);
}
class AdaptyPurchaseParamsCoder {
    encode(data) {
        if (react_native_1.Platform.OS !== 'android') {
            return {};
        }
        const purchaseParams = {};
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
                    old_sub_vendor_product_id: data.android.subscriptionUpdateParams.oldSubVendorProductId,
                };
            }
            if (data.android.isOfferPersonalized !== undefined) {
                purchaseParams['is_offer_personalized'] =
                    data.android.isOfferPersonalized;
            }
        }
        return purchaseParams;
    }
}
exports.AdaptyPurchaseParamsCoder = AdaptyPurchaseParamsCoder;
//# sourceMappingURL=adapty-purchase-params.js.map