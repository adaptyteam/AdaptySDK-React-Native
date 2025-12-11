"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaywallEventHandlers = void 0;
const tslib_1 = require("tslib");
const view_emitter_1 = require("./view-emitter");
const types_1 = require("./types");
/**
 * Creates and configures event handlers for a paywall view without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
function createPaywallEventHandlers(eventHandlers, viewId, onRequestClose) {
    const finalEventHandlers = Object.assign(Object.assign({}, types_1.DEFAULT_EVENT_HANDLERS), eventHandlers);
    const requestClose = onRequestClose !== null && onRequestClose !== void 0 ? onRequestClose : (() => tslib_1.__awaiter(this, void 0, void 0, function* () { }));
    const viewEmitter = new view_emitter_1.ViewEmitter(viewId);
    Object.keys(finalEventHandlers).forEach(eventStr => {
        const event = eventStr;
        if (!finalEventHandlers.hasOwnProperty(event)) {
            return;
        }
        const handler = finalEventHandlers[event];
        viewEmitter.addListener(event, handler, requestClose);
    });
    return () => viewEmitter.removeAllListeners();
}
exports.createPaywallEventHandlers = createPaywallEventHandlers;
//# sourceMappingURL=create-paywall-event-handlers.js.map