import {
  AdaptyUiView,
  DEFAULT_ONBOARDING_EVENT_HANDLERS,
  OnboardingEventHandlers,
} from './types';
import { AdaptyOnboarding } from '@/types';
import { LogContext, LogScope } from '@/logger';
import { AdaptyOnboardingCoder } from '@/coders/adapty-onboarding';
import { MethodName } from '@/types/bridge';
import { $bridge } from '@/bridge';
import { AdaptyError } from '@/adapty-error';
import { AdaptyType } from '@/coders/parse';
import { Req } from '@/types/schema';
import { OnboardingViewEmitter } from './onboarding-view-emitter';

/**
 * Provides methods to control created onboarding view
 * @public
 */
export class OnboardingViewController {
  /**
   * Intended way to create an OnboardingViewController instance.
   * It prepares a native controller to be presented
   * and creates reference between native controller and JS instance
   * @internal
   */

  static async create(
    onboarding: AdaptyOnboarding,
  ): Promise<OnboardingViewController> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'createOnboardingView' });
    log.start({ onboarding });

    const view = new OnboardingViewController();

    const coder = new AdaptyOnboardingCoder();
    const methodKey = 'adapty_ui_create_onboarding_view';
    const data: Req['AdaptyUICreateOnboardingView.Request'] = {
      method: methodKey,
      onboarding: coder.encode(onboarding),
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
    return view;
  }

  private id: string | null; // reference to a native view. UUID
  private unsubscribeAllListeners: null | (() => void) = null;

  /**
   * Since constructors in JS cannot be async, it is not
   * preferred to create OnboardingViewControllers in direct way.
   * Consider using @link{OnboardingViewController.create} instead
   *
   * @remarks
   * Creating OnboardingViewController this way does not let you
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
   * Presents an onboarding view as a full-screen modal
   *
   * @remarks
   * Calling `present` upon already visible onboarding view
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

    const methodKey = 'adapty_ui_present_onboarding_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
    } satisfies Req['AdaptyUIPresentOnboardingView.Request']);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);
    return result;
  }

  /**
   * Dismisses an onboarding view
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

    const methodKey = 'adapty_ui_dismiss_onboarding_view';
    const body = JSON.stringify({
      method: methodKey,
      id: this.id,
      destroy: false,
    } satisfies Req['AdaptyUIDismissOnboardingView.Request']);

    await this.handle<void>(methodKey, body, 'Void', ctx, log);

    if (this.unsubscribeAllListeners) {
      this.unsubscribeAllListeners();
    }
  }

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
  public registerEventHandlers(
    eventHandlers: Partial<OnboardingEventHandlers> = DEFAULT_ONBOARDING_EVENT_HANDLERS,
  ): () => void {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'registerEventHandlers' });
    log.start({ _id: this.id });

    if (this.id === null) {
      throw this.errNoViewReference();
    }

    const finalEventHandlers: Partial<OnboardingEventHandlers> = {
      ...DEFAULT_ONBOARDING_EVENT_HANDLERS,
      ...eventHandlers,
    };

    // DIY way to tell TS that original arg should not be used
    const deprecateVar = (_target: unknown): _target is never => true;
    if (!deprecateVar(eventHandlers)) {
      return () => {};
    }

    const viewEmitter = new OnboardingViewEmitter(this.id);

    Object.keys(finalEventHandlers).forEach(eventStr => {
      const event = eventStr as keyof OnboardingEventHandlers;

      if (!finalEventHandlers.hasOwnProperty(event)) {
        return;
      }

      const handler = finalEventHandlers[
        event
      ] as OnboardingEventHandlers[keyof OnboardingEventHandlers];

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
