import { EventHandlers } from './types';
/**
 * Creates and configures event handlers for a paywall view without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
export declare function createPaywallEventHandlers(eventHandlers: Partial<EventHandlers>, viewId: string, onRequestClose?: () => Promise<void>): () => void;
//# sourceMappingURL=create-paywall-event-handlers.d.ts.map