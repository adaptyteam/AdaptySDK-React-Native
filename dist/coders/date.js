"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateCoder = void 0;
const adapty_error_1 = require("../adapty-error");
/**
 * Format:    yyyy-MM-dd'T'HH:mm:ss.SSSZ
 * OpenAPI:   Output.Date
 */
class DateCoder {
    decode(input) {
        var _a, _b, _c, _d, _e, _f;
        let pureValue = input;
        if (!input.endsWith('Z')) {
            // React Native seems to have an inconsistent behaviour
            // with dates with timezone offset
            // It is not handled with custom libs like dayjs
            // So we just remove the timezone offset if possible
            // Android SDK returns the following format,
            // that resulted in an invalid date for some customers
            // `2023-02-24T07:16:28.000000+0000`
            // solution is:
            // 1. Replace "+0000" with "Z"
            // 2. Replace microsecs with 0 millisecs
            // with the timezone offset removed
            const dateParts = input.split(/[-T:.Z]/);
            const date = new Date(Date.UTC(parseInt((_a = dateParts[0]) !== null && _a !== void 0 ? _a : '0', 10), parseInt((_b = dateParts[1]) !== null && _b !== void 0 ? _b : '0', 10) - 1, parseInt((_c = dateParts[2]) !== null && _c !== void 0 ? _c : '0', 10), parseInt((_d = dateParts[3]) !== null && _d !== void 0 ? _d : '0', 10), parseInt((_e = dateParts[4]) !== null && _e !== void 0 ? _e : '0', 10), parseInt((_f = dateParts[5]) !== null && _f !== void 0 ? _f : '0', 10)));
            pureValue = date.toISOString();
        }
        const parsedValue = Date.parse(pureValue);
        if (isNaN(parsedValue)) {
            throw adapty_error_1.AdaptyError.failedToDecode(`Failed to decode a date string into JS Date. String value: ${pureValue}`);
        }
        return new Date(parsedValue);
    }
    encode(value) {
        return value.toISOString();
    }
}
exports.DateCoder = DateCoder;
//# sourceMappingURL=date.js.map