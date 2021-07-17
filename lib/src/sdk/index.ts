import { extractModule } from '../utils';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyEventEmitter } from './events';
import { AdaptyPaywalls } from './paywall';
import { Profile } from './profile';
import { Promo } from './promo';
import { Purchases } from './purchases';
import { AdaptyContext } from './types';

export class Adapty extends AdaptyEventEmitter {
  #ctx: AdaptyContext;

  public profile: Profile;
  public purchases: Purchases;
  public promo: Promo;
  public paywalls: AdaptyPaywalls;

  constructor() {
    super();

    this.#ctx = {
      module: extractModule(),
      isActivated: false,
      sdkKey: undefined,
      observerMode: false,
      customerUserId: undefined,
    };

    this.profile = new Profile(this.#ctx);
    this.purchases = new Purchases(this.#ctx);
    this.promo = new Promo(this.#ctx);
    this.paywalls = new AdaptyPaywalls(this.#ctx);
  }

  /**
   * @static @private
   * It is being used to define wether
   * a user has activated the SDK using
   * @function activateAdapty or @function useAdapty
   */
  static activateSdk(consumer: Adapty, sdkKey: string) {
    consumer.#ctx.isActivated = true;
    consumer.#ctx.sdkKey = sdkKey;
  }

  public async getApnsToken() {
    try {
      return this.#ctx.module.getAPNSToken();
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
  public async setApnsToken(token: string) {
    try {
      this.#ctx.module.setAPNSToken(token);
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  public async setIsExternalAnalyticsEnabled(
    isEnabled: boolean,
  ): Promise<void> {
    try {
      this.#ctx.module.setExternalAnalyticsEnabled(isEnabled);
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
  /**
   * Updates
   *
   * @throws AdaptyError
   */
  public async updateAttribution(
    networkUserId: string,
    attribution: Object,
    source: 'Adjust' | 'AppsFlyer' | 'Branch' | 'Custom' | 'AppleSearchAds',
  ): Promise<void> {
    isSdkAuthorized(this.#ctx.isActivated);

    try {
      return this.#ctx.module.updateAttribution(
        attribution,
        source,
        networkUserId,
      );
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
