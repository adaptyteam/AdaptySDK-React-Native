import type { AdaptyNonSubscription } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { DateCoder } from './date';

type Model = AdaptyNonSubscription;
type Serializable = Def['AdaptyProfile.NonSubscription'];

export class AdaptyNonSubscriptionCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    isConsumable: { key: 'is_consumable', required: true, type: 'boolean' },
    isRefund: { key: 'is_refund', required: true, type: 'boolean' },
    isSandbox: { key: 'is_sandbox', required: true, type: 'boolean' },
    purchasedAt: {
      key: 'purchased_at',
      required: true,
      type: 'string',
      converter: new DateCoder(),
    },
    purchaseId: { key: 'purchase_id', required: true, type: 'string' },
    store: { key: 'store', required: true, type: 'string' },
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
  };
}
