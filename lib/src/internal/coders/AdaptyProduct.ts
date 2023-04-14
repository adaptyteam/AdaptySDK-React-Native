import type { AdaptyProduct } from '../../types';

import { Coder } from './coder';
import { AdaptySubscriptionPeriodCoder } from './AdaptySubscriptionPeriod';
import { AdaptyProductDiscountCoder } from './AdaptyProductDiscount';
import { LogContext } from '../../logger';

type Type = AdaptyProduct;
type Ios = Type['ios'];
type MustIos = NonNullable<Type['ios']>;
type Android = Type['android'];
type MustAndroid = NonNullable<Type['android']>;

// interface CacheKey {
//   value: string;
// }

// export class Cache<K extends CacheKey, V> {
//   private cache: Map<K, V> = new Map();

//   public get(key: K): V | undefined {
//     return this.cache.get(key);
//   }

//   public set(key: K, value: V): void {
//     this.cache.set(key, value);
//   }
// }

export class AdaptyProductCoder extends Coder<Type> {
  static backendCache: Map<string, Record<string, any>> = new Map();

  constructor(data: Type) {
    super(data);
  }

  private static serializeKey(productId: string, variationId: string): string {
    return `${productId}+${variationId}`;
  }

  public encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });

    const d = this.data;
    log?.start(d);

    try {
      const cacheKey = AdaptyProductCoder.serializeKey(
        d.vendorProductId,
        d.variationId,
      );

      const result = AdaptyProductCoder.backendCache.get(cacheKey);

      log?.success({ json: result });
      return result!;
    } catch (error) {
      log?.failed(error);
      throw error;
    }
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyProductCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      const error = this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });

      log?.failed({ error });
      throw error;
    }

    const currencyCode = data['currency_code'] as Type['currencyCode'];
    if (currencyCode && typeof currencyCode !== 'string') {
      const error = this.errType({
        name: 'currencyCode',
        expected: 'string',
        current: typeof currencyCode,
      });

      log?.failed({ error });
      throw error;
    }

    const currencySymbol = data['currency_symbol'] as Type['currencySymbol'];
    if (currencySymbol && typeof currencySymbol !== 'string') {
      const error = this.errType({
        name: 'currencySymbol',
        expected: 'string',
        current: typeof currencySymbol,
      });

      log?.failed({ error });
      throw error;
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
      const error = this.errRequired('introductoryOfferEligibility');

      log?.failed({ error });
      throw error;
    }
    if (typeof introductoryOfferEligibility !== 'string') {
      const error = this.errType({
        name: 'introductoryOfferEligibility',
        expected: 'string',
        current: typeof introductoryOfferEligibility,
      });

      log?.failed({ error });
      throw error;
    }

    const localizedDescription = data[
      'localized_description'
    ] as Type['localizedDescription'];
    if (typeof localizedDescription !== 'string') {
      const error = this.errType({
        name: 'localizedDescription',
        expected: 'string',
        current: typeof localizedDescription,
      });

      log?.failed({ error });
      throw error;
    }

    const localizedPrice = data['localized_price'] as Type['localizedPrice'];
    if (localizedPrice && typeof localizedPrice !== 'string') {
      const error = this.errType({
        name: 'localizedPrice',
        expected: 'string',
        current: typeof localizedPrice,
      });

      log?.failed({ error });
      throw error;
    }

    const localizedSubscriptionPeriod = data[
      'localized_subscription_period'
    ] as Type['localizedSubscriptionPeriod'];
    if (
      localizedSubscriptionPeriod &&
      typeof localizedSubscriptionPeriod !== 'string'
    ) {
      const error = this.errType({
        name: 'localizedSubscriptionPeriod',
        expected: 'string',
        current: typeof localizedSubscriptionPeriod,
      });

      log?.failed({ error });
      throw error;
    }

    const localizedTitle = data['localized_title'] as Type['localizedTitle'];
    if (typeof localizedTitle !== 'string') {
      const error = this.errType({
        name: 'localizedTitle',
        expected: 'string',
        current: typeof localizedTitle,
      });

      log?.failed({ error });
      throw error;
    }

    const paywallABTestName = data[
      'paywall_ab_test_name'
    ] as Type['paywallABTestName'];
    if (typeof paywallABTestName !== 'string') {
      const error = this.errType({
        name: 'paywallABTestName',
        expected: 'string',
        current: typeof paywallABTestName,
      });

      log?.failed({ error });
      throw error;
    }

    const paywallName = data['paywall_name'] as Type['paywallName'];
    if (typeof paywallName !== 'string') {
      const error = this.errType({
        name: 'paywallName',
        expected: 'string',
        current: typeof paywallName,
      });

      log?.failed({ error });
      throw error;
    }

    const price = data['price'] as Type['price'];
    if (typeof price !== 'number') {
      const error = this.errType({
        name: 'price',
        expected: 'number',
        current: typeof price,
      });

      log?.failed({ error });
      throw error;
    }

    const subscriptionPeriodRaw = data['subscription_period'];
    let subscriptionPeriod: Type['subscriptionPeriod'];
    if (subscriptionPeriodRaw) {
      subscriptionPeriod = AdaptySubscriptionPeriodCoder.tryDecode(
        subscriptionPeriodRaw,
        ctx,
      ).toObject();
    }

    const variationId = data['variation_id'] as Type['variationId'];
    if (typeof variationId !== 'string') {
      const error = this.errType({
        name: 'variationId',
        expected: 'string',
        current: typeof variationId,
      });

      log?.failed({ error });
      throw error;
    }

    const vendorProductId = data[
      'vendor_product_id'
    ] as Type['vendorProductId'];
    if (typeof vendorProductId !== 'string') {
      const error = this.errType({
        name: 'vendorProductId',
        expected: 'string',
        current: typeof vendorProductId,
      });

      log?.failed({ error });
      throw error;
    }

    const ios = AdaptyProductIosCoder.tryDecode(data, ctx).toObject();
    const android = AdaptyProductAndroidCoder.tryDecode(data, ctx).toObject();

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

    log?.success(result);
    return new AdaptyProductCoder(result);
  }
}

