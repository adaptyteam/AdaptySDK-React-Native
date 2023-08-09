import type { AdaptyPaywallProduct } from '@/types';
import type { Schema } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';
import { AdaptyPriceCoder } from './adapty-price';
import { AdaptySubscriptionDetailsCoder } from './adapty-subscription-details';

type Model = AdaptyPaywallProduct;
type Serializable = Schema['Output.AdaptyPaywallProduct'];

export class AdaptyPaywallProductCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    vendorProductId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    localizedDescription: {
      key: 'localized_description',
      required: true,
      type: 'string',
    },
    localizedTitle: { key: 'localized_title', required: true, type: 'string' },
    regionCode: { key: 'region_code', required: false, type: 'string' },
    variationId: {
      key: 'paywall_variation_id',
      required: true,
      type: 'string',
    },
    paywallABTestName: {
      key: 'paywall_ab_test_name',
      required: true,
      type: 'string',
    },
    paywallName: { key: 'paywall_name', required: true, type: 'string' },
    price: {
      key: 'price',
      required: false, // Native SDKs require this
      type: 'object',
      converter: new AdaptyPriceCoder(),
    },
    payloadData: { key: 'payload_data', required: false, type: 'string' },
    subscriptionDetails: {
      key: 'subscription_details',
      required: false,
      type: 'object',
      converter: new AdaptySubscriptionDetailsCoder(),
    },
    ios: {
      isFamilyShareable: {
        key: 'is_family_shareable',
        required: false as true,
        type: 'boolean',
      },
    },
  };
}
