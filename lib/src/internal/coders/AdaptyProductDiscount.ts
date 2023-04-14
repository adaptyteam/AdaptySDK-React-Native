import { LogContext } from '../../logger';
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

  public override encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });

    const d = this.data;
    log?.start(d);

    const result = {
      localized_number_of_periods: d.localizedNumberOfPeriods,
      localized_price: d.localizedPrice,
      localized_subscription_period: d.localizedSubscriptionPeriod,
      number_of_periods: d.numberOfPeriods,
      price: d.price,
      subscription_period: new AdaptySubscriptionPeriodCoder(
        d.subscriptionPeriod,
      ).encode(ctx),
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

    log?.success({ json: result });
    return result;
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyProductDiscountCoder {
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

    const localizedNumberOfPeriods = data[
      'localized_number_of_periods'
    ] as Type['localizedNumberOfPeriods'];
    if (
      localizedNumberOfPeriods &&
      typeof localizedNumberOfPeriods !== 'string'
    ) {
      const error = this.errType({
        name: 'localizedNumberOfPeriods',
        expected: 'string',
        current: typeof localizedNumberOfPeriods,
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

    const numberOfPeriods = data[
      'number_of_periods'
    ] as Type['numberOfPeriods'];
    if (!numberOfPeriods) {
      const error = this.errRequired('numberOfPeriods');

      log?.failed({ error });
      throw error;
    }
    if (typeof numberOfPeriods !== 'number') {
      const error = this.errType({
        name: 'numberOfPeriods',
        expected: 'number',
        current: typeof numberOfPeriods,
      });

      log?.failed({ error });
      throw error;
    }

    const price = data['price'] as Type['price'];
    if (price === undefined || price === null) {
      const error = this.errRequired('price');

      log?.failed({ error });
      throw error;
    }
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
    if (!subscriptionPeriodRaw) {
      const error = this.errRequired('subscriptionPeriod');

      log?.failed({ error });
      throw error;
    }
    if (typeof subscriptionPeriodRaw !== 'object') {
      const error = this.errType({
        name: 'subscriptionPeriod',
        expected: 'object',
        current: typeof subscriptionPeriodRaw,
      });

      log?.failed({ error });
      throw error;
    }
    const subscriptionPeriod = AdaptySubscriptionPeriodCoder.tryDecode(
      subscriptionPeriodRaw,
      ctx,
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

    log?.success(result);
    return new AdaptyProductDiscountCoder(result);
  }
}

// iOS
class AdaptyProductDiscountIosCoder extends Coder<Ios> {
  constructor(data: Ios) {
    super(data);
  }

  public override encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });

    log?.failed({ error: 'Unused method "encode"' });
    return {};
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyProductDiscountIosCoder {
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

    const paymentMode = data['payment_mode'] as MustIos['paymentMode'];
    if (paymentMode && typeof paymentMode !== 'string') {
      const error = this.errType({
        name: 'paymentMode',
        expected: 'string',
        current: typeof paymentMode,
      });

      log?.failed({ error });
      throw error;
    }

    const identifier = data['identifier'] as MustIos['identifier'];
    if (identifier && typeof identifier !== 'string') {
      const error = this.errType({
        name: 'identifier',
        expected: 'string',
        current: typeof identifier,
      });

      log?.failed({ error });
      throw error;
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

    log?.success(result);
    return new AdaptyProductDiscountIosCoder(
      Object.keys(result).length === 0 ? undefined : result,
    );
  }
}
