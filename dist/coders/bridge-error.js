"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeErrorCoder = void 0;
const coder_1 = require("./coder");
const adapty_error_1 = require("../adapty-error");
class BridgeErrorCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.type = 'error';
        this.properties = {
            errorType: {
                key: 'error_type',
                required: true,
                type: 'string',
            },
            name: {
                key: 'name',
                required: false,
                type: 'string',
            },
            type: {
                key: 'type',
                required: false,
                type: 'string',
            },
            underlyingError: {
                key: 'parent_error',
                required: false,
                type: 'string',
            },
            description: {
                key: 'description',
                required: false,
                type: 'string',
            },
        };
    }
    getError(data) {
        var _a, _b, _c, _d;
        switch (data.errorType) {
            case 'missingRequiredArgument':
                return new adapty_error_1.AdaptyError({
                    adaptyCode: 3001,
                    message: `Required parameter "${data.name} was not passed to a native module"`,
                });
            case 'typeMismatch':
                return new adapty_error_1.AdaptyError({
                    adaptyCode: 3001,
                    message: `Passed parameter "${data.name}" has invalid type. Expected type: ${data.type}"`,
                });
            case 'encodingFailed':
                return new adapty_error_1.AdaptyError({
                    adaptyCode: 2009,
                    message: `Bridge layer failed to encode response. Bridge error: ${JSON.stringify((_a = data.underlyingError) !== null && _a !== void 0 ? _a : {})}"`,
                });
            case 'wrongParam':
            case 'WRONG_PARAMETER':
                return new adapty_error_1.AdaptyError({
                    adaptyCode: 3001,
                    message: (_b = data.name) !== null && _b !== void 0 ? _b : `Wrong parameter. Bridge error: ${JSON.stringify((_c = data.underlyingError) !== null && _c !== void 0 ? _c : {})}"`,
                });
            case 'methodNotImplemented':
                return new adapty_error_1.AdaptyError({
                    adaptyCode: 2003,
                    message: 'Requested bridge handle not found',
                });
            case 'unsupportedIosVersion':
                return new adapty_error_1.AdaptyError({
                    adaptyCode: 2003,
                    message: 'Unsupported iOS version',
                });
            case 'unexpectedError':
            default:
                return new adapty_error_1.AdaptyError({
                    adaptyCode: 0,
                    message: `Unexpected error occurred: ${JSON.stringify((_d = data.underlyingError) !== null && _d !== void 0 ? _d : {})}`,
                });
        }
    }
}
exports.BridgeErrorCoder = BridgeErrorCoder;
//# sourceMappingURL=bridge-error.js.map