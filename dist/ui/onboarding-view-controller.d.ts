import { OnboardingEventHandlers } from './types';
/**
 * Provides methods to control created onboarding view
 * @public
 */
export declare class OnboardingViewController {
    private id;
    private unsubscribeAllListeners;
    private handle;
    /**
     * Presents an onboarding view as a full-screen modal
     *
     * @remarks
     * Calling `present` upon already visible onboarding view
     * would result in an error
     *
     * @throws {AdaptyError}
     */
    present(): Promise<void>;
    /**
     * Dismisses an onboarding view
     *
     * @throws {AdaptyError}
     */
    dismiss(): Promise<void>;
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
    registerEventHandlers(eventHandlers?: Partial<OnboardingEventHandlers>): () => void;
    private errNoViewReference;
}
//# sourceMappingURL=onboarding-view-controller.d.ts.map