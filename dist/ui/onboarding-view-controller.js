"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingViewController = void 0;
const tslib_1 = require("tslib");
const types_1 = require("./types");
const logger_1 = require("../logger");
const adapty_onboarding_1 = require("../coders/adapty-onboarding");
const bridge_1 = require("../bridge");
const onboarding_view_emitter_1 = require("./onboarding-view-emitter");
/**
 * Provides methods to control created onboarding view
 * @public
 */
class OnboardingViewController {
    /**
     * Intended way to create an OnboardingViewController instance.
     * It prepares a native controller to be presented
     * and creates reference between native controller and JS instance
     * @internal
     */
    static create(onboarding) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'createOnboardingView' });
            log.start({ onboarding });
            const view = new OnboardingViewController();
            const coder = new adapty_onboarding_1.AdaptyOnboardingCoder();
            const methodKey = 'adapty_ui_create_onboarding_view';
            const data = {
                method: methodKey,
                onboarding: coder.encode(onboarding),
            };
            const body = JSON.stringify(data);
            const result = yield view.handle(methodKey, body, 'AdaptyUiView', ctx, log);
            view.id = result.id;
            return view;
        });
    }
    /**
     * Since constructors in JS cannot be async, it is not
     * preferred to create OnboardingViewControllers in direct way.
     * Consider using @link{OnboardingViewController.create} instead
     *
     * @remarks
     * Creating OnboardingViewController this way does not let you
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
     * Presents an onboarding view as a full-screen modal
     *
     * @remarks
     * Calling `present` upon already visible onboarding view
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
            const methodKey = 'adapty_ui_present_onboarding_view';
            const body = JSON.stringify({
                method: methodKey,
                id: this.id,
            });
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Dismisses an onboarding view
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
            const methodKey = 'adapty_ui_dismiss_onboarding_view';
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
     * Creates a set of specific view event listeners
     *
     * @remarks
     * It registers only requested set of event handlers.
     * Your config is assigned into event listeners {@link DEFAULT_ONBOARDING_EVENT_HANDLERS},
     * that handle default closing behavior.
     * - `onClose`
     *
     * @param {Partial<OnboardingEventHandlers>} [eventHandlers] - set of event handling callbacks
     * @returns {() => void} unsubscribe - function to unsubscribe all listeners
     */
    registerEventHandlers(eventHandlers = types_1.DEFAULT_ONBOARDING_EVENT_HANDLERS) {
        const ctx = new logger_1.LogContext();
        const log = ctx.call({ methodName: 'registerEventHandlers' });
        log.start({ _id: this.id });
        if (this.id === null) {
            throw this.errNoViewReference();
        }
        const finalEventHandlers = Object.assign(Object.assign({}, types_1.DEFAULT_ONBOARDING_EVENT_HANDLERS), eventHandlers);
        // DIY way to tell TS that original arg should not be used
        const deprecateVar = (_target) => true;
        if (!deprecateVar(eventHandlers)) {
            return () => { };
        }
        const viewEmitter = new onboarding_view_emitter_1.OnboardingViewEmitter(this.id);
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
exports.OnboardingViewController = OnboardingViewController;
//# sourceMappingURL=onboarding-view-controller.js.map