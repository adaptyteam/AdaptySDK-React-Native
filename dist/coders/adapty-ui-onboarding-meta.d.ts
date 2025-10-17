import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiOnboardingMeta } from '../ui/types';
type Model = AdaptyUiOnboardingMeta;
type Serializable = Def['AdaptyUI.OnboardingMeta'];
export declare class AdaptyUiOnboardingMetaCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-ui-onboarding-meta.d.ts.map