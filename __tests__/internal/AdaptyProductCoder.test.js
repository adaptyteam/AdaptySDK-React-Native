const {
  AdaptyProductCoder,
} = require('../../lib/dist/internal/coders/AdaptyProduct');

describe('AdaptyProductCoder', () => {
  const products = [
    {
      vendor_product_id: 'monthly.premium.999',
      subscription_period: { number_of_units: 1, unit: 'month' },
      region_code: 'US',
      is_family_shareable: false,
      localized_subscription_period: '1 month',
      currency_code: 'USD',
      paywall_name: 'Onboarding paywall',
      localized_title: 'Premium',
      price: 9.99,
      paywall_ab_test_name: 'Onboarding paywall',
      introductory_offer_eligibility: 'unknown',
      introductory_discount: {
        localized_subscription_period: '1 week',
        localized_number_of_periods: '1 week',
        price: 0,
        number_of_periods: 1,
        subscription_period: { number_of_units: 1, unit: 'week' },
        localized_price: '$0',
        payment_mode: 'free_trial',
      },
      subscription_group_identifier: '20770576',
      localized_description: 'Premium monthly',
      currency_symbol: '$',
      variation_id: '7de7f227-9a0e-4c95-8c60-ab6768cd3caf',
      discounts: [
        {
          localized_subscription_period: '1 week',
          price: 0,
          localized_number_of_periods: '1 week',
          identifier: 'test_promo',
          number_of_periods: 1,
          subscription_period: { number_of_units: 1, unit: 'week' },
          localized_price: '$0',
          payment_mode: 'free_trial',
        },
      ],
      localized_price: '$9.99',
    },

    {
      vendor_product_id: 'weekly.premium.599',
      subscription_period: { number_of_units: 7, unit: 'day' },
      region_code: 'US',
      is_family_shareable: false,
      localized_subscription_period: '1 week',
      currency_code: 'USD',
      paywall_name: 'Onboarding paywall',
      localized_title: 'Premium',
      price: 5.99,
      paywall_ab_test_name: 'Onboarding paywall',
      introductory_offer_eligibility: 'unknown',
      subscription_group_identifier: '20770576',
      discounts: [],
      localized_description: 'Weekly Premium',
      currency_symbol: '$',
      variation_id: 'var_1',
      localized_price: '$5.99',
    },
    {
      vendor_product_id: 'yearly.premium.6999',
      subscription_period: { number_of_units: 1, unit: 'year' },
      region_code: 'US',
      is_family_shareable: false,
      localized_subscription_period: '1 year',
      currency_code: 'USD',
      paywall_name: 'Onboarding paywall',
      localized_title: 'Premium',
      price: 69.99,
      paywall_ab_test_name: 'Onboarding paywall',
      introductory_offer_eligibility: 'unknown',
      introductory_discount: {
        localized_subscription_period: '1 year',
        localized_number_of_periods: '1 year',
        price: 29.99,
        number_of_periods: 1,
        subscription_period: { number_of_units: 1, unit: 'year' },
        localized_price: '$29.99',
        payment_mode: 'pay_as_you_go',
      },
      subscription_group_identifier: '20770576',
      localized_description: 'Yearly premium',
      currency_symbol: '$',
      variation_id: '7de7f227-9a0e-4c95-8c60-ab6768cd3caf',
      discounts: [
        {
          localized_subscription_period: '1 year',
          price: 29.99,
          localized_number_of_periods: '1 year',
          identifier: 'promo50off',
          number_of_periods: 1,
          subscription_period: { number_of_units: 1, unit: 'year' },
          localized_price: '$29.99',
          payment_mode: 'pay_as_you_go',
        },
      ],
      localized_price: '$69.99',
    },
  ];
  const expected = [
    {
      currencyCode: 'USD',
      currencySymbol: '$',
      vendorProductId: 'monthly.premium.999',
      introductoryDiscount: {
        ios: {
          paymentMode: 'free_trial',
        },
        localizedNumberOfPeriods: '1 week',
        localizedPrice: '$0',
        localizedSubscriptionPeriod: '1 week',
        numberOfPeriods: 1,
        price: 0,
        subscriptionPeriod: {
          numberOfUnits: 1,
          unit: 'week',
        },
      },
      introductoryOfferEligibility: 'unknown',
      ios: {
        discounts: [
          {
            ios: {
              identifier: 'test_promo',
              paymentMode: 'free_trial',
            },
            localizedNumberOfPeriods: '1 week',
            localizedPrice: '$0',
            localizedSubscriptionPeriod: '1 week',
            numberOfPeriods: 1,
            price: 0,
            subscriptionPeriod: {
              numberOfUnits: 1,
              unit: 'week',
            },
          },
        ],
        isFamilyShareable: false,
        regionCode: 'US',
        subscriptionGroupIdentifier: '20770576',
      },

      localizedDescription: 'Premium monthly',
      localizedPrice: '$9.99',
      localizedSubscriptionPeriod: '1 month',
      localizedTitle: 'Premium',
      paywallABTestName: 'Onboarding paywall',
      paywallName: 'Onboarding paywall',
      price: 9.99,
      subscriptionPeriod: {
        numberOfUnits: 1,
        unit: 'month',
      },
      variationId: '7de7f227-9a0e-4c95-8c60-ab6768cd3caf',
    },
    {
      currencyCode: 'USD',
      currencySymbol: '$',
      introductoryOfferEligibility: 'unknown',
      ios: {
        discounts: [],
        isFamilyShareable: false,
        regionCode: 'US',
        subscriptionGroupIdentifier: '20770576',
      },
      localizedDescription: 'Weekly Premium',
      localizedPrice: '$5.99',
      localizedSubscriptionPeriod: '1 week',
      localizedTitle: 'Premium',
      paywallABTestName: 'Onboarding paywall',
      paywallName: 'Onboarding paywall',
      price: 5.99,
      subscriptionPeriod: {
        numberOfUnits: 7,
        unit: 'day',
      },
      variationId: 'var_1',
      vendorProductId: 'weekly.premium.599',
    },
    {
      currencyCode: 'USD',
      currencySymbol: '$',
      introductoryDiscount: {
        ios: {
          paymentMode: 'pay_as_you_go',
        },
        localizedNumberOfPeriods: '1 year',
        localizedPrice: '$29.99',
        localizedSubscriptionPeriod: '1 year',
        numberOfPeriods: 1,
        price: 29.99,
        subscriptionPeriod: {
          numberOfUnits: 1,
          unit: 'year',
        },
      },
      introductoryOfferEligibility: 'unknown',
      ios: {
        discounts: [
          {
            ios: {
              identifier: 'promo50off',
              paymentMode: 'pay_as_you_go',
            },
            localizedNumberOfPeriods: '1 year',
            localizedPrice: '$29.99',
            localizedSubscriptionPeriod: '1 year',
            numberOfPeriods: 1,
            price: 29.99,
            subscriptionPeriod: {
              numberOfUnits: 1,
              unit: 'year',
            },
          },
        ],
        isFamilyShareable: false,
        regionCode: 'US',
        subscriptionGroupIdentifier: '20770576',
      },
      localizedDescription: 'Yearly premium',
      localizedPrice: '$69.99',
      localizedSubscriptionPeriod: '1 year',
      localizedTitle: 'Premium',
      paywallABTestName: 'Onboarding paywall',
      paywallName: 'Onboarding paywall',
      price: 69.99,
      subscriptionPeriod: {
        numberOfUnits: 1,
        unit: 'year',
      },
      variationId: '7de7f227-9a0e-4c95-8c60-ab6768cd3caf',
      vendorProductId: 'yearly.premium.6999',
    },
  ];

  const productsInvalid = {
    vendor_product_id: 'monthly.premium.999',
    subscription_period: { number_of_units: 1, unit: 'month' },
    region_code: 'US',
  };

  it('should decode-encode', () => {
    products.forEach((product, index) => {
      const coder = AdaptyProductCoder.tryDecode(products[2]);
      // products[2]
      // console.log('aa', JSON.stringify(coder.tryDecode(), null, 2));

      expect(coder.toObject()).toStrictEqual(expected[2]);
      expect(coder.encode()).toStrictEqual(products[2]);
    });
  });
  it('should not decode (missing required)', () => {
    expect(() => AdaptyProductCoder.tryDecode(productsInvalid)).toThrow(
      'Required',
    );
  });
});
