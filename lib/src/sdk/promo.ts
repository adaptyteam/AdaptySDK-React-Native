import { Platform } from 'react-native';
import { AdaptyError, attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext, AdaptyPromo } from './types';

export class Promo {
  private _ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this._ctx = context;
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

    isSdkAuthorized(this._ctx.isActivated);

    try {
      this._ctx.module.presentCodeRedemptionSheet();
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  public async getPromo(): Promise<AdaptyPromo> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const json = await this._ctx.module.getPromo();
      const result = JSON.parse(json) as AdaptyPromo;
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
