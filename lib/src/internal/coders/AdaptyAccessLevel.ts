import { Log } from '../../sdk/logger';
import type {
  AdaptyAccessLevel,
  CancellationReason,
  OfferType,
  VendorStore,
} from '../../types';
import { DateParser } from '../parsers/date';

import { Coder } from './coder';

type Type = AdaptyAccessLevel;

export class AdaptyAccessLevelCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  override encode(): Record<string, any> {
    Log.verbose(`${this.constructor.name}.encode`, `Encoding...`, {
      args: this.data,
    });

    const result = {};
    Log.verbose(`${this.constructor.name}.encode`, `Encode: SUCCESS`, {
      args: this.data,
      result,
    });

    return result;
  }

  static override tryDecode(json_obj: unknown): AdaptyAccessLevelCoder {
    const dateParser = new DateParser('AdaptyAccessLevel');

    Log.verbose(
      `${this.prototype.constructor.name}.tryDecode`,
      `Trying to decode...`,
      { args: json_obj },
    );

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      Log.error(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: data is not an object`,
      );

      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const ACTIVATED_AT = 'activated_at';
    const activatedAt = dateParser.parse(data[ACTIVATED_AT], {
      keyName: ACTIVATED_AT,
    });

    const activeIntroductoryOfferType = data[
      'active_introductory_offer_type'
    ] as OfferType | undefined;
    if (activeIntroductoryOfferType) {
      if (typeof activeIntroductoryOfferType !== 'string') {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "active_introductory_offer_type" is not a string"`,
          { data },
        );

        throw this.errType({
          name: 'activeIntroductoryOfferType',
          expected: 'string',
          current: activeIntroductoryOfferType,
        });
      }
    }

    const activePromotionalOfferId = data['active_promotional_offer_id'];
    if (activePromotionalOfferId) {
      if (typeof activePromotionalOfferId !== 'string') {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "active_promotional_offer_id" is not a string"`,
          { data },
        );

        throw this.errType({
          name: 'activePromotionalOfferId',
          expected: 'string',
          current: activePromotionalOfferId,
        });
      }
    }

    const activePromotionalOfferType = data['active_promotional_offer_type'];
    if (activePromotionalOfferType) {
      if (typeof activePromotionalOfferType !== 'string') {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "active_promotional_offer_type" is not a string"`,
          { data },
        );

        throw this.errType({
          name: 'activePromotionalOfferType',
          expected: 'string',
          current: activePromotionalOfferType,
        });
      }
    }

    const BILLING_ISSUE_DETECTED_AT = 'billing_issue_detected_at';
    const billingIssueDetectedAt = dateParser.parseMaybe(
      data[BILLING_ISSUE_DETECTED_AT],
      { keyName: BILLING_ISSUE_DETECTED_AT },
    );

    const cancellationReason = data['cancellation_reason'] as
      | CancellationReason
      | undefined;
    if (cancellationReason) {
      if (typeof cancellationReason !== 'string') {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "cancellation_reason" is not a string"`,
          { data },
        );

        throw this.errType({
          name: 'cancellationReason',
          expected: 'string',
          current: cancellationReason,
        });
      }
    }

    const EXPIRES_AT = 'expires_at';
    const expiresAt = dateParser.parseMaybe(data[EXPIRES_AT], {
      keyName: EXPIRES_AT,
    });

    const id = data['id'];
    if (!id) {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "id" is required"`,
        { data },
      );

      throw this.errRequired('id');
    }
    if (typeof id !== 'string') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "id" is not a string"`,
        { data },
      );

      throw this.errType({
        name: 'id',
        expected: 'string',
        current: id,
      });
    }

    const isActive = data['is_active'];
    if (typeof isActive !== 'boolean') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "is_active" is not a boolean"`,
        { data },
      );

      throw this.errType({
        name: 'isActive',
        expected: 'boolean',
        current: isActive,
      });
    }

    const isInGracePeriod = data['is_in_grace_period'];
    if (typeof isInGracePeriod !== 'boolean') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "is_in_grace_period" is not a boolean"`,
        { data },
      );

      throw this.errType({
        name: 'isInGracePeriod',
        expected: 'boolean',
        current: isInGracePeriod,
      });
    }

    const isLifetime = data['is_lifetime'];
    if (typeof isLifetime !== 'boolean') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "is_lifetime" is not a boolean"`,
        { data },
      );

      throw this.errType({
        name: 'isLifetime',
        expected: 'boolean',
        current: isLifetime,
      });
    }

    const isRefund = data['is_refund'];
    if (typeof isRefund !== 'boolean') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "is_refund" is not a boolean"`,
        { data },
      );

      throw this.errType({
        name: 'isRefund',
        expected: 'boolean',
        current: isRefund,
      });
    }

    const RENEWED_AT = 'renewed_at';
    const renewedAt = dateParser.parseMaybe(data[RENEWED_AT], {
      keyName: RENEWED_AT,
    });

    const STARTS_AT = 'starts_at';
    const startsAt = dateParser.parseMaybe(data[STARTS_AT], {
      keyName: STARTS_AT,
    });

    const store = data['store'] as VendorStore | undefined;
    if (!store) {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "store" is required"`,
        { data },
      );

      throw this.errRequired('store');
    }
    if (typeof store !== 'string') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "store" is not a string"`,
        { data },
      );

      throw this.errType({
        name: 'store',
        expected: 'string',
        current: store,
      });
    }

    const UNSUBSCRIBED_AT = 'unsubscribed_at';
    const unsubscribedAt = dateParser.parseMaybe(data[UNSUBSCRIBED_AT], {
      keyName: UNSUBSCRIBED_AT,
    });

    const vendorProductId = data['vendor_product_id'];
    if (!vendorProductId) {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "vendor_product_id" is required"`,
        { data },
      );

      throw this.errRequired('vendorProductId');
    }
    if (typeof vendorProductId !== 'string') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "vendor_product_id" is not a string"`,
        { data },
      );

      throw this.errType({
        name: 'vendorProductId',
        expected: 'string',
        current: vendorProductId,
      });
    }

    const willRenew = data['will_renew'];
    if (typeof willRenew !== 'boolean') {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "will_renew" is not a boolean"`,
        { data },
      );

      throw this.errType({
        name: 'willRenew',
        expected: 'boolean',
        current: willRenew,
      });
    }

    const result: Required<Type> = {
      activatedAt: activatedAt,
      activeIntroductoryOfferType: activeIntroductoryOfferType!,
      activePromotionalOfferId: activePromotionalOfferId,
      activePromotionalOfferType: activePromotionalOfferType!,
      billingIssueDetectedAt: billingIssueDetectedAt!,
      cancellationReason: cancellationReason!,
      expiresAt: expiresAt!,
      id: id,
      isActive: isActive,
      isInGracePeriod: isInGracePeriod,
      isLifetime: isLifetime,
      isRefund: isRefund,
      renewedAt: renewedAt!,
      startsAt: startsAt!,
      store: store,
      unsubscribedAt: unsubscribedAt!,
      vendorProductId: vendorProductId,
      willRenew: willRenew,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    Log.verbose(
      `${this.prototype.constructor.name}.tryDecode`,
      `Decode: SUCCESS`,
      { data, result },
    );

    return new AdaptyAccessLevelCoder(result);
  }
}
