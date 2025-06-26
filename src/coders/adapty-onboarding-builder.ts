import type { AdaptyOnboardingBuilder } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';

type Model = AdaptyOnboardingBuilder;
type Serializable = Required<Def['AdaptyOnboarding']>['onboarding_builder'];

export class AdaptyOnboardingBuilderCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    url: {
      key: 'config_url',
      required: true,
      type: 'string',
    },
    lang: {
      key: 'lang',
      required: true,
      type: 'string',
    },
  };
}
