import type { AdaptyProduct } from '../../types';

import { Coder } from './coder';
import { AdaptySubscriptionPeriodCoder } from './AdaptySubscriptionPeriod';
import { AdaptyProductDiscountCoder } from './AdaptyProductDiscount';
import { Log } from '../../sdk/logger';

type Type = AdaptyProduct;
type Ios = Type['ios'];
type MustIos = NonNullable<Type['ios']>;
type Android = Type['android'];
type MustAndroid = NonNullable<Type['android']>;

export class AdaptyProductCoder extends Coder<Type> {
  static backendCache: Map<string, Record<string, any>> = new Map();

  constructor(data: Type) {
    super(data);
  }

  private static serializeKey(productId: string, variationId: string): string {
    return `${productId}+${variationId}`;
  }

  public encode(): Record<string, any> {
    const d = this.data;

    Log.verbose(`${this.constructor.name}.encode`, `Encoding from cache...`, {
      args: { productId: d.vendorProductId, variationId: d.variationId },
      cache: AdaptyProductCoder.backendCache,
    });

    const cacheKey = AdaptyProductCoder.serializeKey(
      d.vendorProductId,
      d.variationId,
    );

    const result = AdaptyProductCoder.backendCache.get(cacheKey);
    Log.verbose(`${this.constructor.name}.encode`, `Encode: SUCCESS`, {
      args: this.data,
      result,
    });

    return result!;
  }

