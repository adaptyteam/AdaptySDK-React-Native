import { Platform } from 'react-native';
import { AdaptyDefaultOptions } from 'react-native-adapty/utils';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import {
  AdaptyContext,
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

    const parseJson = (data: {
      receipt?: string;
      purchaserInfo?: string;
    }): RestorePurchasesResult => {
      return {
        ...(data.receipt && { receipt: data.receipt }),
        ...(data.purchaserInfo && {
          purchaserInfo: JSON.parse(data.purchaserInfo),
        }),
      };
    };
    try {
      const result = await this._ctx.module.restorePurchases();
      return parseJson(result);
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
      const result = await this._ctx.module.getPurchaseInfo(options);
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
    options: AdaptyDefaultOptions = {},
  ): Promise<MakePurchaseResult> {
    isSdkAuthorized(this._ctx.isActivated);

    const parseJson = (data: {
      receipt: string;
      product?: string;
      purchaserInfo?: string;
    }): MakePurchaseResult => {
      return {
        receipt: data.receipt,
        ...(data.product && { product: JSON.parse(data.product) }),
        ...(data.purchaserInfo && {
          purchaserInfo: JSON.parse(data.purchaserInfo),
        }),
      };
    };

    try {
      const result = await this._ctx.module.makePurchase(
        productVendorId,
        options,
      );

      const data = parseJson(result);
      return data;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   *
   * @throws AdaptyError
   * @deprecated
   */
  public async validateReceipt(
    productId: string,
    receipt: string,
  ): Promise<{
    purchaserInfo?: AdaptyPurchaserInfo;
  }> {
    isSdkAuthorized(this._ctx.isActivated);

    const parseJson = (data: {
      purchaserInfo?: string;
    }): { purchaserInfo?: AdaptyPurchaserInfo } => {
      return {
        ...(data.purchaserInfo && {
          purchaserInfo: JSON.parse(data.purchaserInfo),
        }),
      };
    };

    try {
      if (Platform.OS === 'android') {
        const result = await this._ctx.module.validateReceipt(
          productId,
          receipt,
        );
        return parseJson(result);
      }

      const result = await this._ctx.module.validateReceipt(receipt);
      return parseJson(result);
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
