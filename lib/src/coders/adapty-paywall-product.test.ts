import type { AdaptyPaywallProduct } from '@/types';
import type { Schema } from '@/types/schema';
import { AdaptyPriceCoder } from './adapty-price';
import { AdaptyPaywallProductCoder } from './adapty-paywall-product';
import { AdaptySubscriptionDetailsCoder } from './adapty-subscription-details';

type Model = AdaptyPaywallProduct;
const mocks: Schema['Output.AdaptyPaywallProduct'][] = [
  {
    is_family_shareable: false,
    localized_description: 'Get premium features with this plan',
    localized_title: 'Yearly Premium Plan',
    paywall_ab_test_name: 'abTest1',
    paywall_name: 'Premium Subscription',
    paywall_variation_id: 'variation1',
    region_code: 'US',
    payload_data: 'examplePayloadData',
    vendor_product_id: 'yearly.premium.6999',
    price: {
      amount: 69.99,
      currency_code: 'USD',
      currency_symbol: '$',
      localized_string: '$69.99',
    },
    subscription_details: {
      subscription_group_identifier: 'group1',
      android_base_plan_id: 'androidPlan1',
      introductory_offer_eligibility: 'eligible',
      android_offer_tags: ['tag1', 'tag2'],
      renewal_type: 'autorenewable',
      subscription_period: {
        unit: 'year',
        number_of_units: 1,
      },
      localized_subscription_period: '1 year',
      introductory_offer_phases: [
        {
          price: {
            amount: 49.99,
            currency_code: 'USD',
            currency_symbol: '$',
            localized_string: '$49.99',
          },
          number_of_periods: 2,
          payment_mode: 'pay_as_you_go',
          subscription_period: {
            unit: 'month',
            number_of_units: 3,
          },
          localized_subscription_period: '3 months',
          localized_number_of_periods: '2',
        },
      ],
      promotional_offer: {
        price: {
          amount: 29.99,
          currency_code: 'USD',
          currency_symbol: '$',
          localized_string: '$29.99',
        },
        number_of_periods: 1,
        payment_mode: 'free_trial',
        subscription_period: {
          unit: 'month',
          number_of_units: 1,
        },
        localized_subscription_period: '1 month',
        localized_number_of_periods: '1',
      },
    },
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _price = new AdaptyPriceCoder();
  const _details = new AdaptySubscriptionDetailsCoder();

  return {
    ios: {
      isFamilyShareable: mock.is_family_shareable as boolean,
    },
    localizedDescription: mock.localized_description,
    localizedTitle: mock.localized_title,
    paywallABTestName: mock.paywall_ab_test_name,
    paywallName: mock.paywall_name,
    variationId: mock.paywall_variation_id,
    regionCode: mock.region_code,
    payloadData: mock.payload_data,
    vendorProductId: mock.vendor_product_id,
    ...(mock.price && {
      price: _price.decode(mock.price),
    }),
    ...(mock.subscription_details && {
      subscriptionDetails: _details.decode(mock.subscription_details),
    }),
  };
}

describe('AdaptyPaywallProductCoder', () => {
  let coder: AdaptyPaywallProductCoder;

  beforeEach(() => {
    coder = new AdaptyPaywallProductCoder();
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
