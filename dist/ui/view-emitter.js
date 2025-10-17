"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewEmitter = void 0;
const bridge_1 = require("../bridge");
// Emitting view ID is passed in JSON["_view_id"]
// So that no all visible views would emit this event
// Must be in every callback response in the form of UUID string
// const KEY_VIEW = 'view_id';
/**
 * @remarks
 * View emitter wraps NativeEventEmitter
 * and provides several modifications:
 * - Synthetic type restrictions to avoid misspelling
 * - Safe data deserialization with SDK decoders
 * - Logging emitting and deserialization processes
 * - Filters out events for other views by _id
 *
 * @internal
 */
class ViewEmitter {
    constructor(viewId) {
        this.eventListeners = new Map();
        this.handlers = new Map();
        this.viewId = viewId;
    }
    addListener(event, callback, onRequestClose) {
        var _a;
        const viewId = this.viewId;
        const config = HANDLER_TO_EVENT_CONFIG[event];
        if (!config) {
            throw new Error(`No event config found for handler: ${event}`);
        }
        const handlersForEvent = (_a = this.handlers.get(config.nativeEvent)) !== null && _a !== void 0 ? _a : [];
        handlersForEvent.push({
            handler: callback,
            config,
            onRequestClose,
        });
        this.handlers.set(config.nativeEvent, handlersForEvent);
        if (!this.eventListeners.has(config.nativeEvent)) {
            const handlers = this.handlers; // Capture the reference
            const subscription = bridge_1.$bridge.addEventListener(config.nativeEvent, function (arg) {
                var _a, _b, _c, _d;
                const eventViewId = (_b = (_a = this.rawValue['view']) === null || _a === void 0 ? void 0 : _a['id']) !== null && _b !== void 0 ? _b : null;
                if (viewId !== eventViewId) {
                    return;
                }
                const eventHandlers = (_c = handlers.get(config.nativeEvent)) !== null && _c !== void 0 ? _c : [];
                for (const { handler, config, onRequestClose } of eventHandlers) {
                    if (config.propertyMap &&
                        ((_d = arg['action']) === null || _d === void 0 ? void 0 : _d.type) !== config.propertyMap['action']) {
                        continue;
                    }
                    const callbackArgs = extractCallbackArgs(config.handlerName, arg);
                    const cb = handler;
                    const shouldClose = cb.apply(null, callbackArgs);
                    if (shouldClose) {
                        onRequestClose();
                    }
                }
            });
            this.eventListeners.set(config.nativeEvent, subscription);
        }
        return this.eventListeners.get(config.nativeEvent);
    }
    removeAllListeners() {
        this.eventListeners.forEach(subscription => subscription.remove());
        this.eventListeners.clear();
        this.handlers.clear();
        bridge_1.$bridge.removeAllEventListeners();
    }
}
exports.ViewEmitter = ViewEmitter;
const UI_EVENT_MAPPINGS = {
    paywall_view_did_perform_action: [
        {
            handlerName: 'onCloseButtonPress',
            propertyMap: {
                action: 'close',
            },
        },
        {
            handlerName: 'onAndroidSystemBack',
            propertyMap: {
                action: 'system_back',
            },
        },
        {
            handlerName: 'onUrlPress',
            propertyMap: {
                action: 'open_url',
            },
        },
        {
            handlerName: 'onCustomAction',
            propertyMap: {
                action: 'custom',
            },
        },
    ],
    paywall_view_did_select_product: [{ handlerName: 'onProductSelected' }],
    paywall_view_did_start_purchase: [{ handlerName: 'onPurchaseStarted' }],
    paywall_view_did_finish_purchase: [{ handlerName: 'onPurchaseCompleted' }],
    paywall_view_did_fail_purchase: [{ handlerName: 'onPurchaseFailed' }],
    paywall_view_did_start_restore: [{ handlerName: 'onRestoreStarted' }],
    paywall_view_did_appear: [{ handlerName: 'onPaywallShown' }],
    paywall_view_did_disappear: [{ handlerName: 'onPaywallClosed' }],
    paywall_view_did_finish_web_payment_navigation: [
        { handlerName: 'onWebPaymentNavigationFinished' },
    ],
    paywall_view_did_finish_restore: [{ handlerName: 'onRestoreCompleted' }],
    paywall_view_did_fail_restore: [{ handlerName: 'onRestoreFailed' }],
    paywall_view_did_fail_rendering: [{ handlerName: 'onRenderingFailed' }],
    paywall_view_did_fail_loading_products: [
        { handlerName: 'onLoadingProductsFailed' },
    ],
};
const HANDLER_TO_EVENT_CONFIG = Object.entries(UI_EVENT_MAPPINGS).reduce((acc, [nativeEvent, mappings]) => {
    mappings.forEach(({ handlerName, propertyMap }) => {
        acc[handlerName] = {
            nativeEvent,
            propertyMap,
            handlerName,
        };
    });
    return acc;
}, {});
function extractCallbackArgs(handlerName, eventArg) {
    switch (handlerName) {
        case 'onProductSelected':
            return [eventArg['product_id']];
        case 'onPurchaseStarted':
            return [eventArg['product']];
        case 'onPurchaseCompleted':
            return [eventArg['purchased_result'], eventArg['product']];
        case 'onPurchaseFailed':
            return [eventArg['error'], eventArg['product']];
        case 'onRestoreCompleted':
            return [eventArg['profile']];
        case 'onRestoreFailed':
        case 'onRenderingFailed':
        case 'onLoadingProductsFailed':
            return [eventArg['error']];
        case 'onCustomAction':
        case 'onUrlPress':
            return [eventArg['action'].value];
        case 'onWebPaymentNavigationFinished':
            return [eventArg['product'], eventArg['error']];
        default:
            return [];
    }
}
//# sourceMappingURL=view-emitter.js.map