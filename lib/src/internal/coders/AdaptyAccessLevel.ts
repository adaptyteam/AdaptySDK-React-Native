import { Log } from '../../sdk/logger';
import type {
  AdaptyAccessLevel,
  CancellationReason,
  OfferType,
  VendorStore,
} from '../../types';

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

    const activatedAtStr = data['activated_at'];
    if (!activatedAtStr) {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "activated_at" is required"`,
        { data },
      );

      throw this.errRequired('activated_at');
    }
    const activatedAtTs = Date.parse(activatedAtStr);
    if (isNaN(activatedAtTs)) {
      Log.verbose(
        `${this.prototype.constructor.name}.tryDecode`,
        `Failed to decode: "activated_at" is not a valid Date"`,
        { data },
      );

      throw this.errType({
        name: 'activatedAt',
        expected: 'Date',
        current: activatedAtStr,
      });
    }
    const activatedAt = new Date(activatedAtTs);

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

    const billingIssueDetectedAtStr = data['billing_issue_detected_at'];
    const billingIssueDetectedAtTs = billingIssueDetectedAtStr
      ? Date.parse(billingIssueDetectedAtStr)
      : undefined;
    let billingIssueDetectedAt: Date | undefined;
    if (billingIssueDetectedAtTs) {
      if (isNaN(billingIssueDetectedAtTs)) {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "billing_issue_detected_at" is not a valid Date"`,
          { data },
        );

        throw this.errType({
          name: 'billingIssueDetectedAt',
          expected: 'Date',
          current: billingIssueDetectedAtStr,
        });
      }

      billingIssueDetectedAt = new Date(billingIssueDetectedAtTs);
    }

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

    const expiresAtStr = data['expires_at'];
    const expiresAtTs = expiresAtStr ? Date.parse(expiresAtStr) : undefined;
    let expiresAt: Date | undefined;
    if (expiresAtTs) {
      if (isNaN(expiresAtTs)) {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "expires_at" is not a valid Date"`,
          { data },
        );

        throw this.errType({
          name: 'expiresAt',
          expected: 'Date',
          current: expiresAtStr,
        });
      }

      expiresAt = new Date(expiresAtTs);
    }

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

    const renewedAtStr = data['renewed_at'];
    const renewedAtTs = renewedAtStr ? Date.parse(renewedAtStr) : undefined;
    let renewedAt: Date | undefined;
    if (renewedAtTs) {
      if (isNaN(renewedAtTs)) {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "renewed_at" is not a valid Date"`,
          { data },
        );

        throw this.errType({
          name: 'renewedAt',
          expected: 'Date',
          current: renewedAtStr,
        });
      }

      renewedAt = new Date(renewedAtTs);
    }

    const startsAtStr = data['starts_at'];
    const startsAtTs = startsAtStr ? Date.parse(startsAtStr) : undefined;
    let startsAt: Date | undefined;
    if (startsAtTs) {
      if (isNaN(startsAtTs)) {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "starts_at" is not a valid Date"`,
          { data },
        );

        throw this.errType({
          name: 'startsAt',
          expected: 'Date',
          current: startsAtStr,
        });
      }

      startsAt = new Date(startsAtTs);
    }

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

    const unsubscribedAtStr = data['unsubscribed_at'];
    const unsubscribedAtTs = unsubscribedAtStr
      ? Date.parse(unsubscribedAtStr)
      : undefined;
    let unsubscribedAt: Date | undefined;
    if (unsubscribedAtTs) {
      if (isNaN(unsubscribedAtTs)) {
        Log.verbose(
          `${this.prototype.constructor.name}.tryDecode`,
          `Failed to decode: "unsubscribed_at" is not a valid Date"`,
          { data },
        );

        throw this.errType({
          name: 'unsubscribedAt',
          expected: 'Date',
          current: unsubscribedAtStr,
        });
      }

      unsubscribedAt = new Date(unsubscribedAtTs);
    }

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
