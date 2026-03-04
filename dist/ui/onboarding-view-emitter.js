"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingViewEmitter = void 0;
const bridge_1 = require("../bridge");
const logger_1 = require("../logger");
const core_1 = require("@adapty/core");
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
        const config = core_1.HANDLER_TO_EVENT_CONFIG[event];
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
            const subscription = bridge_1.$bridge.addEventListener(config.nativeEvent, this.createEventHandler(config));
            this.eventListeners.set(config.nativeEvent, subscription);
        }
        return this.eventListeners.get(config.nativeEvent);
    }
    createEventHandler(config) {
        return (parsedEvent) => {
            const eventViewId = parsedEvent.view.id;
            if (this.viewId !== eventViewId) {
                return;
            }
            const ctx = new logger_1.LogContext();
            const log = ctx.event({ methodName: config.nativeEvent });
            log.start(() => ({ viewId: eventViewId, eventId: parsedEvent.id }));
            // Get all possible handler names for this native event
            const possibleHandlers = core_1.NATIVE_EVENT_TO_HANDLERS[config.nativeEvent] || [];
            let hasError = false;
            for (const handlerName of possibleHandlers) {
                const handlerData = this.handlers.get(handlerName);
                if (!handlerData) {
                    continue; // Handler not registered for this view
                }
                const { handler, onRequestClose } = handlerData;
                const callbackArgs = (0, core_1.extractOnboardingCallbackArgs)(handlerName, parsedEvent);
                const callback = handler;
                let shouldClose = false;
                try {
                    shouldClose = callback(...callbackArgs);
                }
                catch (error) {
                    hasError = true;
                    shouldClose = true;
                    log.failed(() => ({
                        error,
                        handlerName,
                        viewId: eventViewId,
                        eventId: parsedEvent.id,
                        reason: 'user_handler_failed',
                    }));
                }
                if (shouldClose) {
                    onRequestClose().catch(error => {
                        log.failed(() => ({
                            error,
                            handlerName,
                            viewId: eventViewId,
                            eventId: parsedEvent.id,
                            reason: 'on_request_close_failed',
                        }));
                    });
                }
            }
            if (!hasError) {
                log.success(() => ({ viewId: eventViewId, eventId: parsedEvent.id }));
            }
        };
    }
    removeAllListeners() {
        this.eventListeners.forEach(subscription => subscription.remove());
        this.eventListeners.clear();
        this.handlers.clear();
    }
}
exports.OnboardingViewEmitter = OnboardingViewEmitter;
//# sourceMappingURL=onboarding-view-emitter.js.map