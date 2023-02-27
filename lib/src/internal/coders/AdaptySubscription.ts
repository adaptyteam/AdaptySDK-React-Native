import { Log } from '../../sdk/logger';
import type { AdaptySubscription } from '../../types';

import { Coder } from './coder';

type Type = AdaptySubscription;

export class AdaptySubscriptionCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  public override encode(): Record<string, any> {
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

  static override tryDecode(json_obj: unknown): AdaptySubscriptionCoder {
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
      throw this.errRequired('activated_at');
    }
    const activatedAtTs = Date.parse(activatedAtStr);
    if (isNaN(activatedAtTs)) {
      throw this.errType({
        name: 'activatedAt',
        expected: 'Date',
        current: activatedAtStr,
      });
    }
    const activatedAt = new Date(activatedAtTs);

    const activeIntroductoryOfferType = data[
      'active_introductory_offer_type'
    ] as Type['activeIntroductoryOfferType'];
    if (activeIntroductoryOfferType) {
      if (typeof activeIntroductoryOfferType !== 'string') {
        throw this.errType({
          name: 'activeIntroductoryOfferType',
          expected: 'string',
          current: activeIntroductoryOfferType,
        });
      }
    }

    const activePromotionalOfferId = data[
      'active_promotional_offer_id'
    ] as Type['activePromotionalOfferId'];
    if (activePromotionalOfferId) {
      if (typeof activePromotionalOfferId !== 'string') {
        throw this.errType({
          name: 'activePromotionalOfferId',
          expected: 'string',
          current: activePromotionalOfferId,
        });
      }
    }

    const activePromotionalOfferType = data[
      'active_promotional_offer_type'
    ] as Type['activePromotionalOfferType'];
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
    const billingIssueDetectedAtTs = billingIssueDetectedAtStr
      ? Date.parse(billingIssueDetectedAtStr)
      : undefined;
    let billingIssueDetectedAt: Date | undefined;
    if (billingIssueDetectedAtTs) {
      if (isNaN(billingIssueDetectedAtTs)) {
        throw this.errType({
          name: 'billingIssueDetectedAt',
          expected: 'Date',
          current: billingIssueDetectedAtStr,
        });
      }

      billingIssueDetectedAt = new Date(billingIssueDetectedAtTs);
    }

    const cancellationReason = data[
      'cancellation_reason'
    ] as Type['cancellationReason'];
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
    const expiresAtTs = expiresAtStr ? Date.parse(expiresAtStr) : undefined;
    let expiresAt: Date | undefined;
    if (expiresAtTs) {
      if (isNaN(expiresAtTs)) {
        throw this.errType({
          name: 'expiresAt',
          expected: 'Date',
          current: expiresAtStr,
        });
      }

      expiresAt = new Date(expiresAtTs);
    }

    const isActive = data['is_active'] as Type['isActive'];
    if (typeof isActive !== 'boolean') {
      throw this.errType({
        name: 'isActive',
        expected: 'boolean',
        current: isActive,
      });
    }

    const isInGracePeriod = data[
      'is_in_grace_period'
    ] as Type['isInGracePeriod'];
    if (typeof isInGracePeriod !== 'boolean') {
      throw this.errType({
        name: 'isInGracePeriod',
        expected: 'boolean',
        current: isInGracePeriod,
      });
    }

    const isLifetime = data['is_lifetime'] as Type['isLifetime'];
    if (typeof isLifetime !== 'boolean') {
      throw this.errType({
        name: 'isLifetime',
        expected: 'boolean',
        current: isLifetime,
      });
    }

    const isRefund = data['is_refund'] as Type['isRefund'];
    if (typeof isRefund !== 'boolean') {
      throw this.errType({
        name: 'isRefund',
        expected: 'boolean',
        current: isRefund,
      });
    }

    const isSandbox = data['is_sandbox'] as Type['isSandbox'];
    if (typeof isSandbox !== 'boolean') {
      throw this.errType({
        name: 'isSandbox',
        expected: 'boolean',
        current: isSandbox,
      });
    }

    const renewedAtStr = data['renewed_at'];
    const renewedAtTs = renewedAtStr ? Date.parse(renewedAtStr) : undefined;
    let renewedAt: Date | undefined;
    if (renewedAtTs) {
      if (isNaN(renewedAtTs)) {
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
        throw this.errType({
          name: 'startsAt',
          expected: 'Date',
          current: startsAtStr,
        });
      }

      startsAt = new Date(startsAtTs);
    }

    const store = data['store'] as Type['store'];
    if (!store) {
      throw this.errRequired('activated_at');
    }
    if (typeof store !== 'string') {
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
        throw this.errType({
          name: 'unsubscribedAt',
          expected: 'Date',
          current: unsubscribedAtStr,
        });
      }
      unsubscribedAt = new Date(unsubscribedAtTs);
    }

    const vendorOriginalTransactionId = data[
      'vendor_original_transaction_id'
    ] as Type['vendorOriginalTransactionId'];
    if (!vendorOriginalTransactionId) {
      throw this.errRequired('vendorOriginalTransactionId');
    }
    if (typeof vendorOriginalTransactionId !== 'string') {
      throw this.errType({
        name: 'vendorOriginalTransactionId',
        expected: 'string',
        current: vendorOriginalTransactionId,
      });
    }

    const vendorProductId = data[
      'vendor_product_id'
    ] as Type['vendorProductId'];
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

    const vendorTransactionId = data[
      'vendor_transaction_id'
    ] as Type['vendorTransactionId'];
    if (!vendorTransactionId) {
      throw this.errRequired('vendorTransactionId');
    }
    if (typeof vendorTransactionId !== 'string') {
      throw this.errType({
        name: 'vendorTransactionId',
        expected: 'string',
        current: vendorTransactionId,
      });
    }

    const willRenew = data['will_renew'] as Type['willRenew'];
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
      activePromotionalOfferId: activePromotionalOfferId!,
      activePromotionalOfferType: activePromotionalOfferType!,
      billingIssueDetectedAt: billingIssueDetectedAt!,
      cancellationReason: cancellationReason!,
      expiresAt: expiresAt!,
      isActive: isActive,
      isInGracePeriod: isInGracePeriod,
      isLifetime: isLifetime,
      isRefund: isRefund,
      isSandbox: isSandbox,
      renewedAt: renewedAt!,
      startsAt: startsAt!,
      store: store,
      unsubscribedAt: unsubscribedAt!,
      vendorOriginalTransactionId: vendorOriginalTransactionId,
      vendorProductId: vendorProductId,
      vendorTransactionId: vendorTransactionId,
      willRenew: willRenew,
    };

    return new AdaptySubscriptionCoder(result);
  }
}
