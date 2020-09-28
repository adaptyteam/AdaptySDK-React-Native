import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

type Callback<T> = (data: T) => void | Promise<void>;

type AdaptyEventListenerArguments =
  | [type: 'onPromoReceived', callback: Callback<any>]
  | [type: 'onPurchaseSuccess', callback: Callback<any>]
  | [type: 'onPurchaseFailed', callback: Callback<any>]
  | [type: 'onPaywallClosed', callback: Callback<any>]
  | [type: 'onInfoUpdate', callback: Callback<any>];

export class AdaptyEventEmitter {
  private _nativeEmitter;
  private _listeners: EmitterSubscription[];

  constructor() {
    this._nativeEmitter = new NativeEventEmitter(NativeModules.RNAdaptyEvents);
    this._listeners = [];
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

    const subscription = this._nativeEmitter.addListener(eventName, callback);

    this._listeners.push(subscription);
    return subscription;
  }

  public removeAllListeners(): void {
    this._listeners.forEach(listener => listener.remove());
    this._listeners = [];
  }
}
