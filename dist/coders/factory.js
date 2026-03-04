"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coderFactory = void 0;
const core_1 = require("@adapty/core");
const adapters_1 = require("../adapters");
/**
 * Singleton instance of CoderFactory for React Native SDK
 * Initialized with React Native platform and SDK metadata adapters
 */
exports.coderFactory = new core_1.CoderFactory({
    platform: new adapters_1.ReactNativePlatformAdapter(),
    sdkMetadata: new adapters_1.ReactNativeSdkMetadataAdapter(),
});
//# sourceMappingURL=factory.js.map