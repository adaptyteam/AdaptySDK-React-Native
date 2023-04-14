import { LogContext } from '../../logger';
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

  override encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });
    log?.start({});

    // don't need to encode anything currently
    const result = {};

    log?.failed({ error: 'Unused method' });
    return result;
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyAccessLevelCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const dateParser = new DateParser('AdaptyAccessLevel');

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
    ] as OfferType | undefined;
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

    const activePromotionalOfferId = data['active_promotional_offer_id'];
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

    const activePromotionalOfferType = data['active_promotional_offer_type'];
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

    const cancellationReason = data['cancellation_reason'] as
      | CancellationReason
      | undefined;
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

    const id = data['id'];
    if (!id) {
      const error = this.errRequired('id');

      log?.failed(error);
      throw error;
    }
    if (typeof id !== 'string') {
      const error = this.errType({
        name: 'id',
        expected: 'string',
        current: id,
      });

      log?.failed(error);
      throw error;
    }

    const isActive = data['is_active'];
    if (typeof isActive !== 'boolean') {
      const error = this.errType({
        name: 'isActive',
        expected: 'boolean',
        current: isActive,
      });

      log?.failed(error);
      throw error;
    }

    const isInGracePeriod = data['is_in_grace_period'];
    if (typeof isInGracePeriod !== 'boolean') {
      const error = this.errType({
        name: 'isInGracePeriod',
        expected: 'boolean',
        current: isInGracePeriod,
      });

      log?.failed(error);
      throw error;
    }

    const isLifetime = data['is_lifetime'];
    if (typeof isLifetime !== 'boolean') {
      const error = this.errType({
        name: 'isLifetime',
        expected: 'boolean',
        current: isLifetime,
      });

      log?.failed(error);
      throw error;
    }

    const isRefund = data['is_refund'];
    if (typeof isRefund !== 'boolean') {
      const error = this.errType({
        name: 'isRefund',
        expected: 'boolean',
        current: isRefund,
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

    const store = data['store'] as VendorStore | undefined;
    if (!store) {
      const error = this.errRequired('store');

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

    const vendorProductId = data['vendor_product_id'];
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

    const willRenew = data['will_renew'];
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

    log?.success(result);
    return new AdaptyAccessLevelCoder(result);
  }
}
