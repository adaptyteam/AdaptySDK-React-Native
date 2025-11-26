"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyUiOnboardingStateUpdatedActionCoder = void 0;
const coder_1 = require("./coder");
const adapty_ui_onboarding_state_params_1 = require("./adapty-ui-onboarding-state-params");
class AdaptyUiOnboardingStateUpdatedActionCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.paramCoder = new adapty_ui_onboarding_state_params_1.AdaptyUiOnboardingStateParamsCoder();
        this.properties = {
            elementId: {
                key: 'element_id',
                required: true,
                type: 'string',
            },
            elementType: {
                key: 'element_type',
                required: true,
                type: 'string',
            },
        };
    }
    decode(data) {
        const base = super.decode(data);
        const { elementType } = base;
        switch (elementType) {
            case 'select':
                return Object.assign(Object.assign({}, base), { elementType: 'select', value: this.paramCoder.decode(data.value) });
            case 'multi_select':
                return Object.assign(Object.assign({}, base), { elementType: 'multi_select', value: Array.isArray(data.value)
                        ? data.value.map(v => this.paramCoder.decode(v))
                        : [] });
            case 'input':
                return Object.assign(Object.assign({}, base), { value: data.value });
            case 'date_picker':
                return Object.assign(Object.assign({}, base), { value: data.value });
            default:
                throw new Error(`Unknown element_type: ${elementType}`);
        }
    }
    encode(data) {
        const base = super.encode(data);
        const { elementType } = data;
        switch (elementType) {
            case 'select':
                return Object.assign(Object.assign({}, base), { element_type: 'select', value: this.paramCoder.encode(data.value) });
            case 'multi_select':
                return Object.assign(Object.assign({}, base), { element_type: 'multi_select', value: data.value.map(v => this.paramCoder.encode(v)) });
            case 'input':
                return Object.assign(Object.assign({}, base), { element_type: 'input', value: data.value });
            case 'date_picker':
                return Object.assign(Object.assign({}, base), { element_type: 'date_picker', value: data.value });
            default:
                throw new Error(`Unknown elementType: ${elementType}`);
        }
    }
}
exports.AdaptyUiOnboardingStateUpdatedActionCoder = AdaptyUiOnboardingStateUpdatedActionCoder;
//# sourceMappingURL=adapty-ui-onboarding-state-updated-action.js.map