import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import { AdaptyEvent } from '../types/events';
import { AdaptyProfile } from '../types';

type AddListenerFn<E extends AdaptyEvent, Data> = (
  event: E,
  callback: (data: Data) => void | Promise<void>,
) => EmitterSubscription;

type Fn = AddListenerFn<'onLatestProfileLoad', AdaptyProfile> &
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
      const args = data.map(arg => JSON.parse(arg));
      callback.apply(null, args as any);
    };

    const subscription = this.nativeEmitter.addListener(event, parseCallback);

    this.listeners.push(subscription);
    return subscription;
  }

  public addEventListener = this.addListener as unknown as Fn;

  public removeAllListeners(): void {
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];
  }
}
