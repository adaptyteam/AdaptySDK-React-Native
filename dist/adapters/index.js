"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactNativeSdkMetadataAdapter = exports.ReactNativePlatformAdapter = void 0;
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const version_1 = tslib_1.__importDefault(require("../version"));
/**
 * React Native implementation of IPlatformAdapter
 * Wraps Platform.OS from react-native
 */
class ReactNativePlatformAdapter {
    get OS() {
        const os = react_native_1.Platform.OS;
        if (os === 'ios' || os === 'android') {
            return os;
        }
        if (os === 'web') {
            return 'web';
        }
        return 'unknown';
    }
}
exports.ReactNativePlatformAdapter = ReactNativePlatformAdapter;
/**
 * React Native implementation of ISdkMetadataAdapter
 * Provides SDK name and version metadata
 */
class ReactNativeSdkMetadataAdapter {
    get sdkName() {
        return 'react-native';
    }
    get sdkVersion() {
        return version_1.default;
    }
}
exports.ReactNativeSdkMetadataAdapter = ReactNativeSdkMetadataAdapter;
//# sourceMappingURL=index.js.map