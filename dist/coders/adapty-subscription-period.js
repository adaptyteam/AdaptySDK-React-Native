"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptySubscriptionPeriodCoder = void 0;
const coder_1 = require("./coder");
class AdaptySubscriptionPeriodCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            unit: { key: 'unit', required: true, type: 'string' },
            numberOfUnits: { key: 'number_of_units', required: true, type: 'number' },
        };
    }
}
exports.AdaptySubscriptionPeriodCoder = AdaptySubscriptionPeriodCoder;
//# sourceMappingURL=adapty-subscription-period.js.map