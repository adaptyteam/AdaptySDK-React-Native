import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { DeferredPurchaseEventCallback, InfoUpdateEventCallback, PromoReceievedEventCallback } from './types';

type EventName = 'onInfoUpdate' | 'onPromoReceived' | 'onDeferredPurchase';
type EventCallback = (data: any) => void | Promise<void>;

type AddListenerFn<E extends EventName, C extends EventCallback> = (
  event: E,
  callback: C,
) => EmitterSubscription;

type Fn = AddListenerFn<'onInfoUpdate', InfoUpdateEventCallback> &
  AddListenerFn<'onPromoReceived', PromoReceievedEventCallback> &
  AddListenerFn<'onDeferredPurchase', DeferredPurchaseEventCallback>;

export class AdaptyEventEmitter {
  #nativeEmitter;
  #listeners: EmitterSubscription[];

  constructor() {
    this.#nativeEmitter = new NativeEventEmitter(NativeModules.RNAdapty);
    this.#listeners = [];
  }

  /**
   * Adapty Event Handler
   *
   * @param type defines which event you are listening to
   * @param callback defines what action would be called, when event fired
   */
  private addListener(
    event: EventName,
    callback: EventCallback,
  ): EmitterSubscription {
    const parseCallback = (...data: string[]) => {
      const args = data.map(arg => JSON.parse(arg));
      (callback as any)(...args);
    };

    const subscription = this.#nativeEmitter.addListener(event, parseCallback);

    this.#listeners.push(subscription);
    return subscription;
  }

  public addEventListener = this.addListener as unknown as Fn;

  public removeAllListeners(): void {
    this.#listeners.forEach(listener => listener.remove());
    this.#listeners = [];
  }
}
