import type { AdaptyProductReference } from '../types';
import { Coder } from './coder';
import { Properties } from './types';

type Model = AdaptyProductReference;
type Serializable = Record<string, any>;

export class AdaptyProductReferenceCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    vendorId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    ios: {
      promotionalOfferId: {
        key: 'promotional_offer_id',
        required: false,
        type: 'string',
      },
      promotionalOfferEligibility: {
        key: 'promotional_offer_eligibility',
        required: false,
        type: 'boolean',
      },
    },
  };
}
