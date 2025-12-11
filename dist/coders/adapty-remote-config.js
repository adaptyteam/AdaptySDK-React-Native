"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyRemoteConfigCoder = void 0;
const tslib_1 = require("tslib");
const coder_1 = require("./coder");
const json_1 = require("./json");
class AdaptyRemoteConfigCoder extends coder_1.Coder {
    constructor() {
        super(...arguments);
        this.properties = {
            data: {
                key: 'data',
                required: true,
                type: 'string',
                converter: new json_1.JSONCoder(),
            },
            lang: {
                key: 'lang',
                required: true,
                type: 'string',
            },
        };
    }
    decode(data) {
        const codablePart = super.decode(data);
        const dataString = JSON.stringify(codablePart.data);
        return Object.assign(Object.assign({}, codablePart), { dataString: dataString.length < 4 ? '' : dataString });
    }
    encode(data) {
        const { dataString } = data, codablePart = tslib_1.__rest(data, ["dataString"]);
        return super.encode(codablePart);
    }
}
exports.AdaptyRemoteConfigCoder = AdaptyRemoteConfigCoder;
//# sourceMappingURL=adapty-remote-config.js.map