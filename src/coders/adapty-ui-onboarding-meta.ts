import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiOnboardingMeta } from '@/ui/types';

type Model = AdaptyUiOnboardingMeta;
type Serializable = Def['AdaptyUI.OnboardingMeta'];

export class AdaptyUiOnboardingMetaCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    onboardingId: {
      key: 'onboarding_id',
      required: true,
      type: 'string',
    },
    screenClientId: {
      key: 'screen_cid',
      required: true,
      type: 'string',
    },
    screenIndex: {
      key: 'screen_index',
      required: true,
      type: 'number',
    },
    totalScreens: {
      key: 'total_screens',
      required: true,
      type: 'number',
    },
  };
}
