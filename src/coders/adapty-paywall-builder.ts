import type { AdaptyPaywallBuilder } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';

type Model = AdaptyPaywallBuilder;
type Serializable = Required<Def['AdaptyPaywall']>['paywall_builder'];

export class AdaptyPaywallBuilderCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    id: {
      key: 'paywall_builder_id',
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
