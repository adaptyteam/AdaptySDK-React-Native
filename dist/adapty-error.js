"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyError = void 0;
const error_1 = require("./types/error");
class AdaptyError extends Error {
    constructor(input) {
        super(AdaptyError.getMessage(input));
        this.adaptyCode = input.adaptyCode;
        this.localizedDescription = input.message;
        this.detail = input.detail;
        if (AdaptyError.middleware) {
            AdaptyError.middleware(this);
        }
    }
    static set onError(callback) {
        AdaptyError.middleware = callback;
    }
    static failedToDecodeNativeError(message, error) {
        return new AdaptyError({
            adaptyCode: 0,
            message: message,
            detail: JSON.stringify(error),
        });
    }
    static failedToEncode(message) {
        return new AdaptyError({
            adaptyCode: 2009,
            message: message,
        });
    }
    static failedToDecode(message) {
        return new AdaptyError({
            adaptyCode: 2006,
            message: message,
        });
    }
    static getMessage(input) {
        const code = input.adaptyCode;
        const codeText = error_1.ErrorCode[code];
        let message = `#${code} (${codeText}): ${input.message}`;
        if (AdaptyError.prefix) {
            message = `${AdaptyError.prefix} ${message}`;
        }
        return message;
    }
}
exports.AdaptyError = AdaptyError;
// Custom prefix to be shown before log message
AdaptyError.prefix = '';
//# sourceMappingURL=adapty-error.js.map