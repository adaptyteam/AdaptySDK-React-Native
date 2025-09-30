import { ViewEmitter } from './view-emitter';

import {
  AdaptyUiDialogActionType,
  AdaptyUiDialogConfig,
  AdaptyUiView,
  CreatePaywallViewParamsInput,
  DEFAULT_EVENT_HANDLERS,
  EventHandlers,
} from './types';
import { AdaptyPaywall } from '@/types';
import { LogContext, LogScope } from '@/logger';
import { AdaptyPaywallCoder } from '@/coders/adapty-paywall';
import { AdaptyUICreatePaywallViewParamsCoder } from '@/coders';
import { MethodName } from '@/types/bridge';
import { $bridge } from '@/bridge';
import { AdaptyError } from '@/adapty-error';
import { AdaptyType } from '@/coders/parse';
import { Req } from '@/types/schema';
import { AdaptyUiDialogConfigCoder } from '@/coders/adapty-ui-dialog-config';

export const DEFAULT_PARAMS: CreatePaywallViewParamsInput = {
  prefetchProducts: true,
  loadTimeoutMs: 5000,
};

/**
 * Register paywall view event handlers without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @public
 */
export function setEventHandlers(
  eventHandlers: Partial<EventHandlers>,
  viewId: string,
  onRequestClose?: () => Promise<void>,
): () => void {
  const finalEventHandlers: Partial<EventHandlers> = {
    ...DEFAULT_EVENT_HANDLERS,
    ...eventHandlers,
  };

  const requestClose: () => Promise<void> = onRequestClose ?? (async () => {});
  const viewEmitter = new ViewEmitter(viewId);

  Object.keys(finalEventHandlers).forEach(eventStr => {
    const event = eventStr as keyof EventHandlers;
    if (!finalEventHandlers.hasOwnProperty(event)) {
      return;
    }
    const handler = finalEventHandlers[
      event
    ] as EventHandlers[keyof EventHandlers];
    viewEmitter.addListener(event, handler, requestClose);
  });

  return () => viewEmitter.removeAllListeners();
}

/**
 * Provides methods to control created paywall view
 * @public
 */
export class ViewController {
  /**
   * Intended way to create a ViewController instance.
   * It prepares a native controller to be presented
   * and creates reference between native controller and JS instance
   * @internal
   */
  static async create(
    paywall: AdaptyPaywall,
    params: CreatePaywallViewParamsInput,
  ): Promise<ViewController> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'createPaywallView' });
    log.start({ paywall, params });

    const view = new ViewController();

    const paywallCoder = new AdaptyPaywallCoder();
    const paramsCoder = new AdaptyUICreatePaywallViewParamsCoder();
    const methodKey = 'adapty_ui_create_paywall_view';

    // Set default values for required parameters
    const paramsWithDefaults: CreatePaywallViewParamsInput = {
      ...DEFAULT_PARAMS,
      ...params,
    };

    const data: Req['AdaptyUICreatePaywallView.Request'] = {
      method: methodKey,
      paywall: paywallCoder.encode(paywall),
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

    view.setEventHandlers(DEFAULT_EVENT_HANDLERS);

    return view;
  }

  private id: string | null; // reference to a native view. UUID
  private unsubscribeAllListeners: null | (() => void) = null;

  /**
   * Since constructors in JS cannot be async, it is not
   * preferred to create ViewControllers in direct way.
   * Consider using @link{ViewController.create} instead
   *
   * @remarks
   * Creating ViewController this way does not let you
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

      log.success(result);
      return result as T;
    } catch (error) {
      /*
       * Success because error was handled validly
       * It is a developer task to define which errors must be logged
       */
      log.success({ error });
      throw error;
    }
  }

  /**
   * Presents a paywall view as a full-screen modal
   *
   * @remarks
   * Calling `present` upon already visible paywall view
   * would result in an error
   *
   * @throws {AdaptyError}
   */
  public async present(): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'present' });
    log.start({ _id: this.id });

    if (this.id === null) {
      log.failed({ error: 'no _id' });
      throw this.errNoViewReference();
    }

    const methodKey = 'adapty_ui_present_paywall_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
    } satisfies Req['AdaptyUIPresentPaywallView.Request']);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);
    return result;
  }

  /**
   * Dismisses a paywall view
   *
   * @throws {AdaptyError}
   */
  public async dismiss(): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'dismiss' });
    log.start({ _id: this.id });

    if (this.id === null) {
      log.failed({ error: 'no id' });
      throw this.errNoViewReference();
    }

    const methodKey = 'adapty_ui_dismiss_paywall_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
      destroy: false,
    } satisfies Req['AdaptyUIDismissPaywallView.Request']);

    await this.handle<void>(methodKey, body, 'Void', ctx, log);

    if (this.unsubscribeAllListeners) {
      this.unsubscribeAllListeners();
    }
  }

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
  public async showDialog(
    config: AdaptyUiDialogConfig,
  ): Promise<AdaptyUiDialogActionType> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'showDialog' });
    log.start({ _id: this.id });

    if (this.id === null) {
      log.failed({ error: 'no id' });
      throw this.errNoViewReference();
    }

    const coder = new AdaptyUiDialogConfigCoder();
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
      log.failed({ error, message: 'Failed to dismiss paywall' });
    }
  };

  /**
   * Sets event handlers for paywall view events
   *
   * @see {@link https://adapty.io/docs/react-native-handling-events-1 | [DOC] Handling View Events}
   *
   * @remarks
   * Each event type can have only one handler — new handlers replace existing ones.
   * Your config is merged with {@link DEFAULT_EVENT_HANDLERS} that provide default closing behavior:
   * - `onCloseButtonPress` - closes paywall (returns `true`)
   * - `onAndroidSystemBack` - closes paywall (returns `true`)
   * - `onRestoreCompleted` - closes paywall (returns `true`)
   * - `onPurchaseCompleted` - closes paywall on success (returns `purchaseResult.type !== 'user_cancelled'`)
   * - `onUrlPress` - opens URL and keeps paywall open (returns `false`)
   *
   * If you want to override these listeners, we strongly recommend to return the same value as the default implementation
   * from your custom listener to retain default behavior.
   *
   * **Important**: Calling this method multiple times will re-register ALL event handlers (both default and provided ones),
   * not just the ones you pass. This means all previous event listeners will be replaced with the new merged set.
   *
   * @param {Partial<EventHandlers>} [eventHandlers] - set of event handling callbacks
   * @returns {() => void} unsubscribe - function to unsubscribe all listeners
   */
  public setEventHandlers(
    eventHandlers: Partial<EventHandlers> = {},
  ): () => void {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'setEventHandlers' });
    log.start({ _id: this.id });

    if (this.id === null) {
      throw this.errNoViewReference();
    }

    const unsubscribe = setEventHandlers(
      eventHandlers,
      this.id,
      this.onRequestClose,
    );

    // expose to class to be able to unsubscribe on dismiss
    this.unsubscribeAllListeners = unsubscribe;

    return unsubscribe;
  }

  private errNoViewReference(): AdaptyError {
    throw new Error('View reference not found');
  }
}
