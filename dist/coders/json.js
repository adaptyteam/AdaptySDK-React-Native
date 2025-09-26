"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONCoder = void 0;
class JSONCoder {
    decode(input) {
        if (!input) {
            return {};
        }
        return JSON.parse(input);
    }
    encode(value) {
        if (Object.keys(value).length === 0) {
            return '';
        }
        return JSON.stringify(value);
    }
}
exports.JSONCoder = JSONCoder;
//# sourceMappingURL=json.js.map