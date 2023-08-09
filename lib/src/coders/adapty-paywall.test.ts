import type { AdaptyPaywall, ProductReference } from '@/types';
import type { Schema } from '@/types/schema';
import { AdaptyPaywallCoder } from './adapty-paywall';
import { ProductReferenceCoder } from './product-reference';
import { ArrayCoder } from './array';

type Model = AdaptyPaywall;
const mocks: Schema['InOutput.AdaptyPaywall'][] = [
  {
    ...({ use_paywall_builder: false } as any),
    ab_test_name: 'testA',
    developer_id: 'dev123',
    payload_data: 'additionalData',
    paywall_name: 'Paywall1',
    paywall_updated_at: 1630458390000,
    products: [
      {
        vendor_product_id: 'product1',
        promotional_offer_id: 'offer1', // iOS Only
        base_plan_id: 'base1', // Android Only
        offer_id: 'androidOffer1', // Android Only
      },
      { vendor_product_id: 'product2' },
    ],
    remote_config: {
      lang: 'en',
      data: '{"key":"value"}', // A custom JSON string configured in Adapty Dashboard for this paywall
    },
    revision: 5,
    variation_id: 'var001',
  },
  {
    ...({ use_paywall_builder: false } as any),
    developer_id: 'dev456',
    revision: 3,
    variation_id: 'var002',
    ab_test_name: 'testB',
    paywall_name: 'Paywall2',
    products: [{ vendor_product_id: 'product3' }],
    remote_config: { lang: 'fr', data: '' },
    paywall_updated_at: 1632458390000,
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _products = new ArrayCoder<ProductReference, ProductReferenceCoder>(
    ProductReferenceCoder,
  );

  return {
    abTestName: mock.ab_test_name,
    id: mock.developer_id,
    locale: mock.remote_config.lang,
    name: mock.paywall_name,
    products: _products.decode(mock.products),
    remoteConfig: mock.remote_config.data
      ? JSON.parse(mock.remote_config.data)
      : {},
    ...(mock.payload_data && { payloadData: mock.payload_data }),
    remoteConfigString: mock.remote_config.data,
    revision: mock.revision,
    variationId: mock.variation_id,
    version: mock.paywall_updated_at,
    hasViewConfiguration: (mock as any).use_paywall_builder as boolean,
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
