import { Platform } from 'react-native';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext, AdaptyProduct, AdaptyPurchaserInfo } from './types';

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
  public async restore(): Promise<void> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const result = await this._ctx.module.restorePurchases();
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
  public async getInfo(): Promise<AdaptyPurchaserInfo> {
    isSdkAuthorized(this._ctx.isActivated);

    const parseJson = (jsonString: string): AdaptyPurchaserInfo => {
      try {
        const object: AdaptyPurchaserInfo = JSON.parse(jsonString);

        // Remove empty and `{}` keys
        const filteredObject = Object.keys(object).reduce((acc, key) => {
          const infoKey: keyof AdaptyPurchaserInfo = key as keyof AdaptyPurchaserInfo;

          const objectValue = object[infoKey];

          if (!objectValue) {
            return acc;
          }

          if (typeof objectValue === 'object' && !Array.isArray(objectValue)) {
            if (Object.keys(objectValue).length === 0) {
              return acc;
            }
          }

          return { ...acc, [infoKey]: objectValue };
        }, {});

        return filteredObject;
      } catch (error) {
        return {} as any;
      }
    };

    try {
      const result = await this._ctx.module.getPurchaseInfo();
      return parseJson(result);
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   * @throws AdaptyError
   */
  public async makePurchase(
    productVendorId: string,
  ): Promise<{
    receipt: string;
    product: AdaptyProduct | null;
    purchaserInfo: AdaptyPurchaserInfo | null;
  }> {
    isSdkAuthorized(this._ctx.isActivated);

    /** @todo mbe without json */
    // const str = JSON.stringify(product);

    try {
      const result: any = await this._ctx.module.makePurchase(productVendorId);
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   *
   * @throws AdaptyError
   */
  public async validateReceipt(
    productId: string,
    receipt: string,
  ): Promise<void> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      if (Platform.OS === 'android') {
        const result = await this._ctx.module.validateReceipt(
          productId,
          receipt,
        );
        return result;
      }

      const result = await this._ctx.module.validateReceipt(receipt);
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
