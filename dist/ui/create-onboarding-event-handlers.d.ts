import { OnboardingEventHandlers } from './types';
/**
 * Creates and configures event handlers for an onboarding view without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
export declare function createOnboardingEventHandlers(eventHandlers: Partial<OnboardingEventHandlers>, viewId: string, onRequestClose?: () => Promise<void>): () => void;
//# sourceMappingURL=create-onboarding-event-handlers.d.ts.map