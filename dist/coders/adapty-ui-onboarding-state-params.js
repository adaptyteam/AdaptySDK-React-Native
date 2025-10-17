"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyUiOnboardingStateParamsCoder = void 0;
const coder_1 = require("./coder");
class AdaptyUiOnboardingStateParamsCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            id: {
                key: 'id',
                required: true,
                type: 'string',
            },
            value: {
                key: 'value',
                required: true,
                type: 'string',
            },
            label: {
                key: 'label',
                required: true,
                type: 'string',
            },
        };
    }
}
exports.AdaptyUiOnboardingStateParamsCoder = AdaptyUiOnboardingStateParamsCoder;
//# sourceMappingURL=adapty-ui-onboarding-state-params.js.map