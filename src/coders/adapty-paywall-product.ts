import type { AdaptyPaywallProduct } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyPriceCoder } from './adapty-price';
import { AdaptySubscriptionDetailsCoder } from './adapty-subscription-details';

type Model = AdaptyPaywallProduct;
type Serializable = Def['AdaptyPaywallProduct.Response'];

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
    paywallProductIndex: {
      key: 'paywall_product_index',
      required: true,
      type: 'number',
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
    webPurchaseUrl: {
      key: 'web_purchase_url',
      required: false,
      type: 'string',
    },
    payloadData: { key: 'payload_data', required: false, type: 'string' },
    subscription: {
      key: 'subscription',
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

  public getInput(data: Serializable): Def['AdaptyPaywallProduct.Request'] {
    return {
      adapty_product_id: data.adapty_product_id,
      paywall_product_index: data.paywall_product_index,
      paywall_ab_test_name: data.paywall_ab_test_name,
      payload_data: data.payload_data,
      paywall_name: data.paywall_name,
      paywall_variation_id: data.paywall_variation_id,
      subscription_offer_identifier: data.subscription?.offer?.offer_identifier,
      vendor_product_id: data.vendor_product_id,
    };
  }
}
