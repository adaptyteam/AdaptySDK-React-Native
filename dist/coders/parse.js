"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommonEvent = exports.parseMethodResult = void 0;
const core_1 = require("@adapty/core");
const factory_1 = require("./factory");
const parseMethodResult = (input, resultType, ctx) => (0, core_1.parseMethodResult)(factory_1.coderFactory, input, resultType, ctx);
exports.parseMethodResult = parseMethodResult;
const parseCommonEvent = (event, input, ctx) => (0, core_1.parseCommonEvent)(factory_1.coderFactory, event, input, ctx);
exports.parseCommonEvent = parseCommonEvent;
//# sourceMappingURL=parse.js.map