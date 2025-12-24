import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { AdaptyError } from '@/adapty-error';
import { LogContext } from '@/logger';
import { parseMethodResult } from '@/coders';
import {
  AdaptyType,
  parseCommonEvent,
  parsePaywallEvent,
} from '@/coders/parse';
import { parseOnboardingEvent } from '@/coders/parse-onboarding';

const KEY_HANDLER_NAME = 'HANDLER';

export class NativeRequestHandler<
  Method extends string,
  Params extends string,
> {
  _module: (typeof NativeModules)[string];
  _request: (method: Method, params: Record<string, string>) => Promise<string>;

  _emitter: NativeEventEmitter;
  _listeners: Set<EmitterSubscription>;

  constructor(moduleName: string) {
    this._module = NativeModules[moduleName];
    if (!this._module) {
      throw new Error('Adapty NativeModule is not defined');
    }

    this._emitter = new NativeEventEmitter(this._module);
    this._listeners = new Set();

    // Handler name is defined in native module
    const constants = this._module.getConstants() as Record<string, string>;
    const handlerName = constants[KEY_HANDLER_NAME];
    if (!handlerName) {
      throw new Error(
        `Adapty NativeModule does not expose "${KEY_HANDLER_NAME}" constant`,
      );
    }

    this._request = this._module[handlerName] as (
      method: Method,
      params: Record<string, string>,
    ) => Promise<string>;
    if (!this._request) {
      throw new Error('Adapty native handler is not defined');
    }
  }

  async request<T>(
    method: Method,
    params: Params,
    resultType: AdaptyType,
    ctx?: LogContext,
  ) {
    const log = ctx?.bridge({ methodName: `fetch/${method}` });
    log?.start({ method, params });

    try {
      const response = await this._request(method, { args: params });
      const result = parseMethodResult<T>(response, resultType, ctx);

      log?.success({ response });
      return result;
    } catch (error) {
      log?.success({ error });

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
      log.start(data);

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

          const paywallEvent = parsePaywallEvent(arg, ctx);
          return paywallEvent;
        } catch (error) {
          log.failed({ error });

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
