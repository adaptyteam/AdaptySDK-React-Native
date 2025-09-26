"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptySubscriptionDetailsCoder = void 0;
const tslib_1 = require("tslib");
const coder_1 = require("./coder");
const adapty_subscription_period_1 = require("./adapty-subscription-period");
const adapty_subscription_offer_1 = require("../coders/adapty-subscription-offer");
class AdaptySubscriptionDetailsCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            subscriptionPeriod: {
                key: 'period',
                required: true,
                type: 'object',
                converter: new adapty_subscription_period_1.AdaptySubscriptionPeriodCoder(),
            },
            localizedSubscriptionPeriod: {
                key: 'localized_period',
                required: false,
                type: 'string',
            },
            offer: {
                key: 'offer',
                required: false,
                type: 'object',
                converter: new adapty_subscription_offer_1.AdaptySubscriptionOfferCoder(),
            },
            ios: {
                subscriptionGroupIdentifier: {
                    key: 'group_identifier',
                    required: false,
                    type: 'string',
                },
            },
            android: {
                basePlanId: {
                    key: 'base_plan_id',
                    required: true,
                    type: 'string',
                },
                renewalType: {
                    key: 'renewal_type',
                    required: false,
                    type: 'string',
                },
            },
        };
    }
    decode(data) {
        const baseResult = super.decode(data);
        const propToRemove = data.base_plan_id ? 'ios' : 'android';
        const _a = baseResult, _b = propToRemove, _ = _a[_b], partialData = tslib_1.__rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return partialData;
    }
}
exports.AdaptySubscriptionDetailsCoder = AdaptySubscriptionDetailsCoder;
//# sourceMappingURL=adapty-subscription-details.js.map