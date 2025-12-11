import type { AdaptySubscriptionPeriod } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptySubscriptionPeriod;
type Serializable = Def['AdaptySubscriptionPeriod'];
export declare class AdaptySubscriptionPeriodCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-subscription-period.d.ts.map