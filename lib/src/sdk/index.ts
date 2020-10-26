import { extractModule } from '../utils';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyEventEmitter } from './events';
import { AdaptyPaywalls } from './paywall';
import { Promo } from './promo';
import { Purchases } from './purchases';
import { AdaptyContext } from './types';
import { User } from './user';

export class Adapty extends AdaptyEventEmitter {
  private _ctx: AdaptyContext;

  public user: User;
  public purchases: Purchases;
  public promo: Promo;
  public paywalls: AdaptyPaywalls;

  constructor() {
    super();

    this._ctx = {
      module: extractModule(),
      isActivated: false,
      sdkKey: undefined,
      observerMode: false,
      customerUserId: undefined,
    };

    this.user = new User(this._ctx);
    this.purchases = new Purchases(this._ctx);
    this.promo = new Promo(this._ctx);
    this.paywalls = new AdaptyPaywalls(this._ctx);
  }

  /**
   * @static @private
   * It is being used to define wether
   * a user has activated the SDK using
   * @function activateAdapty or @function useAdapty
   */
  static activateSdk(consumer: Adapty, sdkKey: string) {
    consumer._ctx.isActivated = true;
    consumer._ctx.sdkKey = sdkKey;
  }

  /**
   * Updates
   *
   * @throws AdaptyError
   */
  public async updateAttribution(
    attribution: Object,
    source: 'Adjust' | 'AppsFlyer' | 'Branch' | 'Custom' | 'AppleSearchAds',
  ): Promise<void> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      return this._ctx.module.updateAttribution(attribution, source);
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
