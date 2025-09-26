import type { ProductReference } from '@/types';
import type { Def } from '@/types/schema';
import { ProductReferenceCoder } from './product-reference';

type Model = ProductReference;
const mocks: Def['AdaptyPaywall.ProductReference'][] = [
  { vendor_product_id: 'product123', adapty_product_id: 'adaptyProduct123' },
  {
    vendor_product_id: 'product456',
    adapty_product_id: 'adaptyProduct456',
    promotional_offer_id: 'offer789',
    win_back_offer_id: 'offer456',
  },
  {
    vendor_product_id: 'product111',
    adapty_product_id: 'adaptyProduct111',
    base_plan_id: 'base222',
    offer_id: 'offer333',
  },
  {
    vendor_product_id: 'productXYZ',
    adapty_product_id: 'adaptyProductXYZ',
    promotional_offer_id: 'promoOfferIOS',
    win_back_offer_id: 'winBackOfferIOS',
    base_plan_id: 'baseAndroid',
    offer_id: 'offerAndroid',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    vendorId: mock.vendor_product_id,
    adaptyId: mock.adapty_product_id,
    ios: {
      ...(mock.promotional_offer_id && {
        promotionalOfferId: mock.promotional_offer_id,
      }),
      ...(mock.win_back_offer_id && {
        winBackOfferId: mock.win_back_offer_id,
      }),
    },
    android: {
      ...(mock.base_plan_id && { basePlanId: mock.base_plan_id }),
      ...(mock.offer_id && { offerId: mock.offer_id }),
    } as any,
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
