import type { AdaptySubscriptionPeriod } from '../types';
import { Coder } from './coder';
import { Properties } from './types';

type Model = AdaptySubscriptionPeriod;
type Serializable = Record<string, any>;

export class AdaptyProductSubscriptionPeriodCoder extends Coder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    unit: {
      key: 'unit',
      required: true,
      type: 'string',
    },
    numberOfUnits: {
      key: 'number_of_units',
      required: true,
      type: 'number',
    },
  };
}
