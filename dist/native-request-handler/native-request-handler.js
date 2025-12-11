"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeRequestHandler = void 0;
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const adapty_error_1 = require("../adapty-error");
const logger_1 = require("../logger");
const coders_1 = require("../coders");
const parse_1 = require("../coders/parse");
const KEY_HANDLER_NAME = 'HANDLER';
class NativeRequestHandler {
    constructor(moduleName) {
        this._module = react_native_1.NativeModules[moduleName];
        if (!this._module) {
            throw new Error('Adapty NativeModule is not defined');
        }
        this._emitter = new react_native_1.NativeEventEmitter(this._module);
        this._listeners = new Set();
        // Handler name is defined in native module
        const constants = this._module.getConstants();
        const handlerName = constants[KEY_HANDLER_NAME];
        if (!handlerName) {
            throw new Error(`Adapty NativeModule does not expose "${KEY_HANDLER_NAME}" constant`);
        }
        this._request = this._module[handlerName];
        if (!this._request) {
            throw new Error('Adapty native handler is not defined');
        }
    }
    request(method, params, resultType, ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const log = ctx === null || ctx === void 0 ? void 0 : ctx.bridge({ methodName: `fetch/${method}` });
            log === null || log === void 0 ? void 0 : log.start({ method, params });
            try {
                const response = yield this._request(method, { args: params });
                const result = (0, coders_1.parseMethodResult)(response, resultType, ctx);
                log === null || log === void 0 ? void 0 : log.success({ response });
                return result;
            }
            catch (error) {
                log === null || log === void 0 ? void 0 : log.success({ error });
                if (typeof error !== 'object' || error === null) {
                    throw adapty_error_1.AdaptyError.failedToDecodeNativeError(`Unexpected native error type. "Expected object", but got "${typeof error}"`, error);
                }
                const errorObj = error;
                if (!errorObj.hasOwnProperty('message') || !errorObj['message']) {
                    throw adapty_error_1.AdaptyError.failedToDecodeNativeError('Native error does not have expected "message" property', error);
                }
                throw errorObj;
            }
        });
    }
    addRawEventListener(event, cb) {
        const subscription = this._emitter.addListener(event, cb);
        this._listeners.add(subscription);
        return subscription;
    }
    addEventListener(event, cb) {
        const consumeNativeCallback = (...data) => {
            const ctx = new logger_1.LogContext();
            const log = ctx.event({ methodName: event });
            log.start(data);
            let rawValue = null;
            const args = data.map(arg => {
                try {
                    const commonEvent = (0, parse_1.parseCommonEvent)(event, arg, ctx);
                    if (commonEvent)
                        return commonEvent;
                    const paywallEvent = (0, parse_1.parsePaywallEvent)(arg, ctx);
                    try {
                        rawValue = JSON.parse(arg);
                    }
                    catch (_a) { }
                    return paywallEvent;
                }
                catch (error) {
                    log.failed({ error });
                    throw error;
                }
            });
            cb.apply({ rawValue }, args);
        };
        const subscription = this._emitter.addListener(event, consumeNativeCallback);
        this._listeners.add(subscription);
        return subscription;
    }
    removeAllEventListeners() {
        var _a, _b;
        (_a = this._listeners) === null || _a === void 0 ? void 0 : _a.forEach(listener => listener.remove());
        (_b = this._listeners) === null || _b === void 0 ? void 0 : _b.clear();
    }
}
exports.NativeRequestHandler = NativeRequestHandler;
//# sourceMappingURL=native-request-handler.js.map