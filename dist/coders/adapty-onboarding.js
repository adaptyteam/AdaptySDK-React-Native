"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyOnboardingCoder = void 0;
const tslib_1 = require("tslib");
const coder_1 = require("./coder");
const adapty_remote_config_1 = require("./adapty-remote-config");
const adapty_onboarding_builder_1 = require("./adapty-onboarding-builder");
const adapty_placement_1 = require("../coders/adapty-placement");
class AdaptyOnboardingCoder extends coder_1.Coder {
    constructor() {
        super(...arguments);
        this.properties = {
            placement: {
                key: 'placement',
                required: true,
                type: 'object',
                converter: new adapty_placement_1.AdaptyPlacementCoder(),
            },
            id: { key: 'onboarding_id', required: true, type: 'string' },
            name: { key: 'onboarding_name', required: true, type: 'string' },
            remoteConfig: {
                key: 'remote_config',
                required: false,
                type: 'object',
                converter: new adapty_remote_config_1.AdaptyRemoteConfigCoder(),
            },
            variationId: { key: 'variation_id', required: true, type: 'string' },
            version: { key: 'response_created_at', required: false, type: 'number' },
            onboardingBuilder: {
                key: 'onboarding_builder',
                required: false,
                type: 'object',
                converter: new adapty_onboarding_builder_1.AdaptyOnboardingBuilderCoder(),
            },
            payloadData: { key: 'payload_data', required: false, type: 'string' },
            requestLocale: { key: 'request_locale', required: true, type: 'string' },
        };
    }
    decode(data) {
        const codablePart = super.decode(data);
        return Object.assign(Object.assign({}, codablePart), { hasViewConfiguration: codablePart.onboardingBuilder !== undefined });
    }
    encode(data) {
        const { hasViewConfiguration } = data, codablePart = tslib_1.__rest(data, ["hasViewConfiguration"]);
        return super.encode(codablePart);
    }
}
exports.AdaptyOnboardingCoder = AdaptyOnboardingCoder;
//# sourceMappingURL=adapty-onboarding.js.map