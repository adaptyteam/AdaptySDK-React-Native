import type { AdaptySubscriptionPeriod } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';

type Model = AdaptySubscriptionPeriod;
type Serializable = Def['AdaptySubscriptionPeriod'];

export class AdaptySubscriptionPeriodCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    unit: { key: 'unit', required: true, type: 'string' },
    numberOfUnits: { key: 'number_of_units', required: true, type: 'number' },
  };
}
