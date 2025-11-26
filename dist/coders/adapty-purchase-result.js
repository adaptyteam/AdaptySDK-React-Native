"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPurchaseResultCoder = void 0;
const coder_1 = require("./coder");
const adapty_profile_1 = require("../coders/adapty-profile");
const react_native_1 = require("react-native");
class AdaptyPurchaseResultCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            type: {
                key: 'type',
                required: true,
                type: 'string',
            },
        };
    }
    decode(data) {
        const baseResult = super.decode(data);
        if (baseResult.type === 'success') {
            if (!data.profile) {
                throw new Error('Profile is required for success type of purchase result');
            }
            return Object.assign(Object.assign(Object.assign(Object.assign({}, baseResult), { profile: new adapty_profile_1.AdaptyProfileCoder().decode(data.profile) }), (react_native_1.Platform.OS === 'ios' && data.apple_jws_transaction
                ? { ios: { jwsTransaction: data.apple_jws_transaction } }
                : {})), (react_native_1.Platform.OS === 'android' && data.google_purchase_token
                ? { android: { purchaseToken: data.google_purchase_token } }
                : {}));
        }
        return baseResult;
    }
    encode(data) {
        var _a, _b;
        const { type } = data;
        if (type === 'success') {
            if (!('profile' in data)) {
                throw new Error('Profile is required for success type of purchase result');
            }
            return Object.assign(Object.assign({ type: 'success', profile: new adapty_profile_1.AdaptyProfileCoder().encode(data.profile) }, (react_native_1.Platform.OS === 'ios' && ((_a = data.ios) === null || _a === void 0 ? void 0 : _a.jwsTransaction)
                ? { apple_jws_transaction: data.ios.jwsTransaction }
                : {})), (react_native_1.Platform.OS === 'android' && ((_b = data.android) === null || _b === void 0 ? void 0 : _b.purchaseToken)
                ? { google_purchase_token: data.android.purchaseToken }
                : {}));
        }
        return super.encode({ type });
    }
}
exports.AdaptyPurchaseResultCoder = AdaptyPurchaseResultCoder;
//# sourceMappingURL=adapty-purchase-result.js.map