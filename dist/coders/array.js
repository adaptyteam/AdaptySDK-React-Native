"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayCoder = void 0;
// Coder for Array<T>
class ArrayCoder {
    constructor(coder) {
        this.coder = new coder();
    }
    decode(input) {
        const result = [];
        input.forEach(value => {
            result.push(this.coder.decode(value));
        });
        return result;
    }
    encode(value) {
        const result = [];
        value.forEach(model => {
            result.push(this.coder.encode(model));
        });
        return result;
    }
}
exports.ArrayCoder = ArrayCoder;
//# sourceMappingURL=array.js.map