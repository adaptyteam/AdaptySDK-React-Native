import type { AdaptyOnboarding } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';
type Model = AdaptyOnboarding;
type CodableModel = Omit<Model, 'hasViewConfiguration'>;
type Serializable = Def['AdaptyOnboarding'];
export declare class AdaptyOnboardingCoder extends Coder<Model, CodableModel, Serializable> {
    protected properties: Properties<CodableModel, Serializable>;
    decode(data: Serializable): Model;
    encode(data: Model): Serializable;
}
export {};
//# sourceMappingURL=adapty-onboarding.d.ts.map