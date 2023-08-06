import type { AdaptyProfile } from '../types';
import { Coder } from './coder';
import { AdaptyAccessLevelCoder } from './adapty-access-level';
import { AdaptyNonSubscriptionCoder } from './adapty-non-subscription';
import { AdaptySubscriptionCoder } from './adapty-subscription';
import { HashmapCoder } from './hashmap';
import { Properties } from './types';

type Model = AdaptyProfile;
type Serializable = Record<string, any>;

export class AdaptyProfileCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    accessLevels: {
      key: 'paid_access_levels',
      required: false,
      type: 'object',
      converter: new HashmapCoder(AdaptyAccessLevelCoder),
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
      converter: new HashmapCoder(AdaptyNonSubscriptionCoder),
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
      converter: new HashmapCoder(AdaptySubscriptionCoder),
    },
  };
}
