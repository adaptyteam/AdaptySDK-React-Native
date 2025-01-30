import type { Properties } from './types';
import type { ProductReference } from '@/types';
import type { Def } from '@/types/schema';
import { SimpleCoder } from './coder';

type Model = ProductReference;
type Serializable = Def['AdaptyPaywall.ProductReference'];

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
      promotionalOfferId: {
        key: 'promotional_offer_id',
        required: false,
        type: 'string',
      },
      winBackOfferId: {
        key: 'win_back_offer_id',
        required: false,
        type: 'string',
      },
    },
    android: {
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
