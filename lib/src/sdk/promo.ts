import { Platform } from 'react-native';
import { AdaptyError, attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext, AdaptyPromo } from './types';

export class Promo {
  #ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this.#ctx = context;
  }

  /**
   * @description Displays a sheet that enables users
   * to redeem subscription offer codes that you generated in App Store Connect.
   */
  public presentCodeRedemptionSheet() {
    if (Platform.OS !== 'ios') {
      throw new AdaptyError({
        adaptyCode: 'badRequest',
        localizedDescription:
          'presentCodeRedemptionSheet is an iOS-only method',
        code: 400,
      });
    }

    isSdkAuthorized(this.#ctx.isActivated);

    try {
      this.#ctx.module.presentCodeRedemptionSheet();
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  public async getPromo(): Promise<AdaptyPromo> {
    isSdkAuthorized(this.#ctx.isActivated);

    try {
      const json = await this.#ctx.module.getPromo();
      const result = JSON.parse(json) as AdaptyPromo;
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
