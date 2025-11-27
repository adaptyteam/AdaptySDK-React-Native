"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$bridge = exports.initBridge = exports.MODULE_NAME = void 0;
const native_request_handler_1 = require("./native-request-handler");
const mock_1 = require("./mock");
/**
 * Name of bridge package
 * React Native looks for a module with provided name
 * via NativeModules API
 *
 * Must be the same as string:
 * - iOS: RNAdapty.m & RNAdapty.swift. Also match in RCT_EXTERN_MODULE
 * - Android: AdaptyReactModule.kt (getName)
 */
exports.MODULE_NAME = 'RNAdapty';
/**
 * Internal bridge handler - can be either Native or Mock depending on configuration
 */
let _bridge = null;
/**
 * Initialize bridge with either native or mock handler
 * @param enableMock - Whether to use mock mode
 * @param mockConfig - Configuration for mock mode
 */
function initBridge(enableMock = false, mockConfig) {
    if (enableMock) {
        _bridge = new mock_1.MockRequestHandler(mockConfig);
    }
    else {
        _bridge = new native_request_handler_1.NativeRequestHandler(exports.MODULE_NAME);
    }
}
exports.initBridge = initBridge;
/**
 * Bridge handler - automatically initializes with native handler if not yet initialized
 * For mock mode, call initBridge(true) in activate() before using
 */
exports.$bridge = {
    get request() {
        if (!_bridge)
            initBridge(false);
        return _bridge.request.bind(_bridge);
    },
    addEventListener(event, cb) {
        if (!_bridge)
            initBridge(false);
        return _bridge.addEventListener(event, cb);
    },
    addRawEventListener(event, cb) {
        if (!_bridge)
            initBridge(false);
        return _bridge.addRawEventListener(event, cb);
    },
    removeAllEventListeners() {
        if (!_bridge)
            initBridge(false);
        return _bridge.removeAllEventListeners();
    },
};
//# sourceMappingURL=bridge.js.map