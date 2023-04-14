import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { AdaptyEvent } from '../types/events';
import { AdaptyProfile } from '../types';
import { AdaptyProfileCoder } from '../internal/coders';
import { LogContext } from '../logger';

export type AddListenerFn<E extends AdaptyEvent, Data> = (
  event: E,
  callback: (data: Data) => void | Promise<void>,
) => EmitterSubscription;

export type Fn = AddListenerFn<'onLatestProfileLoad', AdaptyProfile> &
  AddListenerFn<'onDeferredPurchase', AdaptyProfile>;

export class AdaptyEventEmitter {
  private nativeEmitter;
  private listeners: EmitterSubscription[];

  constructor() {
    this.nativeEmitter = new NativeEventEmitter(NativeModules.RNAdapty);
    this.listeners = [];
  }

  /**
   * Adapty Event Handler
   *
   * @param type defines which event you are listening to
   * @param callback defines what action would be called, when event fired
   */
  private addListener(
    event: AdaptyEvent,
    callback: (data: any) => void | Promise<void>,
  ): EmitterSubscription {
    const parseCallback = (...data: string[]) => {
      const ctx = new LogContext();

      const log = ctx.event({ methodName: event });
      log.start(data);

      const args = data.map(arg => {
        try {
          const param = JSON.parse(arg);

          try {
            const coder = AdaptyProfileCoder.tryDecode(param, ctx);
            return coder.toObject();
          } catch (error) {
            log.failed({ error });

            throw error;
          }
        } catch (error) {
          log.failed({ error });
          return arg;
        }
      });

      callback.apply(null, args as any);
    };

    const subscription = this.nativeEmitter.addListener(event, parseCallback);

    this.listeners.push(subscription);
    return subscription;
  }

  public addEventListener = this.addListener as unknown as Fn;

  public removeAllListeners(): void {
    // Log.verbose(
    //   `${this.constructor.name}.addListener`,
    //   `Removing all listeners`,
    //   { listeners_length: this.listeners.length },
    // );

    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }
}
