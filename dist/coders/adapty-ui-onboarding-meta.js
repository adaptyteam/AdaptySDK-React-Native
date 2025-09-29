"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyUiOnboardingMetaCoder = void 0;
const coder_1 = require("./coder");
class AdaptyUiOnboardingMetaCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            onboardingId: {
                key: 'onboarding_id',
                required: true,
                type: 'string',
            },
            screenClientId: {
                key: 'screen_cid',
                required: true,
                type: 'string',
            },
            screenIndex: {
                key: 'screen_index',
                required: true,
                type: 'number',
            },
            totalScreens: {
                key: 'total_screens',
                required: true,
                type: 'number',
            },
        };
    }
}
exports.AdaptyUiOnboardingMetaCoder = AdaptyUiOnboardingMetaCoder;
//# sourceMappingURL=adapty-ui-onboarding-meta.js.map