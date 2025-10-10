import {
  AdaptyIOSPresentationStyle,
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
 * Set onboarding view event handlers without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
export function setEventHandlers(
  eventHandlers: Partial<OnboardingEventHandlers>,
  viewId: string,
  onRequestClose?: () => Promise<void>,
): () => void {
  const finalEventHandlers: Partial<OnboardingEventHandlers> = {
    ...DEFAULT_ONBOARDING_EVENT_HANDLERS,
    ...eventHandlers,
  };
  const requestClose: () => Promise<void> = onRequestClose ?? (async () => {});
  const viewEmitter = new OnboardingViewEmitter(viewId);
  Object.keys(finalEventHandlers).forEach(eventStr => {
    const event = eventStr as keyof OnboardingEventHandlers;
    if (!finalEventHandlers.hasOwnProperty(event)) {
      return;
    }
    const handler = finalEventHandlers[
      event
    ] as OnboardingEventHandlers[keyof OnboardingEventHandlers];
    viewEmitter.addListener(event, handler, requestClose);
  });
  return () => viewEmitter.removeAllListeners();
}

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

    view.setEventHandlers(DEFAULT_ONBOARDING_EVENT_HANDLERS);

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

  private onRequestClose = async (): Promise<void> => {
    try {
      await this.dismiss();
    } catch (error) {
      // Log error but don't re-throw to avoid breaking event handling
      const ctx = new LogContext();
      const log = ctx.call({ methodName: 'onRequestClose' });
      log.failed({ error, message: 'Failed to dismiss onboarding view' });
    }
  };

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
   * Presents an onboarding view as a modal
   *
   * @param {AdaptyIOSPresentationStyle} [iosPresentationStyle] - iOS presentation style.
   * Available options: 'full_screen' (default) or 'page_sheet'.
   * Only affects iOS platform.
   *
   * @remarks
   * Calling `present` upon already visible onboarding view
   * would result in an error
   *
   * @throws {AdaptyError}
   */
  public async present(
    iosPresentationStyle?: AdaptyIOSPresentationStyle,
  ): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'present' });
    log.start({ _id: this.id, iosPresentationStyle });

    if (this.id === null) {
      log.failed({ error: 'no _id' });
      throw this.errNoViewReference();
    }

    const methodKey = 'adapty_ui_present_onboarding_view';
    const requestData: Req['AdaptyUIPresentOnboardingView.Request'] = {
      method: methodKey,
      id: this.id,
      ios_presentation_style: iosPresentationStyle,
    };

    const body = JSON.stringify(requestData);

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
  public setEventHandlers(
    eventHandlers: Partial<OnboardingEventHandlers> = {},
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
