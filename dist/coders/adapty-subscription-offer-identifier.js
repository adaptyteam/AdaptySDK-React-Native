"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptySubscriptionOfferIdCoder = void 0;
const coder_1 = require("./coder");
class AdaptySubscriptionOfferIdCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            type: {
                key: 'type',
                required: true,
                type: 'string',
            },
            id: {
                key: 'id',
                required: false,
                type: 'string',
            },
        };
    }
}
exports.AdaptySubscriptionOfferIdCoder = AdaptySubscriptionOfferIdCoder;
//# sourceMappingURL=adapty-subscription-offer-identifier.js.map