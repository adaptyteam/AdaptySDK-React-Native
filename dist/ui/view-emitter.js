"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewEmitter = void 0;
const bridge_1 = require("../bridge");
const logger_1 = require("../logger");
const core_1 = require("@adapty/core");
// Emitting view ID is passed in JSON["_view_id"]
// So that no all visible views would emit this event
// Must be in every callback response in the form of UUID string
// const KEY_VIEW = 'view_id';
/**
 * ViewEmitter manages event handlers for paywall view events.
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
class ViewEmitter {
    constructor(viewId) {
        this.eventListeners = new Map();
        this.handlers = new Map();
        this.internalHandlers = new Map();
        this.viewId = viewId;
    }
    addListener(event, callback, onRequestClose) {
        const nativeEvent = core_1.HANDLER_TO_NATIVE_EVENT[event];
        if (!nativeEvent) {
            throw new Error(`No native event mapping found for handler: ${event}`);
        }
        // Replace existing handler for this event type
        this.handlers.set(event, {
            handler: callback,
            onRequestClose,
        });
        // If no subscription to native event exists - create one
        if (!this.eventListeners.has(nativeEvent)) {
            const subscription = bridge_1.$bridge.addEventListener(nativeEvent, this.createEventHandler(nativeEvent));
            this.eventListeners.set(nativeEvent, subscription);
        }
        return this.eventListeners.get(nativeEvent);
    }
    /**
     * Adds an internal event handler.
     * Internal handlers:
     * - Are called AFTER client handlers
     * - Do NOT return boolean (don't affect auto-dismiss)
     * - Are used for internal SDK logic (e.g., cleanup)
     * @internal
     */
    addInternalListener(event, callback) {
        const nativeEvent = core_1.HANDLER_TO_NATIVE_EVENT[event];
        if (!nativeEvent) {
            throw new Error(`No native event mapping found for handler: ${event}`);
        }
        // Replace existing internal handler for this event
        this.internalHandlers.set(event, {
            handler: callback,
        });
        // If no subscription to native event exists - create one
        if (!this.eventListeners.has(nativeEvent)) {
            const subscription = bridge_1.$bridge.addEventListener(nativeEvent, this.createEventHandler(nativeEvent));
            this.eventListeners.set(nativeEvent, subscription);
        }
    }
    createEventHandler(nativeEvent) {
        return (parsedEvent) => {
            if (!parsedEvent) {
                return;
            }
            const eventViewId = parsedEvent.view.id;
            if (eventViewId !== this.viewId) {
                return; // Event for different view
            }
            const ctx = new logger_1.LogContext();
            const log = ctx.event({ methodName: nativeEvent });
            log.start(() => ({ viewId: eventViewId, eventId: parsedEvent.id }));
            // Resolve handler name from event
            const resolver = core_1.NATIVE_EVENT_RESOLVER[nativeEvent];
            if (!resolver) {
                log.failed(() => ({ reason: 'no_resolver', nativeEvent }));
                return;
            }
            const resolvedHandler = resolver(parsedEvent);
            if (!resolvedHandler) {
                // Event doesn't match any handler (e.g., unknown action type)
                return;
            }
            // TypeScript doesn't narrow the type after the null check, so we assert it
            const handlerName = resolvedHandler;
            let hasError = false;
            // 1. Client handlers
            const handlerData = this.handlers.get(handlerName);
            if (handlerData) {
                const { handler, onRequestClose } = handlerData;
                const callbackArgs = (0, core_1.extractPaywallCallbackArgs)(handlerName, parsedEvent);
                const callback = handler;
                try {
                    const shouldClose = callback(...callbackArgs);
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
                catch (error) {
                    hasError = true;
                    log.failed(() => ({
                        error,
                        handlerName,
                        viewId: eventViewId,
                        eventId: parsedEvent.id,
                        reason: 'handler_error',
                    }));
                }
            }
            // 2. Internal handlers
            const internalHandlerData = this.internalHandlers.get(handlerName);
            if (internalHandlerData) {
                try {
                    internalHandlerData.handler(parsedEvent);
                }
                catch (error) {
                    hasError = true;
                    log.failed(() => ({
                        error,
                        handlerName: `${handlerName} (internal)`,
                        viewId: eventViewId,
                        eventId: parsedEvent.id,
                        reason: 'internal_handler_failed',
                    }));
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
        this.internalHandlers.clear();
    }
}
exports.ViewEmitter = ViewEmitter;
//# sourceMappingURL=view-emitter.js.map