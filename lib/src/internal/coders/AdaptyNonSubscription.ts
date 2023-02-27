import { Log } from '../../sdk/logger';
import type { AdaptyNonSubscription, VendorStore } from '../../types';

import { Coder } from './coder';

type Type = AdaptyNonSubscription;

export class AdaptyNonSubscriptionCoder extends Coder<Type> {
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
  static override tryDecode(json_obj: unknown): AdaptyNonSubscriptionCoder {
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

    const isOneTime = data['is_one_time'];
    if (typeof isOneTime !== 'boolean') {
      throw this.errType({
        name: 'isOneTime',
        expected: 'boolean',
        current: isOneTime,
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

    const isSandbox = data['is_sandbox'];
    if (typeof isSandbox !== 'boolean') {
      throw this.errType({
        name: 'isSandbox',
        expected: 'boolean',
        current: isSandbox,
      });
    }

    const purchaseId = data['purchase_id'];
    if (typeof purchaseId !== 'string') {
      throw this.errType({
        name: 'purchaseId',
        expected: 'string',
        current: purchaseId,
      });
    }

    const purchasedAtStr = data['purchased_at'];
    if (!purchasedAtStr) {
      throw this.errRequired('purchased_at');
    }
    const purchasedAtTs = Date.parse(purchasedAtStr);
    if (isNaN(purchasedAtTs)) {
      throw this.errType({
        name: 'purchasedAt',
        expected: 'Date',
        current: purchasedAtStr,
      });
    }
    const purchasedAt = new Date(purchasedAtTs);

    const store = data['store'] as VendorStore | undefined;
    if (typeof store !== 'string') {
      throw this.errType({
        name: 'store',
        expected: 'string',
        current: typeof store,
      });
    }

    const vendorProductId = data['vendor_product_id'];
    if (typeof vendorProductId !== 'string') {
      throw this.errType({
        name: 'vendorProductId',
        expected: 'string',
        current: vendorProductId,
      });
    }

    const vendorTransactionId = data['vendor_transaction_id'];
    if (vendorTransactionId) {
      if (typeof vendorTransactionId !== 'string') {
        throw this.errType({
          name: 'vendorTransactionId',
          expected: 'string',
          current: vendorTransactionId,
        });
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

    return new AdaptyNonSubscriptionCoder(result);
  }
}
