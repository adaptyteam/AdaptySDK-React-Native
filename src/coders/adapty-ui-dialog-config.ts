import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiDialogConfig } from '@/ui/types';

type Model = AdaptyUiDialogConfig;
type Serializable = Def['AdaptyUI.DialogConfiguration'];

export class AdaptyUiDialogConfigCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    primaryActionTitle: {
      key: 'default_action_title',
      required: true,
      type: 'string',
    },
    secondaryActionTitle: {
      key: 'secondary_action_title',
      required: false,
      type: 'string',
    },
    title: {
      key: 'title',
      required: false,
      type: 'string',
    },
    content: {
      key: 'content',
      required: false,
      type: 'string',
    },
  };
}
