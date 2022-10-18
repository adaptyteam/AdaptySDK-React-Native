import { Platform } from 'react-native';
import { AdaptyDefaultOptions } from '../utils';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import {
  AdaptyContext,
  AdaptyProduct,
  AdaptyPurchaserInfo,
  MakePurchaseParams,
  MakePurchaseResult,
  RestorePurchasesResult,
} from './types';

export class Purchases {
  private ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this.ctx = context;
  }

  /**
   * Use to restore purchases on a new device.
   * Purchases will appear in user's purchasesInfo
   *
   * @throws {@link AdaptyError}
   */
  public async restore(): Promise<RestorePurchasesResult> {
    isSdkAuthorized(this.ctx.isActivated);

    try {
      const json = await this.ctx.module.restorePurchases();
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
   * @throws {@link AdaptyError}
   */
  public async getInfo(
    options: AdaptyDefaultOptions = {},
  ): Promise<AdaptyPurchaserInfo> {
    isSdkAuthorized(this.ctx.isActivated);

    try {
      const json = await this.ctx.module.getPurchaseInfo(options);
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
    params?: MakePurchaseParams,
  ): Promise<MakePurchaseResult> {
    isSdkAuthorized(this.ctx.isActivated);

    try {
      const json = await this.ctx.module.makePurchase(
        product.vendorProductId,
        product.variationId,
        Platform.select<string | Record<string, any>>({
          ios: params?.ios?.offerId,
          macos: params?.ios?.offerId,
          android: params?.android?.subscriptionUpdateParam,
        }),
      );

      const result: MakePurchaseResult = JSON.parse(json || '');
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   * Associates transaction with a certain paywall
   */
  public async setVariationId(
    variationId: string,
    transactionId: string,
  ): Promise<void> {
    try {
      await this.ctx.module.setVariationID(variationId, transactionId);
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
