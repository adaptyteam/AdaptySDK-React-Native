import type { Event } from '@/types/schema';
import type { OnboardingStateUpdatedAction } from '../ui/types';
import { SimpleCoder } from './coder';
import type { Properties } from './types';
type Model = OnboardingStateUpdatedAction;
type BaseModel = Omit<Model, 'value'>;
type Serializable = Event['OnboardingViewEvent.OnStateUpdatedAction']['action'];
export declare class AdaptyUiOnboardingStateUpdatedActionCoder extends SimpleCoder<BaseModel, Serializable> {
    private readonly paramCoder;
    protected properties: Properties<BaseModel, Serializable>;
    decode(data: Serializable): OnboardingStateUpdatedAction;
    encode(data: OnboardingStateUpdatedAction): Serializable;
}
export {};
//# sourceMappingURL=adapty-ui-onboarding-state-updated-action.d.ts.map