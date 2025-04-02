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
import { MethodName } from '@/types/bridge';
import { $bridge } from '@/bridge';
import { AdaptyError } from '@/adapty-error';
import { AdaptyType } from '@/coders/parse';
import { Req } from '@/types/schema';
import { AdaptyUiDialogConfigCoder } from '@/coders/adapty-ui-dialog-config';

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

    const coder = new AdaptyPaywallCoder();
    const methodKey = 'adapty_ui_create_view';
    const data: Req['AdaptyUICreateView.Request'] = {
      method: methodKey,
      paywall: coder.encode(paywall),
      preload_products: params.prefetchProducts ?? true,
      load_timeout: (params.loadTimeoutMs ?? 5000) / 1000,
    };

    if (params.customTags) {
      data['custom_tags'] = params.customTags;
    }
    if (params.customTimers) {
      const convertTimerInfo = (
        timerInfo: Record<string, Date>,
      ): Record<string, string> => {
        const formatDate = (date: Date): string => {
          const pad = (num: number, digits: number = 2): string => {
            const str = num.toString();
            const paddingLength = digits - str.length;
            return paddingLength > 0 ? '0'.repeat(paddingLength) + str : str;
          };

          const year = date.getFullYear();
          const month = pad(date.getMonth() + 1);
          const day = pad(date.getDate());
          const hours = pad(date.getHours());
          const minutes = pad(date.getMinutes());
          const seconds = pad(date.getSeconds());
          const millis = pad(date.getMilliseconds(), 3);

          return `${year}-${month}-${day}'T'${hours}:${minutes}:${seconds}.${millis}Z`;
        };

        const result: Record<string, string> = {};
        for (const key in timerInfo) {
          if (timerInfo.hasOwnProperty(key)) {
            const date = timerInfo[key];
            if (date instanceof Date) {
              result[key] = formatDate(date);
            }
          }
        }
        return result;
      };
      data['custom_timers'] = convertTimerInfo(params.customTimers);
    }
    const body = JSON.stringify(data);

    const result = await view.handle<AdaptyUiView>(
      methodKey,
      body,
      'AdaptyUiView',
      ctx,
      log,
    );

    view.id = result.id;
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

    const methodKey = 'adapty_ui_present_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
    } satisfies Req['AdaptyUIPresentView.Request']);

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

    const methodKey = 'adapty_ui_dismiss_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
      destroy: false,
    } satisfies Req['AdaptyUIDismissView.Request']);

    await this.handle<void>(methodKey, body, 'Void', ctx, log);

    if (this.unsubscribeAllListeners) {
      this.unsubscribeAllListeners();
    }
  }

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

  /**
   * Creates a set of specific view event listeners
   *
   * @see {@link https://docs.adapty.io/docs/react-native-handling-events | [DOC] Handling View Events}
   *
   * @remarks
   * It registers only requested set of event handlers.
   * Your config is assigned into four event listeners {@link DEFAULT_EVENT_HANDLERS},
   * that handle default closing behavior.
   * - `onCloseButtonPress`
   * - `onAndroidSystemBack`
   * - `onRestoreCompleted`
   * - `onPurchaseCompleted`
   *
   * If you want to override these listeners, we strongly recommend to return `true` (or `purchaseResult.type !== 'user_cancelled'` in case of `onPurchaseCompleted`)
   * from your custom listener to retain default closing behavior.
   *
   * @param {Partial<EventHandlers> | undefined} [eventHandlers] - set of event handling callbacks
   * @returns {() => void} unsubscribe - function to unsubscribe all listeners
   */
  public registerEventHandlers(
    eventHandlers: Partial<EventHandlers> = DEFAULT_EVENT_HANDLERS,
  ): () => void {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'registerEventHandlers' });
    log.start({ _id: this.id });

    if (this.id === null) {
      throw this.errNoViewReference();
    }

    const finalEventHandlers: Partial<EventHandlers> = {
      ...DEFAULT_EVENT_HANDLERS,
      ...eventHandlers,
    };

    // DIY way to tell TS that original arg should not be used
    const deprecateVar = (_target: unknown): _target is never => true;
    if (!deprecateVar(eventHandlers)) {
      return () => {};
    }

    const viewEmitter = new ViewEmitter(this.id);

    Object.keys(finalEventHandlers).forEach(eventStr => {
      const event = eventStr as keyof EventHandlers;

      if (!finalEventHandlers.hasOwnProperty(event)) {
        return;
      }

      const handler = finalEventHandlers[
        event
      ] as EventHandlers[keyof EventHandlers];

      viewEmitter.addListener(event, handler, () => this.dismiss());
    });

    const unsubscribe = () => viewEmitter.removeAllListeners();

    // expose to class to be able to unsubscribe on dismiss
    this.unsubscribeAllListeners = unsubscribe;

    return unsubscribe;
  }

  private errNoViewReference(): AdaptyError {
    throw new Error('View reference not found');
  }
}
