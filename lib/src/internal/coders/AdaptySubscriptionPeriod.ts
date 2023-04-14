import { LogContext } from '../../logger';
import type { AdaptySubscriptionPeriod } from '../../types';

import { Coder } from './coder';

type Type = AdaptySubscriptionPeriod;

export class AdaptySubscriptionPeriodCoder extends Coder<Type> {
  constructor(data: AdaptySubscriptionPeriod) {
    super(data);
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptySubscriptionPeriodCoder {
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

    const numberOfUnits = data['number_of_units'];
    if (!numberOfUnits) {
      const error = this.errRequired('numberOfUnits');

      log?.failed({ error });
      throw error;
    }
    if (typeof numberOfUnits !== 'number') {
      const error = this.errType({
        name: 'numberOfUnits',
        expected: 'number',
        current: typeof numberOfUnits,
      });

      log?.failed({ error });
      throw error;
    }

    const unit = data['unit'] as Type['unit'];
    if (!unit) {
      const error = this.errRequired('unit');

      log?.failed({ error });
      throw error;
    }
    if (typeof unit !== 'string') {
      const error = this.errType({
        name: 'unit',
        expected: 'string',
        current: typeof unit,
      });

      log?.failed({ error });
      throw error;
    }

    const result: AdaptySubscriptionPeriod = {
      numberOfUnits: numberOfUnits,
      unit: unit,
    };

    log?.success(result);
    return new AdaptySubscriptionPeriodCoder(result);
  }

  public encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });
    const d = this.data;
    log?.start(d);

    const result = {
      number_of_units: d.numberOfUnits,
      unit: d.unit,
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
}
