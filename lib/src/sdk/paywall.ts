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

    const parseJsonArray = <T>(json: string): T[] => {
      try {
        const array = JSON.parse(json);
        return array;
      } catch (error) {
        return [];
      }
    };

    try {
      const result = await this._ctx.module.getPaywalls();

      const paywalls = parseJsonArray<AdaptyPaywall>(result.paywalls);
      const products = parseJsonArray<AdaptyProduct>(result.product);

      return { paywalls, products };
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
