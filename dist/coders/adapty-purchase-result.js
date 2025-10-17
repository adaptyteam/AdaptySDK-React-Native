"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPurchaseResultCoder = void 0;
const coder_1 = require("./coder");
const adapty_profile_1 = require("../coders/adapty-profile");
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
            return Object.assign(Object.assign({}, baseResult), { profile: new adapty_profile_1.AdaptyProfileCoder().decode(data.profile) });
        }
        return baseResult;
    }
    encode(data) {
        const { type } = data;
        if (type === 'success') {
            if (!('profile' in data)) {
                throw new Error('Profile is required for success type of purchase result');
            }
            return {
                type: 'success',
                profile: new adapty_profile_1.AdaptyProfileCoder().encode(data.profile),
            };
        }
        return super.encode({ type });
    }
}
exports.AdaptyPurchaseResultCoder = AdaptyPurchaseResultCoder;
//# sourceMappingURL=adapty-purchase-result.js.map