"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewController = exports.DEFAULT_PARAMS = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const view_emitter_1 = require("./view-emitter");
const logger_1 = require("../logger");
const adapty_paywall_1 = require("../coders/adapty-paywall");
const coders_1 = require("../coders");
const bridge_1 = require("../bridge");
const adapty_ui_dialog_config_1 = require("../coders/adapty-ui-dialog-config");
exports.DEFAULT_PARAMS = {
    prefetchProducts: true,
    loadTimeoutMs: 5000,
};
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'createPaywallView' });
            log.start({ paywall, params });
            const view = new ViewController();
            const paywallCoder = new adapty_paywall_1.AdaptyPaywallCoder();
            const paramsCoder = new coders_1.AdaptyUICreatePaywallViewParamsCoder();
            const methodKey = 'adapty_ui_create_paywall_view';
            // Set default values for required parameters
            const paramsWithDefaults = Object.assign(Object.assign({}, exports.DEFAULT_PARAMS), params);
            const data = Object.assign({ method: methodKey, paywall: paywallCoder.encode(paywall) }, paramsCoder.encode(paramsWithDefaults));
            const body = JSON.stringify(data);
            const result = yield view.handle(methodKey, body, 'AdaptyUiView', ctx, log);
            view.id = result.id;
            view.setEventHandlers(types_1.DEFAULT_EVENT_HANDLERS);
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
        this.viewEmitter = null;
        this.onRequestClose = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dismiss();
            }
            catch (error) {
                // Log error but don't re-throw to avoid breaking event handling
                const ctx = new logger_1.LogContext();
                const log = ctx.call({ methodName: 'onRequestClose' });
                log.failed({ error, message: 'Failed to dismiss paywall' });
            }
        });
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
     * Presents a paywall view as a modal
     *
     * @param {Object} options - Presentation options
     * @param {AdaptyIOSPresentationStyle} [options.iosPresentationStyle] - iOS presentation style.
     * Available options: 'full_screen' (default) or 'page_sheet'.
     * Only affects iOS platform.
     *
     * @remarks
     * Calling `present` upon already visible paywall view
     * would result in an error
     *
     * @throws {AdaptyError}
     */
    present(options = {}) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'present' });
            log.start({
                _id: this.id,
                iosPresentationStyle: options.iosPresentationStyle,
            });
            if (this.id === null) {
                log.failed({ error: 'no _id' });
                throw this.errNoViewReference();
            }
            const methodKey = 'adapty_ui_present_paywall_view';
            const body = JSON.stringify({
                method: methodKey,
                id: this.id,
                ios_presentation_style: (_a = options.iosPresentationStyle) !== null && _a !== void 0 ? _a : 'full_screen',
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
            if (this.viewEmitter) {
                this.viewEmitter.removeAllListeners();
            }
        });
    }
    /**
     * Presents an alert dialog
     *
     * @param {AdaptyUiDialogConfig} config - A config for showing the dialog.
     *
     * @remarks
     * Use this method instead of RN alert dialogs when paywall view is presented.
     * On Android, built-in RN alerts appear behind the paywall view, making them invisible to users.
     * This method ensures proper dialog presentation above the paywall on all platforms.
     *
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
     * Sets event handlers for paywall view events
     *
     * @see {@link https://adapty.io/docs/react-native-handling-events-1 | [DOC] Handling View Events}
     *
     * @remarks
     * Each event type can have only one handler — new handlers replace existing ones.
     * Default handlers are set during view creation: {@link DEFAULT_EVENT_HANDLERS}
     * - `onCloseButtonPress` - closes paywall (returns `true`)
     * - `onAndroidSystemBack` - closes paywall (returns `true`)
     * - `onRestoreCompleted` - closes paywall (returns `true`)
     * - `onPurchaseCompleted` - closes paywall on success (returns `purchaseResult.type !== 'user_cancelled'`)
     * - `onUrlPress` - opens URL and keeps paywall open (returns `false`)
     *
     * If you want to override these listeners, we strongly recommend to return the same value as the default implementation
     * from your custom listener to retain default behavior.
     *
     * **Important**: Calling this method multiple times will override only the handlers you provide,
     * keeping previously set handlers intact.
     *
     * @param {Partial<EventHandlers>} [eventHandlers] - set of event handling callbacks
     * @returns {() => void} unsubscribe - function to unsubscribe all listeners
     */
    setEventHandlers(eventHandlers = {}) {
        const ctx = new logger_1.LogContext();
        const log = ctx.call({ methodName: 'setEventHandlers' });
        log.start({ _id: this.id });
        if (this.id === null) {
            throw this.errNoViewReference();
        }
        // Create viewEmitter on first call
        if (!this.viewEmitter) {
            this.viewEmitter = new view_emitter_1.ViewEmitter(this.id);
        }
        // Register only provided handlers (they will replace existing ones for same events)
        Object.keys(eventHandlers).forEach(eventStr => {
            const event = eventStr;
            if (!eventHandlers.hasOwnProperty(event)) {
                return;
            }
            const handler = eventHandlers[event];
            this.viewEmitter.addListener(event, handler, this.onRequestClose);
        });
        return () => { var _a; return (_a = this.viewEmitter) === null || _a === void 0 ? void 0 : _a.removeAllListeners(); };
    }
    errNoViewReference() {
        throw new Error('View reference not found');
    }
}
exports.ViewController = ViewController;
//# sourceMappingURL=view-controller.js.map