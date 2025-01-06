import type { Properties } from './types';
import type { ProductReference } from '@/types';
import type { Schema } from '@/types/schema';
import { SimpleCoder } from './coder';

type Model = ProductReference;
type Serializable = Schema['InOutput.ProductReference'];

export class ProductReferenceCoder extends SimpleCoder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    vendorId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    adaptyId: {
      key: 'adapty_product_id',
      required: true,
      type: 'string',
    },
    ios: {
      discountId: {
        key: 'promotional_offer_id',
        required: false,
        type: 'string',
      },
    },
    android: {
      isConsumable: {
        key: 'is_consumable' as any,
        required: true,
        type: 'boolean',
      },
      basePlanId: {
        key: 'base_plan_id',
        required: false,
        type: 'string',
      },
      offerId: {
        key: 'offer_id',
        required: false,
        type: 'string',
      },
    },
  };
}
