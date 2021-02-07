import { AdaptyDefaultOptions } from '../utils';
import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext, AdaptyPaywall, AdaptyProduct } from './types';

interface GetPaywallsResult {
  paywalls: AdaptyPaywall[];
  products: AdaptyProduct[];
}
export class AdaptyPaywalls {
  private _ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this._ctx = context;
  }

  public async logShow(variationId: string): Promise<void> {
    try {
      await this._ctx.module.logShowPaywall(variationId);
      return;
    } catch (error) {
      attemptToDecodeError(error);
    }
  }

  /**
   * @returns
   * Object of
   */
  public async getPaywalls(
    options: AdaptyDefaultOptions = {},
  ): Promise<{
    paywalls: AdaptyPaywall[];
    products: AdaptyProduct[];
  }> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const json = await this._ctx.module.getPaywalls(options);

      const result = JSON.parse(json) as GetPaywallsResult;

      // console.log('\n-------------------\nPAYWALLS RESULT:');
      // result.paywalls.forEach((paywall) => console.log(Object.keys(paywall), paywall.developerId));
      // result.products.forEach((product) => console.log(Object.keys(product), product.vendorProductId));

      // console.log('\n-------------------\nPAYWALLS END!');
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
