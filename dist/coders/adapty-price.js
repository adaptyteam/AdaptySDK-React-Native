"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPriceCoder = void 0;
const coder_1 = require("./coder");
class AdaptyPriceCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            amount: {
                key: 'amount',
                required: true,
                type: 'number',
            },
            currencyCode: {
                key: 'currency_code',
                required: false,
                type: 'string',
            },
            currencySymbol: {
                key: 'currency_symbol',
                required: false,
                type: 'string',
            },
            localizedString: {
                key: 'localized_string',
                required: false,
                type: 'string',
            },
        };
    }
}
exports.AdaptyPriceCoder = AdaptyPriceCoder;
//# sourceMappingURL=adapty-price.js.map