import {
  AdaptyIOSPresentationStyle,
  AdaptyUiDialogActionType,
  AdaptyUiDialogConfig,
  AdaptyUiView,
  CreateFlowViewParamsInput,
  DEFAULT_FLOW_EVENT_HANDLERS,
  FlowEventHandlers,
} from './types';
import { FlowViewEmitter } from './flow-view-emitter';
import { AdaptyFlow } from '@/types';
import { LogContext, LogScope } from '@/logger';
import { coderFactory } from '@/coders/factory';
import { MethodName } from '@/types/bridge';
import { $bridge } from '@/bridge';
import { AdaptyError } from '@/adapty-error';
import { AdaptyType } from '@/coders/parse';
import { Req } from '@/types/schema';

export const DEFAULT_PARAMS: CreateFlowViewParamsInput = {
  prefetchProducts: true,
  loadTimeoutMs: 5000,
  enableSafeArea: true,
};

/**
 * Provides methods to control created flow view
 * @public
 */
export class FlowViewController {
  /**
   * Intended way to create a FlowViewController instance.
   * It prepares a native controller to be presented
   * and creates reference between native controller and JS instance
   * @internal
   */
  static async create(
    flow: AdaptyFlow,
    params: CreateFlowViewParamsInput,
  ): Promise<FlowViewController> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'createFlowView' });
    log.start(() => ({ flow, params }));

    const view = new FlowViewController();

    const flowCoder = coderFactory.createFlowCoder();
    const paramsCoder = coderFactory.createUiCreateFlowViewParamsCoder();
    const methodKey = 'adapty_ui_create_flow_view';

    // Set default values for required parameters
    const paramsWithDefaults: CreateFlowViewParamsInput = {
      ...DEFAULT_PARAMS,
      ...params,
    };

    const data: Req['AdaptyUICreateFlowView.Request'] = {
      method: methodKey,
      flow: flowCoder.encode(flow),
      ...paramsCoder.encode(paramsWithDefaults),
    };
    const body = JSON.stringify(data);

    const result = await view.handle<AdaptyUiView>(
      methodKey,
      body,
      'AdaptyUiView',
      ctx,
      log,
    );

    view.id = result.id;
    view.viewEmitter = new FlowViewEmitter(result.id);

    view.setEventHandlers(DEFAULT_FLOW_EVENT_HANDLERS);

    return view;
  }

  private id: string | null; // reference to a native view. UUID
  private viewEmitter: FlowViewEmitter | null = null;

  /**
   * Since constructors in JS cannot be async, it is not
   * preferred to create ViewControllers in direct way.
   * Consider using @link{FlowViewController.create} instead
   *
   * @remarks
   * Creating FlowViewController this way does not let you
   * to make native create request and set _id.
   * It is intended to avoid usage
   *
   * @internal
   */
  private constructor() {
    this.id = null;
  }

  private async handle<T>(
    method: MethodName,
    params: string,
    resultType: AdaptyType,
    ctx: LogContext,
    log: LogScope,
  ): Promise<T> {
    try {
      const result = await $bridge.request(method, params, resultType, ctx);

      log.success(() => result as Record<string, any>);
      return result as T;
    } catch (error) {
      /*
       * Success because error was handled validly
       * It is a developer task to define which errors must be logged
       */
      log.success(() => ({ error }));
      throw error;
    }
  }

  /**
   * Presents a flow view as a modal
   *
   * @param {Object} options - Presentation options
   * @param {AdaptyIOSPresentationStyle} [options.iosPresentationStyle] - iOS presentation style.
   * Available options: 'full_screen' (default) or 'page_sheet'.
   * Only affects iOS platform.
   *
   * @remarks
   * Calling `present` upon already visible flow view
   * would result in an error
   *
   * @throws {AdaptyError}
   */
  public async present(
    options: { iosPresentationStyle?: AdaptyIOSPresentationStyle } = {},
  ): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'present' });
    log.start(() => ({
      _id: this.id,
      iosPresentationStyle: options.iosPresentationStyle,
    }));

    if (this.id === null) {
      log.failed(() => ({ error: 'no _id' }));
      throw this.errNoViewReference();
    }

    const methodKey = 'adapty_ui_present_flow_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
      ios_presentation_style: options.iosPresentationStyle ?? 'full_screen',
    } satisfies Req['AdaptyUIPresentFlowView.Request']);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);
    return result;
  }

  /**
   * Dismisses a flow view
   *
   * @throws {AdaptyError}
   */
  public async dismiss(): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'dismiss' });
    log.start(() => ({ _id: this.id }));

    if (this.id === null) {
      log.failed(() => ({ error: 'no id' }));
      throw this.errNoViewReference();
    }

    const methodKey = 'adapty_ui_dismiss_flow_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
      destroy: true,
    } satisfies Req['AdaptyUIDismissFlowView.Request']);

    await this.handle<void>(methodKey, body, 'Void', ctx, log);

    if (this.viewEmitter) {
      this.viewEmitter.removeAllListeners();
    }
  }

  /**
   * Presents an alert dialog
   *
   * @param {AdaptyUiDialogConfig} config - A config for showing the dialog.
   *
   * @remarks
   * Use this method instead of RN alert dialogs when flow view is presented.
   * On Android, built-in RN alerts appear behind the flow view, making them invisible to users.
   * This method ensures proper dialog presentation above the flow view on all platforms.
   *
   * If you provide two actions in the config, be sure `primaryAction` cancels the operation
   * and leaves things unchanged.
   *
   * @returns {Promise<AdaptyUiDialogActionType>} A Promise that resolves to the {@link AdaptyUiDialogActionType} object
   *
   * @throws {AdaptyError}
   */
  public async showDialog(
    config: AdaptyUiDialogConfig,
  ): Promise<AdaptyUiDialogActionType> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'showDialog' });
    log.start(() => ({ _id: this.id }));

    if (this.id === null) {
      log.failed(() => ({ error: 'no id' }));
      throw this.errNoViewReference();
    }

    const coder = coderFactory.createUiDialogConfigCoder();
    const methodKey = 'adapty_ui_show_dialog';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
      configuration: coder.encode(config),
    } satisfies Req['AdaptyUIShowDialog.Request']);

    return await this.handle<AdaptyUiDialogActionType>(
      methodKey,
      body,
      'Void',
      ctx,
      log,
    );
  }

  private onRequestClose = async (): Promise<void> => {
    try {
      await this.dismiss();
    } catch (error) {
      // Log error but don't re-throw to avoid breaking event handling
      const ctx = new LogContext();
      const log = ctx.call({ methodName: 'onRequestClose' });
      log.failed(() => ({ error, message: 'Failed to dismiss flow view' }));
    }
  };

  /**
   * Sets event handlers for flow view events
   *
   * @see {@link https://adapty.io/docs/react-native-handling-events-1 | [DOC] Handling View Events}
   *
   * @remarks
   * Each event type can have only one handler — new handlers replace existing ones.
   * Default handlers are set during view creation: {@link DEFAULT_FLOW_EVENT_HANDLERS}
   * - `onCloseButtonPress` - closes the view (returns `true`)
   * - `onAndroidSystemBack` - keeps the view open (returns `false`)
   * - `onRestoreCompleted` - closes the view (returns `true`)
   * - `onError` - closes the view (returns `true`)
   * - `onPurchaseCompleted` - keeps the view open (returns `false`)
   * - `onUrlPress` - opens URL and keeps the view open (returns `false`)
   *
   * If you want to override these listeners, we strongly recommend to return the same value as the default implementation
   * from your custom listener to retain default behavior.
   *
   * **Important**: Calling this method multiple times will override only the handlers you provide,
   * keeping previously set handlers intact.
   *
   * @param {Partial<FlowEventHandlers>} [eventHandlers] - set of event handling callbacks
   * @returns {() => void} unsubscribe - function to unsubscribe all listeners
   */
  public setEventHandlers(
    eventHandlers: Partial<FlowEventHandlers> = {},
  ): () => void {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'setEventHandlers' });
    log.start(() => ({ _id: this.id }));

    if (this.id === null) {
      throw this.errNoViewReference();
    }

    // Create viewEmitter on first call
    if (!this.viewEmitter) {
      this.viewEmitter = new FlowViewEmitter(this.id);
    }

    // Register only provided handlers (they will replace existing ones for same events)
    Object.keys(eventHandlers).forEach(eventStr => {
      const event = eventStr as keyof FlowEventHandlers;
      if (!eventHandlers.hasOwnProperty(event)) {
        return;
      }
      const handler = eventHandlers[
        event
      ] as FlowEventHandlers[keyof FlowEventHandlers];
      this.viewEmitter!.addListener(event, handler, this.onRequestClose);
    });

    return () => this.viewEmitter?.removeAllListeners();
  }

  private errNoViewReference(): AdaptyError {
    throw new Error('View reference not found');
  }
}
