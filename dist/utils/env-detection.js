"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldEnableMock = exports.isRunningInExpoGo = void 0;
const react_native_1 = require("react-native");
/**
 * Returns a boolean value whether the app is running in Expo Go.
 */
function isRunningInExpoGo() {
    var _a, _b;
    return !!((_b = (_a = globalThis.expo) === null || _a === void 0 ? void 0 : _a.modules) === null || _b === void 0 ? void 0 : _b.ExpoGo);
}
exports.isRunningInExpoGo = isRunningInExpoGo;
/**
 * Determines if mock mode should be enabled.
 * Mock mode is enabled in Expo Go or when running on web platform.
 * This is useful for environments where native modules are not available.
 *
 * @returns {boolean} true if running in Expo Go or on web, false otherwise
 */
function shouldEnableMock() {
    return isRunningInExpoGo() || react_native_1.Platform.OS === 'web';
}
exports.shouldEnableMock = shouldEnableMock;
//# sourceMappingURL=env-detection.js.map