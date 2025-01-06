import type { AdaptyPaywallProduct } from '@/types';
import type { Schema } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyPriceCoder } from './adapty-price';
import { AdaptySubscriptionDetailsCoder } from './adapty-subscription-details';

type Model = AdaptyPaywallProduct;
type Serializable = Schema['Output.AdaptyPaywallProduct'];

export class AdaptyPaywallProductCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    vendorProductId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    adaptyId: {
      key: 'adapty_product_id',
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
        required: true,
        type: 'boolean',
      },
    },
  };

  public getInput(data: Serializable): Schema['Input.AdaptyPaywallProduct'] {
    return {
      adapty_product_id: data.adapty_product_id,
      paywall_ab_test_name: data.paywall_ab_test_name,
      payload_data: data.payload_data,
      paywall_name: data.paywall_name,
      paywall_variation_id: data.paywall_variation_id,
      promotional_offer_id:
        data.subscription_details?.promotional_offer?.identifier,
      vendor_product_id: data.vendor_product_id,
    };
  }
}
