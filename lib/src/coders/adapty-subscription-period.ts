import type { AdaptySubscriptionPeriod } from '@/types';
import type { Schema } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';

type Model = AdaptySubscriptionPeriod;
type Serializable = Schema['Output.AdaptySubscriptionPeriod'];

export class AdaptySubscriptionPeriodCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    unit: { key: 'unit', required: true, type: 'string' },
    numberOfUnits: { key: 'number_of_units', required: true, type: 'number' },
  };
}
