import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { AdaptyEvent } from '../types/events';
import { AdaptyProfile } from '../types';
import { AdaptyProfileCoder } from '../internal/coders';
import { Log } from './logger';

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
    Log.verbose(
      `${this.constructor.name}.addListener`,
      `Registering new listener`,
      { event },
    );

    const parseCallback = (...data: string[]) => {
      const args = data.map((arg, index) => {
        try {
          const param = JSON.parse(arg);

          try {
            const coder = AdaptyProfileCoder.tryDecode(param);
            return coder.toObject();
          } catch (error) {
            Log.error(
              `${this.constructor.name}.addListener`,
              `Failed to decode profile in event listener`,
              { event },
            );

            throw error;
          }
        } catch (error) {
          Log.error(
            `${this.constructor.name}.addListener`,
            `Failed to decode profile in event listener`,
            { event, data, arg_index: index },
          );

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
    Log.verbose(
      `${this.constructor.name}.addListener`,
      `Removing all listeners`,
      { listeners_length: this.listeners.length },
    );

    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }
}
