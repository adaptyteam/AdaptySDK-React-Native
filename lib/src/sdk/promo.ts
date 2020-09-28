import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext } from './types';

export class Promo {
  private _ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this._ctx = context;
  }

  public async getPromo() {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const result = await this._ctx.module.getPromo();
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
