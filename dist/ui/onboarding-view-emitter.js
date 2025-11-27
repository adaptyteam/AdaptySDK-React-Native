"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingViewEmitter = void 0;
const bridge_1 = require("../bridge");
// Emitting view ID is passed in JSON["_view_id"]
// So that no all visible views would emit this event
// Must be in every callback response in the form of UUID string
// const KEY_VIEW = 'view_id';
/**
 * OnboardingViewEmitter manages event handlers for onboarding view events.
 * Each event type can have only one handler - new handlers replace existing ones.
 *
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
class OnboardingViewEmitter {
    constructor(viewId) {
        this.eventListeners = new Map();
        this.handlers = new Map();
        this.viewId = viewId;
    }
    addListener(event, callback, onRequestClose) {
        const viewId = this.viewId;
        const config = HANDLER_TO_EVENT_CONFIG[event];
        if (!config) {
            throw new Error(`No event config found for handler: ${event}`);
        }
        // Replace existing handler for this event type
        this.handlers.set(event, {
            handler: callback,
            config,
            onRequestClose,
        });
        if (!this.eventListeners.has(config.nativeEvent)) {
            const handlers = this.handlers; // Capture the reference
            const subscription = bridge_1.$bridge.addEventListener(config.nativeEvent, function () {
                var _a, _b;
                const eventViewId = (_b = (_a = this.rawValue['view']) === null || _a === void 0 ? void 0 : _a['id']) !== null && _b !== void 0 ? _b : null;
                if (viewId !== eventViewId) {
                    return;
                }
                // Get all possible handler names for this native event
                const possibleHandlers = NATIVE_EVENT_TO_HANDLERS[config.nativeEvent] || [];
                for (const handlerName of possibleHandlers) {
                    const handlerData = handlers.get(handlerName);
                    if (!handlerData) {
                        continue; // Handler not registered for this view
                    }
                    const { handler, onRequestClose } = handlerData;
                    const callbackArgs = extractCallbackArgs(handlerName, this.rawValue);
                    const cb = handler;
                    const shouldClose = cb.apply(null, callbackArgs);
                    if (shouldClose) {
                        onRequestClose().catch(() => {
                            // Ignore errors from onRequestClose to avoid breaking event handling
                        });
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
exports.OnboardingViewEmitter = OnboardingViewEmitter;
const ONBOARDING_EVENT_MAPPINGS = {
    onboarding_on_close_action: [
        {
            handlerName: 'onClose',
        },
    ],
    onboarding_on_custom_action: [
        {
            handlerName: 'onCustom',
        },
    ],
    onboarding_on_paywall_action: [
        {
            handlerName: 'onPaywall',
        },
    ],
    onboarding_on_state_updated_action: [
        {
            handlerName: 'onStateUpdated',
        },
    ],
    onboarding_did_finish_loading: [
        {
            handlerName: 'onFinishedLoading',
        },
    ],
    onboarding_on_analytics_action: [
        {
            handlerName: 'onAnalytics',
        },
    ],
    onboarding_did_fail_with_error: [
        {
            handlerName: 'onError',
        },
    ],
};
const HANDLER_TO_EVENT_CONFIG = Object.entries(ONBOARDING_EVENT_MAPPINGS).reduce((acc, [nativeEvent, mappings]) => {
    mappings.forEach(({ handlerName }) => {
        acc[handlerName] = {
            nativeEvent,
            handlerName,
        };
    });
    return acc;
}, {});
// Reverse mapping: nativeEvent -> EventName[]
const NATIVE_EVENT_TO_HANDLERS = Object.entries(HANDLER_TO_EVENT_CONFIG).reduce((acc, [handlerName, config]) => {
    if (!acc[config.nativeEvent]) {
        acc[config.nativeEvent] = [];
    }
    const handlers = acc[config.nativeEvent];
    if (handlers) {
        handlers.push(handlerName);
    }
    return acc;
}, {});
function extractCallbackArgs(handlerName, eventArg) {
    const actionId = eventArg['id'] || '';
    const meta = eventArg['meta'] || {};
    const event = eventArg['event'] || {};
    const action = eventArg['action'] || {};
    switch (handlerName) {
        case 'onClose':
        case 'onCustom':
        case 'onPaywall':
            return [actionId, meta];
        case 'onStateUpdated':
            return [action.element_id ? action : { element_id: actionId }, meta];
        case 'onFinishedLoading':
            return [meta];
        case 'onAnalytics':
            return [event, meta];
        case 'onError':
            return [eventArg['error']];
        default:
            return [];
    }
}
//# sourceMappingURL=onboarding-view-emitter.js.map