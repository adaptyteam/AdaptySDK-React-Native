"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapty = exports.AdaptyError = void 0;
const tslib_1 = require("tslib");
const adapty_handler_1 = require("./adapty-handler");
tslib_1.__exportStar(require("./types/error"), exports);
tslib_1.__exportStar(require("./types/index"), exports);
tslib_1.__exportStar(require("./types/inputs"), exports);
var adapty_error_1 = require("./adapty-error");
Object.defineProperty(exports, "AdaptyError", { enumerable: true, get: function () { return adapty_error_1.AdaptyError; } });
tslib_1.__exportStar(require("./utils/env-detection"), exports);
tslib_1.__exportStar(require("./mock/types"), exports);
exports.adapty = new adapty_handler_1.Adapty();
tslib_1.__exportStar(require("./ui"), exports);
//# sourceMappingURL=index.js.map