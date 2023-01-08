import type { AdaptyProfile } from '../../types';
import { AdaptyAccessLevelCoder } from './AdaptyAccessLevel';
import { AdaptyNonSubscriptionCoder } from './AdaptyNonSubscription';
import { AdaptySubscriptionCoder } from './AdaptySubscription';
import { AdaptyProfileParametersCoder } from './AdaptyProfileParameters';

import { Coder } from './coder';

type Type = AdaptyProfile;

export class AdaptyProfileCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  static override tryDecode(json_obj: unknown): AdaptyProfileCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || data === null) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const accessLevelsRaw = data['paid_access_levels'];

    if (accessLevelsRaw && typeof accessLevelsRaw !== 'object') {
      throw this.errType({
        name: 'accessLevels',
        expected: 'object',
        current: typeof accessLevelsRaw,
      });
    }
    const accessLevels = Object.keys(accessLevelsRaw ?? {}).reduce(
      (acc, levelKey) => {
        const accessLevelRaw = accessLevelsRaw[levelKey];
        if (!accessLevelRaw) {
          return acc;
        }

        acc[levelKey] =
          AdaptyAccessLevelCoder.tryDecode(accessLevelRaw).toObject();

        return acc;
      },
      {} as NonNullable<Type['accessLevels']>,
    );

    const customAttributesRaw = data['custom_attributes'];
    if (!customAttributesRaw) {
      throw this.errRequired('customAttributes');
    }
    if (typeof customAttributesRaw !== 'object') {
      throw this.errType({
        name: 'customAttributes',
        expected: 'object',
        current: typeof customAttributesRaw,
      });
    }
    const customAttributes =
      AdaptyProfileParametersCoder.tryDecode(customAttributesRaw).toObject();

    const customerUserId = data['customer_user_id'] as Type['customerUserId'];
    if (customerUserId && typeof customerUserId !== 'string') {
      throw this.errType({
        name: 'customerUserId',
        expected: 'string',
        current: typeof customerUserId,
      });
    }

    const nonSubscriptionsRaw = data['non_subscriptions'];
    if (nonSubscriptionsRaw && typeof nonSubscriptionsRaw !== 'object') {
      throw this.errType({
        name: 'nonSubscriptions',
        expected: 'object',
        current: typeof nonSubscriptionsRaw,
      });
    }
    const nonSubscriptions = Object.keys(nonSubscriptionsRaw ?? {}).reduce(
      (acc, productId) => {
        const nonSubList = nonSubscriptionsRaw[productId];
        if (!nonSubList) {
          return acc;
        }
        if (!Array.isArray(nonSubList)) {
          throw this.errType({
            name: 'nonSubscriptions',
            expected: 'array',
            current: typeof nonSubList,
          });
        }

        if (!acc[productId]) {
          acc[productId] = [];
        }

        nonSubList.forEach(value => {
          acc[productId].push(
            AdaptyNonSubscriptionCoder.tryDecode(value).toObject(),
          );
        });

        return acc;
      },
      {} as NonNullable<Type['nonSubscriptions']>,
    );

    const profileId = data['profile_id'] as Type['profileId'];
    if (!profileId) {
      throw this.errRequired('profileId');
    }
    if (typeof profileId !== 'string') {
      throw this.errType({
        name: 'profileId',
        expected: 'string',
        current: typeof profileId,
      });
    }

    const subscriptionsRaw = data['subscriptions'];
    if (subscriptionsRaw && typeof subscriptionsRaw !== 'object') {
      throw this.errType({
        name: 'subscriptions',
        expected: 'object',
        current: typeof subscriptionsRaw,
      });
    }
    const subscriptions = Object.keys(subscriptionsRaw ?? {}).reduce(
      (acc, productId) => {
        const subscriptionRaw = subscriptionsRaw[productId];
        if (!subscriptionRaw) {
          return acc;
        }

        acc[productId] =
          AdaptySubscriptionCoder.tryDecode(subscriptionRaw).toObject();

        return acc;
      },
      {} as NonNullable<Type['subscriptions']>,
    );

    const result: Required<Type> = {
      accessLevels: accessLevels,
      customAttributes: customAttributes,
      customerUserId: customerUserId!,
      nonSubscriptions: nonSubscriptions,
      profileId: profileId,
      subscriptions: subscriptions,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return new AdaptyProfileCoder(result);
  }

  public override encode(): Record<string, any> {
    return {};
  }
}
