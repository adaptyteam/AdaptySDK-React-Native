"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewController = void 0;
const tslib_1 = require("tslib");
const view_emitter_1 = require("./view-emitter");
const react_native_1 = require("react-native");
const types_1 = require("./types");
const logger_1 = require("../logger");
const adapty_paywall_1 = require("../coders/adapty-paywall");
const adapty_purchase_params_1 = require("../coders/adapty-purchase-params");
const bridge_1 = require("../bridge");
const adapty_ui_dialog_config_1 = require("../coders/adapty-ui-dialog-config");
/**
 * Provides methods to control created paywall view
 * @public
 */
class ViewController {
    /**
     * Intended way to create a ViewController instance.
     * It prepares a native controller to be presented
     * and creates reference between native controller and JS instance
     * @internal
     */
    static create(paywall, params) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'createPaywallView' });
            log.start({ paywall, params });
            const view = new ViewController();
            const coder = new adapty_paywall_1.AdaptyPaywallCoder();
            const methodKey = 'adapty_ui_create_paywall_view';
            const data = {
                method: methodKey,
                paywall: coder.encode(paywall),
                preload_products: (_a = params.prefetchProducts) !== null && _a !== void 0 ? _a : true,
                load_timeout: ((_b = params.loadTimeoutMs) !== null && _b !== void 0 ? _b : 5000) / 1000,
            };
            if (params.customTags) {
                data['custom_tags'] = params.customTags;
            }
            if (params.customTimers) {
                const convertTimerInfo = (timerInfo) => {
                    const formatDate = (date) => {
                        const pad = (num, digits = 2) => {
                            const str = num.toString();
                            const paddingLength = digits - str.length;
                            return paddingLength > 0 ? '0'.repeat(paddingLength) + str : str;
                        };
                        const year = date.getUTCFullYear();
                        const month = pad(date.getUTCMonth() + 1);
                        const day = pad(date.getUTCDate());
                        const hours = pad(date.getUTCHours());
                        const minutes = pad(date.getUTCMinutes());
                        const seconds = pad(date.getUTCSeconds());
                        const millis = pad(date.getUTCMilliseconds(), 3);
                        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}Z`;
                    };
                    const result = {};
                    for (const key in timerInfo) {
                        if (timerInfo.hasOwnProperty(key)) {
                            const date = timerInfo[key];
                            if (date instanceof Date) {
                                result[key] = formatDate(date);
                            }
                        }
                    }
                    return result;
                };
                data['custom_timers'] = convertTimerInfo(params.customTimers);
            }
            if (params.customAssets) {
                const argbToHex = (value) => {
                    const hex = value.toString(16).padStart(8, '0');
                    return `#${hex.slice(2)}${hex.slice(0, 2)}`;
                };
                const rgbaToHex = (value) => {
                    return `#${value.toString(16).padStart(8, '0')}`;
                };
                const rgbToHex = (value) => {
                    return `#${value.toString(16).padStart(6, '0')}FF`;
                };
                const extractBase64Data = (input) => {
                    const commaIndex = input.indexOf(',');
                    if (input.startsWith('data:') && commaIndex !== -1) {
                        return input.slice(commaIndex + 1);
                    }
                    return input;
                };
                const getAssetId = (asset) => {
                    if ('relativeAssetPath' in asset) {
                        return react_native_1.Platform.select({
                            ios: asset.relativeAssetPath,
                            android: `${asset.relativeAssetPath}a`,
                        });
                    }
                    if ('fileLocation' in asset) {
                        const fileLocation = asset.fileLocation;
                        return react_native_1.Platform.select({
                            ios: fileLocation.ios.fileName,
                            android: 'relativeAssetPath' in fileLocation.android
                                ? `${fileLocation.android.relativeAssetPath}a`
                                : `${fileLocation.android.rawResName}r`,
                        });
                    }
                    return '';
                };
                const convertAssets = (assets) => {
                    return Object.entries(assets)
                        .map(([id, asset]) => {
                        switch (asset.type) {
                            case 'image':
                                return 'base64' in asset
                                    ? {
                                        id,
                                        type: 'image',
                                        value: extractBase64Data(asset.base64),
                                    }
                                    : {
                                        id,
                                        type: 'image',
                                        asset_id: getAssetId(asset),
                                    };
                            case 'video':
                                return {
                                    id,
                                    type: 'video',
                                    asset_id: getAssetId(asset),
                                };
                            case 'color':
                                let value;
                                if ('argb' in asset) {
                                    value = argbToHex(asset.argb);
                                }
                                else if ('rgba' in asset) {
                                    value = rgbaToHex(asset.rgba);
                                }
                                else if ('rgb' in asset) {
                                    value = rgbToHex(asset.rgb);
                                }
                                else {
                                    return undefined;
                                }
                                return {
                                    id,
                                    type: 'color',
                                    value,
                                };
                            case 'linear-gradient':
                                const { values, points = {} } = asset;
                                const { x0 = 0, y0 = 0, x1 = 1, y1 = 0 } = points;
                                const colorStops = values
                                    .map((_a) => {
                                    var { p } = _a, colorInput = tslib_1.__rest(_a, ["p"]);
                                    let color;
                                    if ('argb' in colorInput) {
                                        color = argbToHex(colorInput.argb);
                                    }
                                    else if ('rgba' in colorInput) {
                                        color = rgbaToHex(colorInput.rgba);
                                    }
                                    else if ('rgb' in colorInput) {
                                        color = rgbToHex(colorInput.rgb);
                                    }
                                    else {
                                        return undefined;
                                    }
                                    return { color, p };
                                })
                                    .filter((v) => v !== undefined);
                                if (colorStops.length !== values.length)
                                    return undefined;
                                return {
                                    id,
                                    type: 'linear-gradient',
                                    values: colorStops,
                                    points: { x0, y0, x1, y1 },
                                };
                            default:
                                return undefined;
                        }
                    })
                        .filter((item) => item !== undefined);
                };
                data['custom_assets'] = convertAssets(params.customAssets);
            }
            if (params.productPurchaseParams) {
                const purchaseParamsCoder = new adapty_purchase_params_1.AdaptyPurchaseParamsCoder();
                data['product_purchase_parameters'] = Object.fromEntries(params.productPurchaseParams.map(({ productId, params }) => [
                    productId.adaptyProductId,
                    purchaseParamsCoder.encode(params),
                ]));
            }
            const body = JSON.stringify(data);
            const result = yield view.handle(methodKey, body, 'AdaptyUiView', ctx, log);
            view.id = result.id;
            return view;
        });
    }
    /**
     * Since constructors in JS cannot be async, it is not
     * preferred to create ViewControllers in direct way.
     * Consider using @link{ViewController.create} instead
     *
     * @remarks
     * Creating ViewController this way does not let you
     * to make native create request and set _id.
     * It is intended to avoid usage
     *
     * @internal
     */
    constructor() {
        this.unsubscribeAllListeners = null;
        this.id = null;
    }
    handle(method, params, resultType, ctx, log) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield bridge_1.$bridge.request(method, params, resultType, ctx);
                log.success(result);
                return result;
            }
            catch (error) {
                /*
                 * Success because error was handled validly
                 * It is a developer task to define which errors must be logged
                 */
                log.success({ error });
                throw error;
            }
        });
    }
    /**
     * Presents a paywall view as a full-screen modal
     *
     * @remarks
     * Calling `present` upon already visible paywall view
     * would result in an error
     *
     * @throws {AdaptyError}
     */
    present() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'present' });
            log.start({ _id: this.id });
            if (this.id === null) {
                log.failed({ error: 'no _id' });
                throw this.errNoViewReference();
            }
            const methodKey = 'adapty_ui_present_paywall_view';
            const body = JSON.stringify({
                method: methodKey,
                id: this.id,
            });
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Dismisses a paywall view
     *
     * @throws {AdaptyError}
     */
    dismiss() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'dismiss' });
            log.start({ _id: this.id });
            if (this.id === null) {
                log.failed({ error: 'no id' });
                throw this.errNoViewReference();
            }
            const methodKey = 'adapty_ui_dismiss_paywall_view';
            const body = JSON.stringify({
                method: methodKey,
                id: this.id,
                destroy: false,
            });
            yield this.handle(methodKey, body, 'Void', ctx, log);
            if (this.unsubscribeAllListeners) {
                this.unsubscribeAllListeners();
            }
        });
    }
    /**
     * Presents the dialog
     *
     * @param {AdaptyUiDialogConfig} config - A config for showing the dialog.
     *
     * @remarks
     * If you provide two actions in the config, be sure `primaryAction` cancels the operation
     * and leaves things unchanged.
     *
     * @returns {Promise<AdaptyUiDialogActionType>} A Promise that resolves to the {@link AdaptyUiDialogActionType} object
     *
     * @throws {AdaptyError}
     */
    showDialog(config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'showDialog' });
            log.start({ _id: this.id });
            if (this.id === null) {
                log.failed({ error: 'no id' });
                throw this.errNoViewReference();
            }
            const coder = new adapty_ui_dialog_config_1.AdaptyUiDialogConfigCoder();
            const methodKey = 'adapty_ui_show_dialog';
            const body = JSON.stringify({
                method: methodKey,
                id: this.id,
                configuration: coder.encode(config),
            });
            return yield this.handle(methodKey, body, 'Void', ctx, log);
        });
    }
    /**
     * Creates a set of specific view event listeners
     *
     * @see {@link https://docs.adapty.io/docs/react-native-handling-events | [DOC] Handling View Events}
     *
     * @remarks
     * It registers only requested set of event handlers.
     * Your config is assigned into five event listeners {@link DEFAULT_EVENT_HANDLERS},
     * that handle default behavior.
     * - `onCloseButtonPress` - closes paywall (returns `true`)
     * - `onAndroidSystemBack` - closes paywall (returns `true`)
     * - `onRestoreCompleted` - closes paywall (returns `true`)
     * - `onPurchaseCompleted` - closes paywall on success (returns `purchaseResult.type !== 'user_cancelled'`)
     * - `onUrlPress` - opens URL and keeps paywall open (returns `false`)
     *
     * If you want to override these listeners, we strongly recommend to return the same value as the default implementation
     * from your custom listener to retain default behavior.
     *
     * @param {Partial<EventHandlers> | undefined} [eventHandlers] - set of event handling callbacks
     * @returns {() => void} unsubscribe - function to unsubscribe all listeners
     */
    registerEventHandlers(eventHandlers = types_1.DEFAULT_EVENT_HANDLERS) {
        const ctx = new logger_1.LogContext();
        const log = ctx.call({ methodName: 'registerEventHandlers' });
        log.start({ _id: this.id });
        if (this.id === null) {
            throw this.errNoViewReference();
        }
        const finalEventHandlers = Object.assign(Object.assign({}, types_1.DEFAULT_EVENT_HANDLERS), eventHandlers);
        // DIY way to tell TS that original arg should not be used
        const deprecateVar = (_target) => true;
        if (!deprecateVar(eventHandlers)) {
            return () => { };
        }
        const viewEmitter = new view_emitter_1.ViewEmitter(this.id);
        Object.keys(finalEventHandlers).forEach(eventStr => {
            const event = eventStr;
            if (!finalEventHandlers.hasOwnProperty(event)) {
                return;
            }
            const handler = finalEventHandlers[event];
            viewEmitter.addListener(event, handler, () => this.dismiss());
        });
        const unsubscribe = () => viewEmitter.removeAllListeners();
        // expose to class to be able to unsubscribe on dismiss
        this.unsubscribeAllListeners = unsubscribe;
        return unsubscribe;
    }
    errNoViewReference() {
        throw new Error('View reference not found');
    }
}
exports.ViewController = ViewController;
//# sourceMappingURL=view-controller.js.map