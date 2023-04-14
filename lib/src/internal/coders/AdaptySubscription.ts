import { LogContext } from '../../logger';
import type { AdaptySubscription } from '../../types';
import { DateParser } from '../parsers/date';

import { Coder } from './coder';

type Type = AdaptySubscription;

export class AdaptySubscriptionCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  public override encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });
    log?.start(this.data);

    const result = {};

    log?.failed({ error: 'Unused method "encode"' });
    return result;
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptySubscriptionCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const dateParser = new DateParser('AdaptyNonSubscription');

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

    const ACTIVATED_AT = 'activated_at';
    const activatedAt = dateParser.parse(data[ACTIVATED_AT], {
      keyName: ACTIVATED_AT,
    });

    const activeIntroductoryOfferType = data[
      'active_introductory_offer_type'
    ] as Type['activeIntroductoryOfferType'];
    if (activeIntroductoryOfferType) {
      if (typeof activeIntroductoryOfferType !== 'string') {
        const error = this.errType({
          name: 'activeIntroductoryOfferType',
          expected: 'string',
          current: activeIntroductoryOfferType,
        });

        log?.failed(error);
        throw error;
      }
    }

    const activePromotionalOfferId = data[
      'active_promotional_offer_id'
    ] as Type['activePromotionalOfferId'];
    if (activePromotionalOfferId) {
      if (typeof activePromotionalOfferId !== 'string') {
        const error = this.errType({
          name: 'activePromotionalOfferId',
          expected: 'string',
          current: activePromotionalOfferId,
        });

        log?.failed(error);
        throw error;
      }
    }

    const activePromotionalOfferType = data[
      'active_promotional_offer_type'
    ] as Type['activePromotionalOfferType'];
    if (activePromotionalOfferType) {
      if (typeof activePromotionalOfferType !== 'string') {
        const error = this.errType({
          name: 'activePromotionalOfferType',
          expected: 'string',
          current: activePromotionalOfferType,
        });

        log?.failed(error);
        throw error;
      }
    }

    const BILLING_ISSUE_DETECTED_AT = 'billing_issue_detected_at';
    const billingIssueDetectedAt = dateParser.parseMaybe(
      data[BILLING_ISSUE_DETECTED_AT],
      { keyName: BILLING_ISSUE_DETECTED_AT },
    );

    const cancellationReason = data[
      'cancellation_reason'
    ] as Type['cancellationReason'];
    if (cancellationReason) {
      if (typeof cancellationReason !== 'string') {
        const error = this.errType({
          name: 'cancellationReason',
          expected: 'string',
          current: cancellationReason,
        });

        log?.failed(error);
        throw error;
      }
    }

    const EXPIRES_AT = 'expires_at';
    const expiresAt = dateParser.parseMaybe(data[EXPIRES_AT], {
      keyName: EXPIRES_AT,
    });

    const isActive = data['is_active'] as Type['isActive'];
    if (typeof isActive !== 'boolean') {
      const error = this.errType({
        name: 'isActive',
        expected: 'boolean',
        current: isActive,
      });

      log?.failed(error);
      throw error;
    }

    const isInGracePeriod = data[
      'is_in_grace_period'
    ] as Type['isInGracePeriod'];
    if (typeof isInGracePeriod !== 'boolean') {
      const error = this.errType({
        name: 'isInGracePeriod',
        expected: 'boolean',
        current: isInGracePeriod,
      });

      log?.failed(error);
      throw error;
    }

    const isLifetime = data['is_lifetime'] as Type['isLifetime'];
    if (typeof isLifetime !== 'boolean') {
      const error = this.errType({
        name: 'isLifetime',
        expected: 'boolean',
        current: isLifetime,
      });

      log?.failed(error);
      throw error;
    }

    const isRefund = data['is_refund'] as Type['isRefund'];
    if (typeof isRefund !== 'boolean') {
      const error = this.errType({
        name: 'isRefund',
        expected: 'boolean',
        current: isRefund,
      });

      log?.failed(error);
      throw error;
    }

    const isSandbox = data['is_sandbox'] as Type['isSandbox'];
    if (typeof isSandbox !== 'boolean') {
      const error = this.errType({
        name: 'isSandbox',
        expected: 'boolean',
        current: isSandbox,
      });

      log?.failed(error);
      throw error;
    }

    const RENEWED_AT = 'renewed_at';
    const renewedAt = dateParser.parseMaybe(data[RENEWED_AT], {
      keyName: RENEWED_AT,
    });

    const STARTS_AT = 'starts_at';
    const startsAt = dateParser.parseMaybe(data[STARTS_AT], {
      keyName: STARTS_AT,
    });

    const store = data['store'] as Type['store'];
    if (!store) {
      const error = this.errRequired('activated_at');

      log?.failed(error);
      throw error;
    }
    if (typeof store !== 'string') {
      const error = this.errType({
        name: 'store',
        expected: 'string',
        current: store,
      });

      log?.failed(error);
      throw error;
    }

    const UNSUBSCRIBED_AT = 'unsubscribed_at';
    const unsubscribedAt = dateParser.parseMaybe(data[UNSUBSCRIBED_AT], {
      keyName: UNSUBSCRIBED_AT,
    });

    const vendorOriginalTransactionId = data[
      'vendor_original_transaction_id'
    ] as Type['vendorOriginalTransactionId'];
    if (!vendorOriginalTransactionId) {
      const error = this.errRequired('vendorOriginalTransactionId');

      log?.failed(error);
      throw error;
    }
    if (typeof vendorOriginalTransactionId !== 'string') {
      const error = this.errType({
        name: 'vendorOriginalTransactionId',
        expected: 'string',
        current: vendorOriginalTransactionId,
      });

      log?.failed(error);
      throw error;
    }

    const vendorProductId = data[
      'vendor_product_id'
    ] as Type['vendorProductId'];
    if (!vendorProductId) {
      const error = this.errRequired('vendorProductId');

      log?.failed(error);
      throw error;
    }
    if (typeof vendorProductId !== 'string') {
      const error = this.errType({
        name: 'vendorProductId',
        expected: 'string',
        current: vendorProductId,
      });

      log?.failed(error);
      throw error;
    }

    const vendorTransactionId = data[
      'vendor_transaction_id'
    ] as Type['vendorTransactionId'];
    if (!vendorTransactionId) {
      const error = this.errRequired('vendorTransactionId');

      log?.failed(error);
      throw error;
    }
    if (typeof vendorTransactionId !== 'string') {
      const error = this.errType({
        name: 'vendorTransactionId',
        expected: 'string',
        current: vendorTransactionId,
      });

      log?.failed(error);
      throw error;
    }

    const willRenew = data['will_renew'] as Type['willRenew'];
    if (typeof willRenew !== 'boolean') {
      const error = this.errType({
        name: 'willRenew',
        expected: 'boolean',
        current: willRenew,
      });

      log?.failed(error);
      throw error;
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

    log?.success(result);
    return new AdaptySubscriptionCoder(result);
  }
}
