import { Platform } from 'react-native';
import { snakeToCamel } from '../utils';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext, AdaptyPaywall, AdaptyProduct } from './types';

export class AdaptyPaywalls {
  private _ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this._ctx = context;
  }

  /**
   * @returns
   * Object of
   */
  public async getPaywalls(): Promise<{
    paywalls: AdaptyPaywall[];
    products: AdaptyProduct[];
  }> {
    isSdkAuthorized(this._ctx.isActivated);

    const parseJson = <T>(json: string): T[] => {
      try {
        const array = JSON.parse(json);

        if (Platform.OS === 'android') {
          return snakeToCamel(array);
        }

        return array;
      } catch (error) {
        return [];
      }
    };

    try {
      const result = await this._ctx.module.getPaywalls();
      const paywalls: AdaptyPaywall[] = parseJson(result.paywalls);
      const products: AdaptyProduct[] = parseJson(result.product);

      products.forEach((product: Record<string, any>) => {
        if (product.hasOwnProperty('title')) {
          product.localizedTitle = product.title;
          delete product.title;
        }
        if (product.hasOwnProperty('price')) {
          product.localizedPrice = product.price;
          delete product.price;
        }
      });

      paywalls.forEach(paywall => {
        paywall.products.forEach((product: Record<string, any>) => {
          if (product.hasOwnProperty('title')) {
            product.localizedTitle = product.title;
            delete product.title;
          }
          if (product.hasOwnProperty('price')) {
            product.localizedPrice = product.price;
            delete product.price;
          }
        });
        return paywall;
      });

      return { paywalls, products };
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
