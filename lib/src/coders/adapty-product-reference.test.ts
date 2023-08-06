import { AdaptyProductReferenceCoder } from './adapty-product-reference';

describe('AdaptyProductReferenceCoder', () => {
  const coder = new AdaptyProductReferenceCoder();

  it('decodes and encodes back to the original JSON', () => {
    const input = {
      vendor_product_id: 'vendorId1',
      promotional_offer_id: 'promoId1',
      promotional_offer_eligibility: true,
    };

    const expectedOutput = {
      vendorId: 'vendorId1',
      ios: {
        promotionalOfferId: 'promoId1',
        promotionalOfferEligibility: true,
      },
    };

    const decoded = coder.decode(input);
    expect(decoded).toEqual(expectedOutput);

    const encoded = coder.encode(decoded);
    expect(encoded).toEqual(input);
  });

  it('handles optional fields', () => {
    const input = {
      vendor_product_id: 'vendorId1',
    };

    const expectedOutput = {
      vendorId: 'vendorId1',
      ios: {},
    };

    const decoded = coder.decode(input);
    expect(decoded).toEqual(expectedOutput);

    const encoded = coder.encode(decoded);
    expect(encoded).toEqual(input);
  });
});
