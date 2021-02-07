import { AdaptyDefaultOptions } from '../utils';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import {
  AdaptyContext,
  AdaptyProduct,
  AdaptyPurchaserInfo,
  MakePurchaseResult,
  RestorePurchasesResult,
} from './types';

export class Purchases {
  private _ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this._ctx = context;
  }

  /**
   * Use to restore purchases on a new device.
   * Purchases will appear in user's purchasesInfo
   *
   * @throws AdaptyError
   */
  public async restore(): Promise<RestorePurchasesResult> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const json = await this._ctx.module.restorePurchases();
      const result = JSON.parse(json) as RestorePurchasesResult;
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   * Updates any available fields to a current user
   *
   * @returns Promised
   * @throws AdaptyError
   */
  public async getInfo(
    options: AdaptyDefaultOptions = {},
  ): Promise<AdaptyPurchaserInfo> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const json = await this._ctx.module.getPurchaseInfo(options);
      const result = JSON.parse(json) as AdaptyPurchaserInfo;
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   * @throws AdaptyError
   */
  public async makePurchase(
    product: AdaptyProduct,
  ): Promise<MakePurchaseResult> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const json = await this._ctx.module.makePurchase(
        product.vendorProductId,
        product.variationId,
      );

      const result = JSON.parse(json) as MakePurchaseResult;
      // console.log('RESULT PURCHASE\n\n', result);
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
