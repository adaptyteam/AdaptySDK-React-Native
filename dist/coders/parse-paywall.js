"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaywallEvent = void 0;
const core_1 = require("@adapty/core");
const factory_1 = require("./factory");
const parsePaywallEvent = (input, ctx) => (0, core_1.parsePaywallEvent)(factory_1.coderFactory, input, ctx);
exports.parsePaywallEvent = parsePaywallEvent;
//# sourceMappingURL=parse-paywall.js.map