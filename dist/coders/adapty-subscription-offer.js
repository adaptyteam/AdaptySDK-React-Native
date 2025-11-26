"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptySubscriptionOfferCoder = void 0;
const tslib_1 = require("tslib");
const coder_1 = require("./coder");
const adapty_subscription_offer_identifier_1 = require("../coders/adapty-subscription-offer-identifier");
const array_1 = require("../coders/array");
const adapty_discount_phase_1 = require("../coders/adapty-discount-phase");
class AdaptySubscriptionOfferCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            identifier: {
                key: 'offer_identifier',
                required: true,
                type: 'object',
                converter: new adapty_subscription_offer_identifier_1.AdaptySubscriptionOfferIdCoder(),
            },
            phases: {
                key: 'phases',
                required: true,
                type: 'array',
                converter: new array_1.ArrayCoder(adapty_discount_phase_1.AdaptyDiscountPhaseCoder),
            },
            android: {
                offerTags: {
                    key: 'offer_tags',
                    required: false,
                    type: 'array',
                },
            },
        };
    }
    decode(data) {
        const baseResult = super.decode(data);
        if (!data.offer_tags) {
            const { android } = baseResult, partialData = tslib_1.__rest(baseResult, ["android"]);
            return partialData;
        }
        return baseResult;
    }
}
exports.AdaptySubscriptionOfferCoder = AdaptySubscriptionOfferCoder;
//# sourceMappingURL=adapty-subscription-offer.js.map