import { AdaptyIOSPresentationStyle, AdaptyUiDialogActionType, AdaptyUiDialogConfig, CreatePaywallViewParamsInput, EventHandlers } from './types';
export declare const DEFAULT_PARAMS: CreatePaywallViewParamsInput;
/**
 * Provides methods to control created paywall view
 * @public
 */
export declare class ViewController {
    private id;
    private viewEmitter;
    private handle;
    /**
     * Presents a paywall view as a modal
     *
     * @param {Object} options - Presentation options
     * @param {AdaptyIOSPresentationStyle} [options.iosPresentationStyle] - iOS presentation style.
     * Available options: 'full_screen' (default) or 'page_sheet'.
     * Only affects iOS platform.
     *
     * @remarks
     * Calling `present` upon already visible paywall view
     * would result in an error
     *
     * @throws {AdaptyError}
     */
    present(options?: {
        iosPresentationStyle?: AdaptyIOSPresentationStyle;
    }): Promise<void>;
    /**
     * Dismisses a paywall view
     *
     * @throws {AdaptyError}
     */
    dismiss(): Promise<void>;
    /**
     * Presents an alert dialog
     *
     * @param {AdaptyUiDialogConfig} config - A config for showing the dialog.
     *
     * @remarks
     * Use this method instead of RN alert dialogs when paywall view is presented.
     * On Android, built-in RN alerts appear behind the paywall view, making them invisible to users.
     * This method ensures proper dialog presentation above the paywall on all platforms.
     *
     * If you provide two actions in the config, be sure `primaryAction` cancels the operation
     * and leaves things unchanged.
     *
     * @returns {Promise<AdaptyUiDialogActionType>} A Promise that resolves to the {@link AdaptyUiDialogActionType} object
     *
     * @throws {AdaptyError}
     */
    showDialog(config: AdaptyUiDialogConfig): Promise<AdaptyUiDialogActionType>;
    private onRequestClose;
    /**
     * Sets event handlers for paywall view events
     *
     * @see {@link https://adapty.io/docs/react-native-handling-events-1 | [DOC] Handling View Events}
     *
     * @remarks
     * Each event type can have only one handler — new handlers replace existing ones.
     * Default handlers are set during view creation: {@link DEFAULT_EVENT_HANDLERS}
     * - `onCloseButtonPress` - closes paywall (returns `true`)
     * - `onAndroidSystemBack` - closes paywall (returns `true`)
     * - `onRestoreCompleted` - closes paywall (returns `true`)
     * - `onPurchaseCompleted` - closes paywall on success (returns `purchaseResult.type !== 'user_cancelled'`)
     * - `onUrlPress` - opens URL and keeps paywall open (returns `false`)
     *
     * If you want to override these listeners, we strongly recommend to return the same value as the default implementation
     * from your custom listener to retain default behavior.
     *
     * **Important**: Calling this method multiple times will override only the handlers you provide,
     * keeping previously set handlers intact.
     *
     * @param {Partial<EventHandlers>} [eventHandlers] - set of event handling callbacks
     * @returns {() => void} unsubscribe - function to unsubscribe all listeners
     */
    setEventHandlers(eventHandlers?: Partial<EventHandlers>): () => void;
    private errNoViewReference;
}
//# sourceMappingURL=view-controller.d.ts.map