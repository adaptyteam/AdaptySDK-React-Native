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
    return {};
  }

  static override tryDecode(json_obj: unknown): AdaptyAccessLevelCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || data === null) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const activatedAtStr = data['activated_at'];
    if (!activatedAtStr) {
      throw this.errRequired('activated_at');
    }
    const activatedAt = new Date(activatedAtStr);
    if (isNaN(activatedAt.getTime())) {
      throw this.errType({
        name: 'activatedAt',
        expected: 'Date',
        current: activatedAtStr,
      });
    }

    const activeIntroductoryOfferType = data[
      'active_introductory_offer_type'
    ] as OfferType | undefined;
    if (activeIntroductoryOfferType) {
      if (typeof activeIntroductoryOfferType !== 'string') {
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
        throw this.errType({
          name: 'activePromotionalOfferType',
          expected: 'string',
          current: activePromotionalOfferType,
        });
      }
    }

    const billingIssueDetectedAtStr = data['billing_issue_detected_at'];
    const billingIssueDetectedAt = billingIssueDetectedAtStr
      ? new Date(billingIssueDetectedAtStr)
      : undefined;
    if (billingIssueDetectedAt && isNaN(billingIssueDetectedAt.getTime())) {
      throw this.errType({
        name: 'billingIssueDetectedAt',
        expected: 'Date',
        current: billingIssueDetectedAtStr,
      });
    }

    const cancellationReason = data['cancellation_reason'] as
      | CancellationReason
      | undefined;
    if (cancellationReason) {
      if (typeof cancellationReason !== 'string') {
        throw this.errType({
          name: 'cancellationReason',
          expected: 'string',
          current: cancellationReason,
        });
      }
    }

    const expiresAtStr = data['expires_at'];
    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : undefined;
    if (expiresAt && isNaN(expiresAt.getTime())) {
      throw this.errType({
        name: 'expiresAt',
        expected: 'Date',
        current: expiresAtStr,
      });
    }

    const id = data['id'];
    if (!id) {
      throw this.errRequired('id');
    }
    if (typeof id !== 'string') {
      throw this.errType({
        name: 'id',
        expected: 'string',
        current: id,
      });
    }

    const isActive = data['is_active'];
    if (typeof isActive !== 'boolean') {
      throw this.errType({
        name: 'isActive',
        expected: 'boolean',
        current: isActive,
      });
    }

    const isInGracePeriod = data['is_in_grace_period'];
    if (typeof isInGracePeriod !== 'boolean') {
      throw this.errType({
        name: 'isInGracePeriod',
        expected: 'boolean',
        current: isInGracePeriod,
      });
    }

    const isLifetime = data['is_lifetime'];
    if (typeof isLifetime !== 'boolean') {
      throw this.errType({
        name: 'isLifetime',
        expected: 'boolean',
        current: isLifetime,
      });
    }

    const isRefund = data['is_refund'];
    if (typeof isRefund !== 'boolean') {
      throw this.errType({
        name: 'isRefund',
        expected: 'boolean',
        current: isRefund,
      });
    }

    const renewedAtStr = data['renewed_at'];
    const renewedAt = renewedAtStr ? new Date(renewedAtStr) : undefined;
    if (renewedAt && isNaN(renewedAt.getTime())) {
      throw this.errType({
        name: 'renewedAt',
        expected: 'Date',
        current: renewedAtStr,
      });
    }

    const startsAtStr = data['starts_at'];
    const startsAt = startsAtStr ? new Date(startsAtStr) : undefined;
    if (startsAt && isNaN(startsAt.getTime())) {
      throw this.errType({
        name: 'startsAt',
        expected: 'Date',
        current: startsAtStr,
      });
    }

    const store = data['store'] as VendorStore | undefined;
    if (!store) {
      throw this.errRequired('store');
    }
    if (typeof store !== 'string') {
      throw this.errType({
        name: 'store',
        expected: 'string',
        current: store,
      });
    }

    const unsubscribedAtStr = data['unsubscribed_at'];
    const unsubscribedAt = unsubscribedAtStr
      ? new Date(unsubscribedAtStr)
      : undefined;
    if (unsubscribedAt && isNaN(unsubscribedAt.getTime())) {
      throw this.errType({
        name: 'unsubscribedAt',
        expected: 'Date',
        current: unsubscribedAtStr,
      });
    }

    const vendorProductId = data['vendor_product_id'];
    if (!vendorProductId) {
      throw this.errRequired('vendorProductId');
    }
    if (typeof vendorProductId !== 'string') {
      throw this.errType({
        name: 'vendorProductId',
        expected: 'string',
        current: vendorProductId,
      });
    }

    const willRenew = data['will_renew'];
    if (typeof willRenew !== 'boolean') {
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

    return new AdaptyAccessLevelCoder(result);
  }
}
