"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashmapCoder = void 0;
// Coder for Record<string, T>
class HashmapCoder {
    constructor(coder) {
        this.coder = coder;
    }
    decode(input) {
        const result = {};
        Object.keys(input).forEach(key => {
            var _a, _b;
            const property = input[key];
            result[key] = (_b = (_a = this.coder) === null || _a === void 0 ? void 0 : _a.decode(property)) !== null && _b !== void 0 ? _b : property;
        });
        return result;
    }
    encode(value) {
        const result = {};
        Object.keys(value).forEach(key => {
            var _a, _b;
            const property = value[key];
            result[key] = (_b = (_a = this.coder) === null || _a === void 0 ? void 0 : _a.encode(property)) !== null && _b !== void 0 ? _b : property;
        });
        return result;
    }
}
exports.HashmapCoder = HashmapCoder;
//# sourceMappingURL=hashmap.js.map