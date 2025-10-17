import type { AdaptyPurchaseResult } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyProfileCoder } from '@/coders/adapty-profile';

type Model = AdaptyPurchaseResult;
type Serializable = Def['AdaptyPurchaseResult'];

export class AdaptyPurchaseResultCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    type: {
      key: 'type',
      required: true,
      type: 'string',
    },
  };

  override decode(data: Serializable): Model {
    const baseResult = super.decode(data);
    if (baseResult.type === 'success') {
      if (!data.profile) {
        throw new Error(
          'Profile is required for success type of purchase result',
        );
      }
      return {
        ...baseResult,
        profile: new AdaptyProfileCoder().decode(data.profile),
      };
    }
    return baseResult;
  }

  override encode(data: Model): Serializable {
    const { type } = data;

    if (type === 'success') {
      if (!('profile' in data)) {
        throw new Error(
          'Profile is required for success type of purchase result',
        );
      }

      return {
        type: 'success',
        profile: new AdaptyProfileCoder().encode(data.profile),
      };
    }

    return super.encode({ type });
  }
}
