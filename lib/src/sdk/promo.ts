import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext, AdaptyPromo } from './types';

export class Promo {
  private _ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this._ctx = context;
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
