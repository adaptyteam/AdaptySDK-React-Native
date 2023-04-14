import { LogContext } from '../../logger';
import type { AdaptyNonSubscription, VendorStore } from '../../types';
import { DateParser } from '../parsers/date';
import { Coder } from './coder';

type Type = AdaptyNonSubscription;

export class AdaptyNonSubscriptionCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  override encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });

    log?.start({});

    // don't need to encode anything currently
    const result = {};

    log?.success({});
    return result;
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyNonSubscriptionCoder {
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

    const isOneTime = data['is_one_time'];
    if (typeof isOneTime !== 'boolean') {
      const error = this.errType({
        name: 'isOneTime',
        expected: 'boolean',
        current: isOneTime,
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

    const isSandbox = data['is_sandbox'];
    if (typeof isSandbox !== 'boolean') {
      const error = this.errType({
        name: 'isSandbox',
        expected: 'boolean',
        current: isSandbox,
      });

      log?.failed(error);
      throw error;
    }

    const purchaseId = data['purchase_id'];
    if (typeof purchaseId !== 'string') {
      const error = this.errType({
        name: 'purchaseId',
        expected: 'string',
        current: purchaseId,
      });

      log?.failed(error);
      throw error;
    }

    const PURCHASED_AT = 'purchased_at';
    const purchasedAt = dateParser.parse(data[PURCHASED_AT], {
      keyName: PURCHASED_AT,
    });

    const store = data['store'] as VendorStore | undefined;
    if (typeof store !== 'string') {
      const error = this.errType({
        name: 'store',
        expected: 'string',
        current: typeof store,
      });

      log?.failed(error);
      throw error;
    }

    const vendorProductId = data['vendor_product_id'];
    if (typeof vendorProductId !== 'string') {
      const error = this.errType({
        name: 'vendorProductId',
        expected: 'string',
        current: vendorProductId,
      });

      log?.failed(error);
      throw error;
    }

    const vendorTransactionId = data['vendor_transaction_id'];
    if (vendorTransactionId) {
      if (typeof vendorTransactionId !== 'string') {
        const error = this.errType({
          name: 'vendorTransactionId',
          expected: 'string',
          current: vendorTransactionId,
        });

        log?.failed(error);
        throw error;
      }
    }

    const result: Required<Type> = {
      isOneTime: isOneTime,
      isRefund: isRefund,
      isSandbox: isSandbox,
      purchaseId: purchaseId,
      purchasedAt: purchasedAt,
      store: store,
      vendorProductId: vendorProductId,
      vendorTransactionId: vendorTransactionId,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    log?.success(result);
    return new AdaptyNonSubscriptionCoder(result);
  }
}
