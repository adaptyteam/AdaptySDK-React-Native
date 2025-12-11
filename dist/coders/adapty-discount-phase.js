"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyDiscountPhaseCoder = void 0;
const coder_1 = require("./coder");
const adapty_subscription_period_1 = require("./adapty-subscription-period");
const adapty_price_1 = require("./adapty-price");
class AdaptyDiscountPhaseCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            localizedNumberOfPeriods: {
                key: 'localized_number_of_periods',
                required: false,
                type: 'string',
            },
            localizedSubscriptionPeriod: {
                key: 'localized_subscription_period',
                required: false,
                type: 'string',
            },
            numberOfPeriods: {
                key: 'number_of_periods',
                required: true,
                type: 'number',
            },
            paymentMode: { key: 'payment_mode', required: true, type: 'string' },
            price: {
                key: 'price',
                required: true,
                type: 'object',
                converter: new adapty_price_1.AdaptyPriceCoder(),
            },
            subscriptionPeriod: {
                key: 'subscription_period',
                required: true,
                type: 'object',
                converter: new adapty_subscription_period_1.AdaptySubscriptionPeriodCoder(),
            },
        };
    }
}
exports.AdaptyDiscountPhaseCoder = AdaptyDiscountPhaseCoder;
//# sourceMappingURL=adapty-discount-phase.js.map