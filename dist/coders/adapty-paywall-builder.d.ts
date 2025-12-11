import type { AdaptyPaywallBuilder } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyPaywallBuilder;
type Serializable = Required<Def['AdaptyPaywall']>['paywall_builder'];
export declare class AdaptyPaywallBuilderCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-paywall-builder.d.ts.map