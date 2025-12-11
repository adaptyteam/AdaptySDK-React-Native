import type { Def, Event } from '@/types/schema';
import type { OnboardingStateUpdatedAction } from '@/ui/types';
import { SimpleCoder } from './coder';
import type { Properties } from './types';
import { AdaptyUiOnboardingStateParamsCoder } from './adapty-ui-onboarding-state-params';

type Model = OnboardingStateUpdatedAction;
type BaseModel = Omit<Model, 'value'>;
type Serializable = Event['OnboardingViewEvent.OnStateUpdatedAction']['action'];
type SerializableStateParam = Def['AdaptyUI.OnboardingsStateParams'];

export class AdaptyUiOnboardingStateUpdatedActionCoder extends SimpleCoder<
  BaseModel,
  Serializable
> {
  private readonly paramCoder = new AdaptyUiOnboardingStateParamsCoder();

  protected properties: Properties<BaseModel, Serializable> = {
    elementId: {
      key: 'element_id',
      required: true,
      type: 'string',
    },
    elementType: {
      key: 'element_type',
      required: true,
      type: 'string',
    },
  };

  override decode(data: Serializable): OnboardingStateUpdatedAction {
    const base = super.decode(data);
    const { elementType } = base;

    switch (elementType) {
      case 'select':
        return {
          ...base,
          elementType: 'select',
          value: this.paramCoder.decode(data.value as SerializableStateParam),
        };
      case 'multi_select':
        return {
          ...base,
          elementType: 'multi_select',
          value: Array.isArray(data.value)
            ? data.value.map(v => this.paramCoder.decode(v))
            : [],
        };
      case 'input':
        return {
          ...base,
          value: data.value as any,
        };
      case 'date_picker':
        return {
          ...base,
          value: data.value as any,
        };
      default:
        throw new Error(`Unknown element_type: ${elementType}`);
    }
  }

  override encode(data: OnboardingStateUpdatedAction): Serializable {
    const base = super.encode(data);
    const { elementType } = data;
    switch (elementType) {
      case 'select':
        return {
          ...base,
          element_type: 'select',
          value: this.paramCoder.encode(data.value),
        };
      case 'multi_select':
        return {
          ...base,
          element_type: 'multi_select',
          value: data.value.map(v => this.paramCoder.encode(v)),
        };
      case 'input':
        return {
          ...base,
          element_type: 'input',
          value: data.value,
        };
      case 'date_picker':
        return {
          ...base,
          element_type: 'date_picker',
          value: data.value,
        };
      default:
        throw new Error(`Unknown elementType: ${elementType}`);
    }
  }
}
