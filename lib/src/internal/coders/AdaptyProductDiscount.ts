import type { AdaptyProductDiscount } from '../../types';
import { AdaptySubscriptionPeriodCoder } from './AdaptySubscriptionPeriod';

import { Coder } from './coder';

type Type = AdaptyProductDiscount;
type Ios = Type['ios'];
type MustIos = NonNullable<Ios>;

export class AdaptyProductDiscountCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  public override encode(): Record<string, any> {
    const d = this.data;

    const result = {
      localized_number_of_periods: d.localizedNumberOfPeriods,
      localized_price: d.localizedPrice,
      localized_subscription_period: d.localizedSubscriptionPeriod,
      number_of_periods: d.numberOfPeriods,
      price: d.price,
      subscription_period: new AdaptySubscriptionPeriodCoder(
        d.subscriptionPeriod,
      ).encode(),
      payment_mode: d.ios?.paymentMode,
      identifier: d.ios?.identifier,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return result;
  }

  static override tryDecode(json_obj: unknown): AdaptyProductDiscountCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || data === null) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const localizedNumberOfPeriods = data[
      'localized_number_of_periods'
    ] as Type['localizedNumberOfPeriods'];
    if (
      localizedNumberOfPeriods &&
      typeof localizedNumberOfPeriods !== 'string'
    ) {
      throw this.errType({
        name: 'localizedNumberOfPeriods',
        expected: 'string',
        current: typeof localizedNumberOfPeriods,
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

    const numberOfPeriods = data[
      'number_of_periods'
    ] as Type['numberOfPeriods'];
    if (!numberOfPeriods) {
      throw this.errRequired('numberOfPeriods');
    }
    if (typeof numberOfPeriods !== 'number') {
      throw this.errType({
        name: 'numberOfPeriods',
        expected: 'number',
        current: typeof numberOfPeriods,
      });
    }

    const price = data['price'] as Type['price'];
    if (price === undefined || price === null) {
      throw this.errRequired('price');
    }
    if (typeof price !== 'number') {
      throw this.errType({
        name: 'price',
        expected: 'number',
        current: typeof price,
      });
    }

    const subscriptionPeriodRaw = data['subscription_period'];
    if (!subscriptionPeriodRaw) {
      throw this.errRequired('subscriptionPeriod');
    }
    if (typeof subscriptionPeriodRaw !== 'object') {
      throw this.errType({
        name: 'subscriptionPeriod',
        expected: 'object',
        current: typeof subscriptionPeriodRaw,
      });
    }
    const subscriptionPeriod = AdaptySubscriptionPeriodCoder.tryDecode(
      subscriptionPeriodRaw,
    ).toObject();

    const ios = AdaptyProductDiscountIosCoder.tryDecode(data).toObject();

    const result: Required<Type> = {
      localizedNumberOfPeriods: localizedNumberOfPeriods!,
      localizedPrice: localizedPrice!,
      localizedSubscriptionPeriod: localizedSubscriptionPeriod!,
      numberOfPeriods: numberOfPeriods,
      price: price,
      subscriptionPeriod: subscriptionPeriod,
      ios: ios!,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return new AdaptyProductDiscountCoder(result);
  }
}

// iOS
class AdaptyProductDiscountIosCoder extends Coder<Ios> {
  constructor(data: Ios) {
    super(data);
  }

  public override encode(): Record<string, any> {
    return {};
  }

  static override tryDecode(json_obj: unknown): AdaptyProductDiscountIosCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || data === null) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const paymentMode = data['payment_mode'] as MustIos['paymentMode'];
    if (paymentMode && typeof paymentMode !== 'string') {
      throw this.errType({
        name: 'paymentMode',
        expected: 'string',
        current: typeof paymentMode,
      });
    }

    const identifier = data['identifier'] as MustIos['identifier'];
    if (identifier && typeof identifier !== 'string') {
      throw this.errType({
        name: 'identifier',
        expected: 'string',
        current: typeof identifier,
      });
    }

    const result: Required<Ios> = {
      paymentMode: paymentMode!,
      identifier: identifier!,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return new AdaptyProductDiscountIosCoder(
      Object.keys(result).length === 0 ? undefined : result,
    );
  }
}