// iOS
class AdaptyProductIosCoder extends Coder<Ios> {
  constructor(data: Ios) {
    super(data);
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyProductIosCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      const error = this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });

      log?.failed({ error });
      throw error;
    }

    const discountsRaw = data['discounts'];
    let discounts: MustIos['discounts'] | undefined;
    if (discountsRaw) {
      if (!Array.isArray(discountsRaw)) {
        const error = this.errType({
          name: 'discounts',
          expected: 'array',
          current: typeof discountsRaw,
        });

        log?.failed({ error });
        throw error;
      }
      discounts = discountsRaw.map(discountRaw =>
        AdaptyProductDiscountCoder.tryDecode(discountRaw, ctx).toObject(),
      );
    }

    const isFamilyShareable = data[
      'is_family_shareable'
    ] as MustIos['isFamilyShareable'];
    if (isFamilyShareable !== null && isFamilyShareable !== undefined) {
      if (typeof isFamilyShareable !== 'boolean') {
        const error = this.errType({
          name: 'isFamilyShareable',
          expected: 'boolean',
          current: typeof isFamilyShareable,
        });

        log?.failed({ error });
        throw error;
      }
    }

    const promotionalOfferEligibility = data[
      'promotional_offer_eligibility'
    ] as MustIos['promotionalOfferEligibility'];
    if (
      promotionalOfferEligibility &&
      typeof promotionalOfferEligibility !== 'string'
    ) {
      const error = this.errType({
        name: 'promotionalOfferEligibility',
        expected: 'string',
        current: typeof promotionalOfferEligibility,
      });

      log?.failed({ error });
      throw error;
    }

    const promotionalOfferId = data[
      'promotional_offer_id'
    ] as MustIos['promotionalOfferId'];
    if (promotionalOfferId && typeof promotionalOfferId !== 'string') {
      const error = this.errType({
        name: 'promotionalOfferId',
        expected: 'string',
        current: typeof promotionalOfferId,
      });

      log?.failed({ error });
      throw error;
    }

    const regionCode = data['region_code'] as MustIos['regionCode'];
    if (regionCode && typeof regionCode !== 'string') {
      const error = this.errType({
        name: 'regionCode',
        expected: 'string',
        current: typeof regionCode,
      });

      log?.failed({ error });
      throw error;
    }

    const subscriptionGroupIdentifier = data[
      'subscription_group_identifier'
    ] as MustIos['subscriptionGroupIdentifier'];
    if (
      subscriptionGroupIdentifier &&
      typeof subscriptionGroupIdentifier !== 'string'
    ) {
      const error = this.errType({
        name: 'subscriptionGroupIdentifier',
        expected: 'string',
        current: typeof subscriptionGroupIdentifier,
      });

      log?.failed({ error });
      throw error;
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

    log?.success(result);
    return new AdaptyProductIosCoder(
      Object.keys(result).length === 0 ? undefined : result,
    );
  }

  public encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });

    log?.failed({ error: 'Not used "encode"' });
    return {};
  }
}

// Android
class AdaptyProductAndroidCoder extends Coder<Android> {
  constructor(data: Android) {
    super(data);
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyProductAndroidCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      const error = this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });

      log?.failed({ error });
      throw error;
    }

    const freeTrialPeriodRaw = data['free_trial_period'];
    let freeTrialPeriod: MustAndroid['freeTrialPeriod'] | undefined;
    if (freeTrialPeriodRaw) {
      freeTrialPeriod = AdaptySubscriptionPeriodCoder.tryDecode(
        freeTrialPeriodRaw,
        ctx,
      ).toObject();
    }

    const localizedFreeTrialPeriod = data[
      'localized_free_trial_period'
    ] as MustAndroid['localizedFreeTrialPeriod'];
    if (
      localizedFreeTrialPeriod &&
      typeof localizedFreeTrialPeriod !== 'string'
    ) {
      const error = this.errType({
        name: 'localizedFreeTrialPeriod',
        expected: 'string',
        current: typeof localizedFreeTrialPeriod,
      });

      log?.failed({ error });
      throw error;
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

    log?.success(result);
    return new AdaptyProductAndroidCoder(
      Object.keys(result).length === 0 ? undefined : result,
    );
  }

  public encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });

    log?.failed({ error: 'Not used "encode"' });
    return {};
  }
}
