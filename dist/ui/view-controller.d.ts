import { AdaptyUiDialogActionType, AdaptyUiDialogConfig, EventHandlers } from './types';
/**
 * Provides methods to control created paywall view
 * @public
 */
export declare class ViewController {
    private id;
    private unsubscribeAllListeners;
    private handle;
    /**
     * Presents a paywall view as a full-screen modal
     *
     * @remarks
     * Calling `present` upon already visible paywall view
     * would result in an error
     *
     * @throws {AdaptyError}
     */
    present(): Promise<void>;
    /**
     * Dismisses a paywall view
     *
     * @throws {AdaptyError}
     */
    dismiss(): Promise<void>;
    /**
     * Presents the dialog
     *
     * @param {AdaptyUiDialogConfig} config - A config for showing the dialog.
     *
     * @remarks
     * If you provide two actions in the config, be sure `primaryAction` cancels the operation
     * and leaves things unchanged.
     *
     * @returns {Promise<AdaptyUiDialogActionType>} A Promise that resolves to the {@link AdaptyUiDialogActionType} object
     *
     * @throws {AdaptyError}
     */
    showDialog(config: AdaptyUiDialogConfig): Promise<AdaptyUiDialogActionType>;
    /**
     * Creates a set of specific view event listeners
     *
     * @see {@link https://docs.adapty.io/docs/react-native-handling-events | [DOC] Handling View Events}
     *
     * @remarks
     * It registers only requested set of event handlers.
     * Your config is assigned into five event listeners {@link DEFAULT_EVENT_HANDLERS},
     * that handle default behavior.
     * - `onCloseButtonPress` - closes paywall (returns `true`)
     * - `onAndroidSystemBack` - closes paywall (returns `true`)
     * - `onRestoreCompleted` - closes paywall (returns `true`)
     * - `onPurchaseCompleted` - closes paywall on success (returns `purchaseResult.type !== 'user_cancelled'`)
     * - `onUrlPress` - opens URL and keeps paywall open (returns `false`)
     *
     * If you want to override these listeners, we strongly recommend to return the same value as the default implementation
     * from your custom listener to retain default behavior.
     *
     * @param {Partial<EventHandlers> | undefined} [eventHandlers] - set of event handling callbacks
     * @returns {() => void} unsubscribe - function to unsubscribe all listeners
     */
    registerEventHandlers(eventHandlers?: Partial<EventHandlers>): () => void;
    private errNoViewReference;
}
//# sourceMappingURL=view-controller.d.ts.map