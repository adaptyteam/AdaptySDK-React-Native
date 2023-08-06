import type { AdaptyNonSubscription } from '../types';
import { Coder } from './coder';
import { DateCoder } from './date';
import { Properties } from './types';

type Model = AdaptyNonSubscription;
type Serializable = Record<string, any>;

export class AdaptyNonSubscriptionCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    isConsumable: {
      key: 'is_consumable',
      required: true,
      type: 'boolean',
    },
    isRefund: {
      key: 'is_refund',
      required: true,
      type: 'boolean',
    },
    isSandbox: {
      key: 'is_sandbox',
      required: true,
      type: 'boolean',
    },
    purchasedAt: {
      key: 'purchased_at',
      required: true,
      type: 'string',
      converter: new DateCoder(),
    },
    purchaseId: {
      key: 'purchase_id',
      required: true,
      type: 'string',
    },
    vendorProductId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    vendorTransactionId: {
      key: 'vendor_transaction_id',
      required: false,
      type: 'string',
    },
    store: {
      key: 'store',
      required: true,
      type: 'string',
    },
  };
}
