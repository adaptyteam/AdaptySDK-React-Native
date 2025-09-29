"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyNativeErrorCoder = void 0;
const coder_1 = require("./coder");
const adapty_error_1 = require("../adapty-error");
class AdaptyNativeErrorCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.type = 'error';
        this.properties = {
            adaptyCode: { key: 'adapty_code', required: true, type: 'number' },
            message: { key: 'message', required: true, type: 'string' },
            detail: { key: 'detail', required: false, type: 'string' },
        };
    }
    getError(data) {
        return new adapty_error_1.AdaptyError({
            adaptyCode: data.adaptyCode,
            message: data.message,
            detail: data.detail,
        });
    }
}
exports.AdaptyNativeErrorCoder = AdaptyNativeErrorCoder;
//# sourceMappingURL=adapty-native-error.js.map