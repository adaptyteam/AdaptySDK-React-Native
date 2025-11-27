import type { AdaptyNonSubscription, AdaptyProfile } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyAccessLevelCoder } from './adapty-access-level';
import { AdaptyNonSubscriptionCoder } from './adapty-non-subscription';
import { AdaptySubscriptionCoder } from './adapty-subscription';
import { HashmapCoder } from './hashmap';
import { ArrayCoder } from './array';

type Model = AdaptyProfile;
type Serializable = Def['AdaptyProfile'];

export class AdaptyProfileCoder extends SimpleCoder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    accessLevels: {
      key: 'paid_access_levels',
      required: false,
      type: 'object',
      converter: new HashmapCoder(new AdaptyAccessLevelCoder()),
    },
    customAttributes: {
      key: 'custom_attributes',
      required: false,
      type: 'object',
    },
    customerUserId: {
      key: 'customer_user_id',
      required: false,
      type: 'string',
    },
    nonSubscriptions: {
      key: 'non_subscriptions',
      required: false,
      type: 'object',
      converter: new HashmapCoder(
        new ArrayCoder<AdaptyNonSubscription, AdaptyNonSubscriptionCoder>(
          AdaptyNonSubscriptionCoder,
        ),
      ),
    },
    profileId: {
      key: 'profile_id',
      required: true,
      type: 'string',
    },
    subscriptions: {
      key: 'subscriptions',
      required: false,
      type: 'object',
      converter: new HashmapCoder(new AdaptySubscriptionCoder()),
    },
  };
}
