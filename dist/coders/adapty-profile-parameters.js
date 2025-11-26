"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyProfileParametersCoder = void 0;
const coder_1 = require("./coder");
class AdaptyProfileParametersCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            firstName: { key: 'first_name', required: false, type: 'string' },
            lastName: { key: 'last_name', required: false, type: 'string' },
            gender: { key: 'gender', required: false, type: 'string' },
            birthday: { key: 'birthday', required: false, type: 'string' },
            email: { key: 'email', required: false, type: 'string' },
            phoneNumber: { key: 'phone_number', required: false, type: 'string' },
            appTrackingTransparencyStatus: {
                key: 'att_status',
                required: false,
                type: 'number',
            },
            codableCustomAttributes: {
                key: 'custom_attributes',
                required: false,
                type: 'object',
            },
            analyticsDisabled: {
                key: 'analytics_disabled',
                required: false,
                type: 'boolean',
            },
        };
    }
}
exports.AdaptyProfileParametersCoder = AdaptyProfileParametersCoder;
//# sourceMappingURL=adapty-profile-parameters.js.map