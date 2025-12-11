"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldEnableMock = exports.isRunningInExpoGo = exports.generateId = void 0;
var generate_id_1 = require("./generate-id");
Object.defineProperty(exports, "generateId", { enumerable: true, get: function () { return generate_id_1.generateId; } });
var env_detection_1 = require("./env-detection");
Object.defineProperty(exports, "isRunningInExpoGo", { enumerable: true, get: function () { return env_detection_1.isRunningInExpoGo; } });
Object.defineProperty(exports, "shouldEnableMock", { enumerable: true, get: function () { return env_detection_1.shouldEnableMock; } });
//# sourceMappingURL=index.js.map