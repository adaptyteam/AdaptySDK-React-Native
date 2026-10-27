import { EmitterSubscription, NativeEventEmitter } from 'react-native';

import { AdaptyError } from '@/adapty-error';
import { LogContext } from '@/logger';
import { parseMethodResult } from '@/coders';
import { AdaptyType, parseCommonEvent } from '@/coders/parse';
import { parseFlowEvent } from '@/coders/parse-flow';
import { parseOnboardingEvent } from '@/coders/parse-onboarding';
import type { Spec } from '@/specs/NativeRNAdapty';

export class NativeRequestHandler<
  Method extends string,
  Params extends string,
> {
  _module: Spec;

  _emitter: NativeEventEmitter;
  _listeners: Set<EmitterSubscription>;

  constructor(module: Spec | null | undefined) {
    if (!module) {
      throw new Error('Adapty NativeModule is not defined');
    }
    this._module = module;

    this._emitter = new NativeEventEmitter(module);
    this._listeners = new Set();
  }

  async request<T>(
    method: Method,
    params: Params,
    resultType: AdaptyType,
    ctx?: LogContext,
  ) {
    const log = ctx?.bridge({ methodName: `fetch/${method}` });
    log?.start(() => ({ method, params }));

    try {
      const response = await this._module.handle(method, { args: params });
      const result = parseMethodResult<T>(response, resultType, ctx);

      log?.success(() => ({ response }));
      return result;
    } catch (error) {
      log?.success(() => ({ error }));

      if (typeof error !== 'object' || error === null) {
        throw AdaptyError.failedToDecodeNativeError(
          `Unexpected native error type. "Expected object", but got "${typeof error}"`,
          error,
        );
      }

      const errorObj = error as Record<string, any>;
      if (!errorObj.hasOwnProperty('message') || !errorObj['message']) {
        throw AdaptyError.failedToDecodeNativeError(
          'Native error does not have expected "message" property',
          error,
        );
      }
      throw errorObj;
    }
  }

  addRawEventListener<
    Event extends string,
    Cb extends (event: any) => void | Promise<void>,
  >(event: Event, cb: Cb): EmitterSubscription {
    const subscription = this._emitter.addListener(event, cb);

    this._listeners.add(subscription);
    return subscription;
  }

  addEventListener<Event extends string, CallbackData>(
    event: Event,
    cb: (this: { rawValue: any }, data: CallbackData) => void | Promise<void>,
  ): EmitterSubscription {
    const consumeNativeCallback = (...data: string[]) => {
      const ctx = new LogContext();

      const log = ctx.event({ methodName: event });
      log.start(() => ({ args: data }));

      let rawValue = null;

      const args = data.map(arg => {
        try {
          const commonEvent = parseCommonEvent(event, arg, ctx);
          if (commonEvent) return commonEvent;

          try {
            rawValue = JSON.parse(arg);
          } catch {}

          const onboardingEvent = parseOnboardingEvent(arg, ctx);
          if (onboardingEvent) {
            return onboardingEvent;
          }

          const flowEvent = parseFlowEvent(arg, ctx);
          return flowEvent;
        } catch (error) {
          log.failed(() => ({ error }));

          throw error;
        }
      });

      cb.apply({ rawValue }, args as any);
    };

    const subscription = this._emitter.addListener(
      event,
      consumeNativeCallback,
    );

    this._listeners.add(subscription);
    return subscription;
  }

  removeAllEventListeners(): void {
    this._listeners?.forEach(listener => listener.remove());
    this._listeners?.clear();
  }
}
