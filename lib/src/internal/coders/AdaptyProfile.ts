import type { AdaptyProfile } from '../../types';
import { AdaptyAccessLevelCoder } from './AdaptyAccessLevel';
import { AdaptyNonSubscriptionCoder } from './AdaptyNonSubscription';
import { AdaptySubscriptionCoder } from './AdaptySubscription';

import { Coder } from './coder';
import { LogContext } from '../../logger';

type Type = AdaptyProfile;

export class AdaptyProfileCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyProfileCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      const error = this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });

      log?.failed(error);
      throw error;
    }

    const accessLevelsRaw = data['paid_access_levels'];

    if (accessLevelsRaw && typeof accessLevelsRaw !== 'object') {
      const error = this.errType({
        name: 'accessLevels',
        expected: 'object',
        current: typeof accessLevelsRaw,
      });

      log?.failed(error);
      throw error;
    }
    const accessLevels = Object.keys(accessLevelsRaw ?? {}).reduce(
      (acc, levelKey) => {
        const accessLevelRaw = accessLevelsRaw[levelKey];
        if (!accessLevelRaw) {
          return acc;
        }

        acc[levelKey] = AdaptyAccessLevelCoder.tryDecode(
          accessLevelRaw,
          ctx,
        ).toObject();

        return acc;
      },
      {} as NonNullable<Type['accessLevels']>,
    );

    const customAttributesRaw = data['custom_attributes'];
    if (!customAttributesRaw) {
      const error = this.errRequired('customAttributes');

      log?.failed(error);
      throw error;
    }
    if (typeof customAttributesRaw !== 'object') {
      const error = this.errType({
        name: 'customAttributes',
        expected: 'object',
        current: typeof customAttributesRaw,
      });

      log?.failed(error);
      throw error;
    }
    const customAttributes = customAttributesRaw;

    const customerUserId = data['customer_user_id'] as Type['customerUserId'];
    if (customerUserId && typeof customerUserId !== 'string') {
      const error = this.errType({
        name: 'customerUserId',
        expected: 'string',
        current: typeof customerUserId,
      });

      log?.failed(error);
      throw error;
    }

    const nonSubscriptionsRaw = data['non_subscriptions'];
    if (nonSubscriptionsRaw && typeof nonSubscriptionsRaw !== 'object') {
      const error = this.errType({
        name: 'nonSubscriptions',
        expected: 'object',
        current: typeof nonSubscriptionsRaw,
      });

      log?.failed(error);
      throw error;
    }
    const nonSubscriptions = Object.keys(nonSubscriptionsRaw ?? {}).reduce(
      (acc, productId) => {
        const nonSubList = nonSubscriptionsRaw[productId];
        if (!nonSubList) {
          return acc;
        }
        if (!Array.isArray(nonSubList)) {
          const error = this.errType({
            name: 'nonSubscriptions',
            expected: 'array',
            current: typeof nonSubList,
          });

          log?.failed(error);
          throw error;
        }

        if (!acc[productId]) {
          acc[productId] = [];
        }

        nonSubList.forEach(value => {
          acc[productId].push(
            AdaptyNonSubscriptionCoder.tryDecode(value, ctx).toObject(),
          );
        });

        return acc;
      },
      {} as NonNullable<Type['nonSubscriptions']>,
    );

    const profileId = data['profile_id'] as Type['profileId'];
    if (!profileId) {
      const error = this.errRequired('profileId');

      log?.failed(error);
      throw error;
    }
    if (typeof profileId !== 'string') {
      const error = this.errType({
        name: 'profileId',
        expected: 'string',
        current: typeof profileId,
      });

      log?.failed(error);
      throw error;
    }

    const subscriptionsRaw = data['subscriptions'];
    if (subscriptionsRaw && typeof subscriptionsRaw !== 'object') {
      const error = this.errType({
        name: 'subscriptions',
        expected: 'object',
        current: typeof subscriptionsRaw,
      });

      log?.failed(error);
      throw error;
    }
    const subscriptions = Object.keys(subscriptionsRaw ?? {}).reduce(
      (acc, productId) => {
        const subscriptionRaw = subscriptionsRaw[productId];
        if (!subscriptionRaw) {
          return acc;
        }

        acc[productId] = AdaptySubscriptionCoder.tryDecode(
          subscriptionRaw,
          ctx,
        ).toObject();

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

    log?.success(result);
    return new AdaptyProfileCoder(result);
  }

  public override encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });
    log?.start({ args: this.data });

    const result = {};

    log?.failed({ error: 'Unused method "encode"' });

    return result;
  }
}
