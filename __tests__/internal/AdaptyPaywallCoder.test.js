const {
  AdaptyPaywallCoder,
} = require('../../lib/dist/internal/coders/AdaptyPaywall');

describe('AdaptyPaywallCoder', () => {
  const paywall = {
    ab_test_name: 'ab_test_name',
    developer_id: 'id',
    paywall_name: 'name',
    products: [
      {
        // introductory_offer_eligibility: 'unknown',
        // promotional_offer_eligibility: false,
        // timestamp: 1672128077507,
        vendor_product_id: 'monthly.premium.999',
      },
      {
        // introductory_offer_eligibility: 'unknown',
        // promotional_offer_eligibility: false,
        // timestamp: 1672128077507,
        vendor_product_id: 'weekly.premium.599',
      },
      {
        // introductory_offer_eligibility: 'unknown',
        // promotional_offer_eligibility: false,
        // timestamp: 1672128077507,
        vendor_product_id: 'yearly.premium.6999',
      },
    ],
    revision: 3,
    variation_id: 'variation_id',
  };
  // missing developer_id and products
  const paywall2 = {
    ab_test_name: 'ab_test_name',
    paywall_name: 'name',
    revision: 3,
    variation_id: 'variation_id',
  };
  // type mismatch
  const paywall3 = {
    ab_test_name: 'ab_test_name',
    developer_id: 123,
    paywall_name: 'name',
    paywall_updated_at: 1626172581464,
    products: [
      {
        // introductory_offer_eligibility: 'unknown',
        // promotional_offer_eligibility: false,
        // timestamp: 1672128077507,
        vendor_product_id: 'monthly.premium.999',
      },
      {
        //   introductory_offer_eligibility: 'unknown',
        //   promotional_offer_eligibility: false,
        //   timestamp: 1672128077507,
        vendor_product_id: 'weekly.premium.599',
      },
      {
        // introductory_offer_eligibility: 'unknown',
        // promotional_offer_eligibility: false,
        // timestamp: 1672128077507,
        vendor_product_id: 'yearly.premium.6999',
      },
    ],
    revision: 3,
    variation_id: 'variation_id',
  };

  it('should decode', () => {
    const decoder = AdaptyPaywallCoder.tryDecode(paywall);

    const expected = {
      abTestName: 'ab_test_name',
      id: 'id',
      name: 'name',
      revision: 3,
      variationId: 'variation_id',
      vendorProductIds: [
        'monthly.premium.999',
        'weekly.premium.599',
        'yearly.premium.6999',
      ],
    };

    expect(decoder.toObject()).toStrictEqual(expected);
    expect(decoder.encode()).toStrictEqual(paywall);
  });
  it('should not decode (missing required)', () => {
    expect(() => AdaptyPaywallCoder.tryDecode(paywall2)).toThrow('Required');
  });
  // it('should not decode (type mismatch)', () => {
  //   const decoder = new AdaptyPaywallDecoder(paywall3);

  //   expect(() => decoder.tryDecode()).toThrow('required');
  // });
});
