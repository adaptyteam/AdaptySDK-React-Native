"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyIdentifyParamsCoder = void 0;
const react_native_1 = require("react-native");
class AdaptyIdentifyParamsCoder {
    encode(params) {
        var _a, _b;
        if (!params) {
            return undefined;
        }
        const result = {};
        if (react_native_1.Platform.OS === 'ios' && ((_a = params.ios) === null || _a === void 0 ? void 0 : _a.appAccountToken)) {
            result.app_account_token = params.ios.appAccountToken;
        }
        if (react_native_1.Platform.OS === 'android' && ((_b = params.android) === null || _b === void 0 ? void 0 : _b.obfuscatedAccountId)) {
            result.obfuscated_account_id = params.android.obfuscatedAccountId;
        }
        return Object.keys(result).length > 0 ? result : undefined;
    }
}
exports.AdaptyIdentifyParamsCoder = AdaptyIdentifyParamsCoder;
//# sourceMappingURL=adapty-identify-params.js.map