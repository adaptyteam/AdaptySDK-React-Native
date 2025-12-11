import type { AdaptyOnboardingBuilder } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyOnboardingBuilder;
type Serializable = Required<Def['AdaptyOnboarding']>['onboarding_builder'];
export declare class AdaptyOnboardingBuilderCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-onboarding-builder.d.ts.map