import type { AdaptyRemoteConfig } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';
import { JSONCoder } from './json';

type Model = AdaptyRemoteConfig;
type CodableModel = Omit<Model, 'dataString'>;
type Serializable = Required<Def['AdaptyPaywall']>['remote_config'];

export class AdaptyRemoteConfigCoder extends Coder<
  Model,
  CodableModel,
  Serializable
> {
  protected properties: Properties<CodableModel, Serializable> = {
    data: {
      key: 'data',
      required: true,
      type: 'string' as any,
      converter: new JSONCoder(),
    },
    lang: {
      key: 'lang',
      required: true,
      type: 'string',
    },
  };

  override decode(data: Serializable): Model {
    const codablePart = super.decode(data);
    const dataString = JSON.stringify(codablePart.data);
    return {
      ...codablePart,
      dataString: dataString.length < 4 ? '' : dataString,
    };
  }

  override encode(data: Model): Serializable {
    const { dataString, ...codablePart } = data;
    return super.encode(codablePart);
  }
}