  static override tryDecode(json_obj: unknown): AdaptyProductCoder {
    Log.verbose(
      `${this.prototype.constructor.name}.tryDecode`,
      `Trying to decode...`,
      { args: json_obj },
    );

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      Log.error(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: data is not an object`,
      );

      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const currencyCode = data['currency_code'] as Type['currencyCode'];
    if (currencyCode && typeof currencyCode !== 'string') {
      throw this.errType({
        name: 'currencyCode',
        expected: 'string',
        current: typeof currencyCode,
      });
    }

    const currencySymbol = data['currency_symbol'] as Type['currencySymbol'];
    if (currencySymbol && typeof currencySymbol !== 'string') {
      throw this.errType({
        name: 'currencySymbol',
        expected: 'string',
        current: typeof currencySymbol,
      });
    }

    const introductoryDiscountRaw = data['introductory_discount'];
    let introductoryDiscount: Type['introductoryDiscount'];
    if (introductoryDiscountRaw) {
      introductoryDiscount = AdaptyProductDiscountCoder.tryDecode(
        introductoryDiscountRaw,
      ).toObject();
    }

    const introductoryOfferEligibility = data[
      'introductory_offer_eligibility'
    ] as Type['introductoryOfferEligibility'];
    if (!introductoryOfferEligibility) {
      throw this.errRequired('introductoryOfferEligibility');
    }
    if (typeof introductoryOfferEligibility !== 'string') {
      throw this.errType({
        name: 'introductoryOfferEligibility',
        expected: 'string',
        current: typeof introductoryOfferEligibility,
      });
    }

    const localizedDescription = data[
      'localized_description'
    ] as Type['localizedDescription'];
    if (typeof localizedDescription !== 'string') {
      throw this.errType({
        name: 'localizedDescription',
        expected: 'string',
        current: typeof localizedDescription,
      });
    }

    const localizedPrice = data['localized_price'] as Type['localizedPrice'];
    if (localizedPrice && typeof localizedPrice !== 'string') {
      throw this.errType({
        name: 'localizedPrice',
        expected: 'string',
        current: typeof localizedPrice,
      });
    }

    const localizedSubscriptionPeriod = data[
      'localized_subscription_period'
    ] as Type['localizedSubscriptionPeriod'];
    if (
      localizedSubscriptionPeriod &&
      typeof localizedSubscriptionPeriod !== 'string'
    ) {
      throw this.errType({
        name: 'localizedSubscriptionPeriod',
        expected: 'string',
        current: typeof localizedSubscriptionPeriod,
      });
    }

    const localizedTitle = data['localized_title'] as Type['localizedTitle'];
    if (typeof localizedTitle !== 'string') {
      throw this.errType({
        name: 'localizedTitle',
        expected: 'string',
        current: typeof localizedTitle,
      });
    }

    const paywallABTestName = data[
      'paywall_ab_test_name'
    ] as Type['paywallABTestName'];
    if (typeof paywallABTestName !== 'string') {
      throw this.errType({
        name: 'paywallABTestName',
        expected: 'string',
        current: typeof paywallABTestName,
      });
    }

    const paywallName = data['paywall_name'] as Type['paywallName'];
    if (typeof paywallName !== 'string') {
      throw this.errType({
        name: 'paywallName',
        expected: 'string',
        current: typeof paywallName,
      });
    }

    const price = data['price'] as Type['price'];
    if (typeof price !== 'number') {
      throw this.errType({
        name: 'price',
        expected: 'number',
        current: typeof price,
      });
    }

    const subscriptionPeriodRaw = data['subscription_period'];
    let subscriptionPeriod: Type['subscriptionPeriod'];
    if (subscriptionPeriodRaw) {
      subscriptionPeriod = AdaptySubscriptionPeriodCoder.tryDecode(
        subscriptionPeriodRaw,
      ).toObject();
    }

    const variationId = data['variation_id'] as Type['variationId'];
    if (typeof variationId !== 'string') {
      throw this.errType({
        name: 'variationId',
        expected: 'string',
        current: typeof variationId,
      });
    }

    const vendorProductId = data[
      'vendor_product_id'
    ] as Type['vendorProductId'];
    if (typeof vendorProductId !== 'string') {
      throw this.errType({
        name: 'vendorProductId',
        expected: 'string',
        current: typeof vendorProductId,
      });
    }

    const ios = AdaptyProductIosCoder.tryDecode(data).toObject();
    const android = AdaptyProductAndroidCoder.tryDecode(data).toObject();

    const result: Required<Type> = {
      currencyCode: currencyCode!,
      currencySymbol: currencySymbol!,
      introductoryDiscount: introductoryDiscount!,
      introductoryOfferEligibility: introductoryOfferEligibility,
      localizedDescription: localizedDescription,
      localizedPrice: localizedPrice!,
      localizedSubscriptionPeriod: localizedSubscriptionPeriod!,
      localizedTitle: localizedTitle,
      paywallABTestName: paywallABTestName,
      paywallName: paywallName,
      price: price,
      subscriptionPeriod: subscriptionPeriod!,
      variationId: variationId,
      vendorProductId: vendorProductId,
      ios: ios!,
      android: android!,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    const cacheKey = AdaptyProductCoder.serializeKey(
      vendorProductId,
      variationId,
    );

    this.backendCache.set(cacheKey, data);
    return new AdaptyProductCoder(result);
  }
}

// iOS
class AdaptyProductIosCoder extends Coder<Ios> {
  constructor(data: Ios) {
    super(data);
  }

  static override tryDecode(json_obj: unknown): AdaptyProductIosCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const discountsRaw = data['discounts'];
    let discounts: MustIos['discounts'] | undefined;
    if (discountsRaw) {
      if (!Array.isArray(discountsRaw)) {
        throw this.errType({
          name: 'discounts',
          expected: 'array',
          current: typeof discountsRaw,
        });
      }
      discounts = discountsRaw.map(discountRaw =>
        AdaptyProductDiscountCoder.tryDecode(discountRaw).toObject(),
      );
    }

    const isFamilyShareable = data[
      'is_family_shareable'
    ] as MustIos['isFamilyShareable'];
    if (isFamilyShareable !== null && isFamilyShareable !== undefined) {
      if (typeof isFamilyShareable !== 'boolean') {
        throw this.errType({
          name: 'isFamilyShareable',
          expected: 'boolean',
          current: typeof isFamilyShareable,
        });
      }
    }

    const promotionalOfferEligibility = data[
      'promotional_offer_eligibility'
    ] as MustIos['promotionalOfferEligibility'];
    if (
      promotionalOfferEligibility &&
      typeof promotionalOfferEligibility !== 'string'
    ) {
      throw this.errType({
        name: 'promotionalOfferEligibility',
        expected: 'string',
        current: typeof promotionalOfferEligibility,
      });
    }

    const promotionalOfferId = data[
      'promotional_offer_id'
    ] as MustIos['promotionalOfferId'];
    if (promotionalOfferId && typeof promotionalOfferId !== 'string') {
      throw this.errType({
        name: 'promotionalOfferId',
        expected: 'string',
        current: typeof promotionalOfferId,
      });
    }

    const regionCode = data['region_code'] as MustIos['regionCode'];
    if (regionCode && typeof regionCode !== 'string') {
      throw this.errType({
        name: 'regionCode',
        expected: 'string',
        current: typeof regionCode,
      });
    }

    const subscriptionGroupIdentifier = data[
      'subscription_group_identifier'
    ] as MustIos['subscriptionGroupIdentifier'];
    if (
      subscriptionGroupIdentifier &&
      typeof subscriptionGroupIdentifier !== 'string'
    ) {
      throw this.errType({
        name: 'subscriptionGroupIdentifier',
        expected: 'string',
        current: typeof subscriptionGroupIdentifier,
      });
    }

    const result: Required<Ios> = {
      discounts: discounts!,
      isFamilyShareable,
      promotionalOfferEligibility,
      promotionalOfferId: promotionalOfferId!,
      regionCode: regionCode!,
      subscriptionGroupIdentifier: subscriptionGroupIdentifier!,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return new AdaptyProductIosCoder(
      Object.keys(result).length === 0 ? undefined : result,
    );
  }

  public encode(): Record<string, any> {
    return {};
  }
}

// Android
class AdaptyProductAndroidCoder extends Coder<Android> {
  constructor(data: Android) {
    super(data);
  }

  static override tryDecode(json_obj: unknown): AdaptyProductAndroidCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const freeTrialPeriodRaw = data['free_trial_period'];
    let freeTrialPeriod: MustAndroid['freeTrialPeriod'] | undefined;
    if (freeTrialPeriodRaw) {
      freeTrialPeriod =
        AdaptySubscriptionPeriodCoder.tryDecode(freeTrialPeriodRaw).toObject();
    }

    const localizedFreeTrialPeriod = data[
      'localized_free_trial_period'
    ] as MustAndroid['localizedFreeTrialPeriod'];
    if (
      localizedFreeTrialPeriod &&
      typeof localizedFreeTrialPeriod !== 'string'
    ) {
      throw this.errType({
        name: 'localizedFreeTrialPeriod',
        expected: 'string',
        current: typeof localizedFreeTrialPeriod,
      });
    }

    const result: Required<Android> = {
      freeTrialPeriod: freeTrialPeriod!,
      localizedFreeTrialPeriod: localizedFreeTrialPeriod!,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return new AdaptyProductAndroidCoder(
      Object.keys(result).length === 0 ? undefined : result,
    );
  }

  public encode(): Record<string, any> {
    return {};
  }
}
