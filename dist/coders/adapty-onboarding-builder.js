"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyOnboardingBuilderCoder = void 0;
const coder_1 = require("./coder");
class AdaptyOnboardingBuilderCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            url: {
                key: 'config_url',
                required: true,
                type: 'string',
            },
        };
    }
}
exports.AdaptyOnboardingBuilderCoder = AdaptyOnboardingBuilderCoder;
//# sourceMappingURL=adapty-onboarding-builder.js.map