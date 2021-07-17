import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {
  InfoUpdateEventCallback,
  PromoReceievedEventCallback,
  PurchaseFailedEventCallback,
  PurchaseSuccessEventCallback,
} from './types';

type Callback<T> = (data: T) => void | Promise<void>;

type AdaptyEventListenerArguments =
  | [type: 'onPromoReceived', callback: PromoReceievedEventCallback]
  | [type: 'onPurchaseSuccess', callback: PurchaseSuccessEventCallback]
  | [type: 'onPurchaseFailed', callback: PurchaseFailedEventCallback]
  | [type: 'onPaywallClosed', callback: Callback<any>]
  | [type: 'onInfoUpdate', callback: InfoUpdateEventCallback];

export class AdaptyEventEmitter {
  #nativeEmitter;
  #listeners: EmitterSubscription[];

  constructor() {
    this.#nativeEmitter = new NativeEventEmitter(NativeModules.RNAdaptyEvents);
    this.#listeners = [];
  }

  /**
   * Adapty Event Handler
   *
   * @param type defines which event you are listening to
   * @param callback defines what action would be called, when event fired
   */
  public addEventListener(
    ...args: AdaptyEventListenerArguments
  ): EmitterSubscription {
    const [eventName, callback] = args;

    const subscription = this.#nativeEmitter.addListener(eventName, callback);

    this.#listeners.push(subscription);
    return subscription;
  }

  public removeAllListeners(): void {
    this.#listeners.forEach(listener => listener.remove());
    this.#listeners = [];
  }
}
