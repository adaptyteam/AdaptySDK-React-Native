import type { AdaptyPurchaseResult } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyProfileCoder } from '@/coders/adapty-profile';
import { Platform } from 'react-native';

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
        ...(Platform.OS === 'ios' && data.apple_jws_transaction
          ? { ios: { jwsTransaction: data.apple_jws_transaction } }
          : {}),
        ...(Platform.OS === 'android' && data.google_purchase_token
          ? { android: { purchaseToken: data.google_purchase_token } }
          : {}),
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
        ...(Platform.OS === 'ios' && data.ios?.jwsTransaction
          ? { apple_jws_transaction: data.ios.jwsTransaction }
          : {}),
        ...(Platform.OS === 'android' && data.android?.purchaseToken
          ? { google_purchase_token: data.android.purchaseToken }
          : {}),
      };
    }

    return super.encode({ type });
  }
}
