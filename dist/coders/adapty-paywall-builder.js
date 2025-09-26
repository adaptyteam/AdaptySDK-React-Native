"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPaywallBuilderCoder = void 0;
const coder_1 = require("./coder");
class AdaptyPaywallBuilderCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            id: {
                key: 'paywall_builder_id',
                required: true,
                type: 'string',
            },
            lang: {
                key: 'lang',
                required: true,
                type: 'string',
            },
        };
    }
}
exports.AdaptyPaywallBuilderCoder = AdaptyPaywallBuilderCoder;
//# sourceMappingURL=adapty-paywall-builder.js.map