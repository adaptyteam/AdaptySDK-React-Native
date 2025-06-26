import type { AdaptyPaywall, ProductReference } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptyPaywallCoder } from './adapty-paywall';
import { ProductReferenceCoder } from './product-reference';
import { ArrayCoder } from './array';
import { AdaptyRemoteConfigCoder } from './adapty-remote-config';
import { AdaptyPaywallBuilderCoder } from './adapty-paywall-builder';

type Model = AdaptyPaywall;
const mocks: Def['AdaptyPaywall'][] = [
  {
    placement: {
      ab_test_name: 'testA',
      audience_name: 'audienceC',
      developer_id: 'dev123',
      revision: 5,
      placement_audience_version_id: 'version_123',
      is_tracking_purchases: true,
    },
    payload_data: 'additionalData',
    paywall_name: 'Paywall1',
    paywall_id: '456789o',
    response_created_at: 1630458390000,
    products: [
      {
        vendor_product_id: 'product1',
        adapty_product_id: 'adaptyProduct1',
        promotional_offer_id: 'offer1', // iOS Only
        win_back_offer_id: 'offer2', // iOS Only
        base_plan_id: 'base1', // Android Only
        offer_id: 'androidOffer1', // Android Only
      },
      {
        vendor_product_id: 'product2',
        adapty_product_id: 'adaptyProduct2',
      },
    ],
    remote_config: {
      lang: 'en',
      data: '{"key":"value"}', // A custom JSON string configured in Adapty Dashboard for this paywall
    },
    variation_id: 'var001',
    paywall_builder: {
      paywall_builder_id: 'paywallBuilder1',
      lang: 'en',
    },
  },
  {
    placement: {
      ab_test_name: 'testB',
      audience_name: 'audienceD',
      developer_id: 'dev456',
      revision: 3,
      placement_audience_version_id: 'version_456',
    },
    paywall_id: 'instanceId267',
    variation_id: 'var002',
    paywall_name: 'Paywall2',
    products: [
      { vendor_product_id: 'product3', adapty_product_id: 'adaptyProduct3' },
    ],
    remote_config: { lang: 'fr', data: '' },
    web_purchase_url: 'https://example.com/purchase',
    response_created_at: 1632458390000,
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _products = new ArrayCoder<ProductReference, ProductReferenceCoder>(
    ProductReferenceCoder,
  );
  const _remoteConfig = new AdaptyRemoteConfigCoder();
  const _paywallBuilder = new AdaptyPaywallBuilderCoder();

  return {
    placement: {
      abTestName: mock.placement.ab_test_name,
      audienceName: mock.placement.audience_name,
      id: mock.placement.developer_id,
      revision: mock.placement.revision,
      audienceVersionId: mock.placement.placement_audience_version_id,
      ...(mock.placement.is_tracking_purchases !== undefined && {
        isTrackingPurchases: mock.placement.is_tracking_purchases,
      }),
    },
    id: mock.paywall_id,
    ...(mock.payload_data && { payloadData: mock.payload_data }),
    name: mock.paywall_name,
    products: _products.decode(mock.products),
    ...(mock.remote_config && {
      remoteConfig: _remoteConfig.decode(mock.remote_config),
    }),
    variationId: mock.variation_id,
    ...(mock.response_created_at && { version: mock.response_created_at }),
    ...(mock.paywall_builder && {
      paywallBuilder: _paywallBuilder.decode(mock.paywall_builder),
    }),
    ...(mock.web_purchase_url && { webPurchaseUrl: mock.web_purchase_url }),
    hasViewConfiguration: mock.paywall_builder !== undefined,
  };
}

describe('AdaptyPaywallCoder', () => {
  let coder: AdaptyPaywallCoder;

  beforeEach(() => {
    coder = new AdaptyPaywallCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock);

    expect(decoded).toStrictEqual(toModel(mock));
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toStrictEqual(mock);
  });
});
