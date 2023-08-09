import type { ProductReference } from '@/types';
import type { Schema } from '@/types/schema';
import { ProductReferenceCoder } from './product-reference';

type Model = ProductReference;
const mocks: Schema['InOutput.ProductReference'][] = [
  { vendor_product_id: 'product123' },
  { vendor_product_id: 'product456', promotional_offer_id: 'offer789' },
  {
    vendor_product_id: 'product111',
    base_plan_id: 'base222',
    offer_id: 'offer333',
  },
  {
    vendor_product_id: 'productXYZ',
    promotional_offer_id: 'offerIOS',
    base_plan_id: 'baseAndroid',
    offer_id: 'offerAndroid',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    vendorId: mock.vendor_product_id,
    ios: {
      ...(mock.promotional_offer_id && {
        discountId: mock.promotional_offer_id,
      }),
    },
    android: {
      ...(mock.base_plan_id && { basePlanId: mock.base_plan_id }),
      ...(mock.offer_id && { offerId: mock.offer_id }),
    },
  };
}

describe('ProductReferenceCoder', () => {
  let coder: ProductReferenceCoder;

  beforeEach(() => {
    coder = new ProductReferenceCoder();
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
