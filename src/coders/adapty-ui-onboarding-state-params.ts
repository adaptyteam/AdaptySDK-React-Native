import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiOnboardingStateParams } from '@/ui/types';

type Model = AdaptyUiOnboardingStateParams;
type Serializable = Def['AdaptyUI.OnboardingsStateParams'];

export class AdaptyUiOnboardingStateParamsCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    id: {
      key: 'id',
      required: true,
      type: 'string',
    },
    value: {
      key: 'value',
      required: true,
      type: 'string',
    },
    label: {
      key: 'label',
      required: true,
      type: 'string',
    },
  };
}
