import type { AdaptySubscriptionPeriod } from '../../types';

import { Coder } from './coder';

type Type = AdaptySubscriptionPeriod;

export class AdaptySubscriptionPeriodCoder extends Coder<Type> {
  constructor(data: AdaptySubscriptionPeriod) {
    super(data);
  }

  static override tryDecode(json_obj: unknown): AdaptySubscriptionPeriodCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || data === null) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const numberOfUnits = data['number_of_units'];
    if (!numberOfUnits) {
      throw this.errRequired('numberOfUnits');
    }
    if (typeof numberOfUnits !== 'number') {
      throw this.errType({
        name: 'numberOfUnits',
        expected: 'number',
        current: typeof numberOfUnits,
      });
    }

    const unit = data['unit'] as Type['unit'];
    if (!unit) {
      throw this.errRequired('unit');
    }
    if (typeof unit !== 'string') {
      throw this.errType({
        name: 'unit',
        expected: 'string',
        current: typeof unit,
      });
    }

    const result: AdaptySubscriptionPeriod = {
      numberOfUnits: numberOfUnits,
      unit: unit,
    };

    return new AdaptySubscriptionPeriodCoder(result);
  }

  public encode(): Record<string, any> {
    const d = this.data;

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

    return result;
  }
}
