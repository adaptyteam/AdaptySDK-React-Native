import { AdaptyIOSPresentationStyle, OnboardingEventHandlers } from './types';
/**
 * Set onboarding view event handlers without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
export declare function setEventHandlers(eventHandlers: Partial<OnboardingEventHandlers>, viewId: string, onRequestClose?: () => Promise<void>): () => void;
/**
 * Provides methods to control created onboarding view
 * @public
 */
export declare class OnboardingViewController {
    private id;
    private unsubscribeAllListeners;
    private onRequestClose;
    private handle;
    /**
     * Presents an onboarding view as a modal
     *
     * @param {Object} options - Presentation options
     * @param {AdaptyIOSPresentationStyle} [options.iosPresentationStyle] - iOS presentation style.
     * Available options: 'full_screen' (default) or 'page_sheet'.
     * Only affects iOS platform.
     *
     * @remarks
     * Calling `present` upon already visible onboarding view
     * would result in an error
     *
     * @throws {AdaptyError}
     */
    present(options?: {
        iosPresentationStyle?: AdaptyIOSPresentationStyle;
    }): Promise<void>;
    /**
     * Dismisses an onboarding view
     *
     * @throws {AdaptyError}
     */
    dismiss(): Promise<void>;
    /**
     * Sets event handlers for onboarding view events
     *
     * @remarks
     * Each event type can have only one handler — new handlers replace existing ones.
     * Your config is merged with {@link DEFAULT_ONBOARDING_EVENT_HANDLERS} that provide default closing behavior:
     * - `onClose` - closes onboarding view (returns `true`)
     *
     * If you want to override these listeners, we strongly recommend to return the same value as the default implementation
     * from your custom listener to retain default behavior.
     *
     * **Important**: Calling this method multiple times will re-register ALL event handlers (both default and provided ones),
     * not just the ones you pass. This means all previous event listeners will be replaced with the new merged set.
     *
     * @param {Partial<OnboardingEventHandlers>} [eventHandlers] - set of event handling callbacks
     * @returns {() => void} unsubscribe - function to unsubscribe all listeners
     */
    setEventHandlers(eventHandlers?: Partial<OnboardingEventHandlers>): () => void;
    private errNoViewReference;
}
//# sourceMappingURL=onboarding-view-controller.d.ts.map