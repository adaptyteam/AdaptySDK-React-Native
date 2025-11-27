import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiOnboardingStateParams } from '../ui/types';
type Model = AdaptyUiOnboardingStateParams;
type Serializable = Def['AdaptyUI.OnboardingsStateParams'];
export declare class AdaptyUiOnboardingStateParamsCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-ui-onboarding-state-params.d.ts.map