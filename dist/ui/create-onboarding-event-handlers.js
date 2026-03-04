"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOnboardingEventHandlers = void 0;
const tslib_1 = require("tslib");
const onboarding_view_emitter_1 = require("./onboarding-view-emitter");
const types_1 = require("./types");
/**
 * Creates and configures event handlers for an onboarding view without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
function createOnboardingEventHandlers(eventHandlers, viewId, onRequestClose) {
    const finalEventHandlers = Object.assign(Object.assign({}, types_1.DEFAULT_ONBOARDING_EVENT_HANDLERS), eventHandlers);
    const requestClose = onRequestClose !== null && onRequestClose !== void 0 ? onRequestClose : (() => tslib_1.__awaiter(this, void 0, void 0, function* () { }));
    const viewEmitter = new onboarding_view_emitter_1.OnboardingViewEmitter(viewId);
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
exports.createOnboardingEventHandlers = createOnboardingEventHandlers;
//# sourceMappingURL=create-onboarding-event-handlers.js.map