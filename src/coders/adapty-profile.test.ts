import type { Def } from '@/types/schema';
import type { AdaptyNonSubscription, AdaptyProfile } from '@/types';
import { AdaptyProfileCoder } from './adapty-profile';
import { AdaptyAccessLevelCoder } from './adapty-access-level';
import { HashmapCoder } from './hashmap';
import { AdaptySubscriptionCoder } from './adapty-subscription';
import { AdaptyNonSubscriptionCoder } from './adapty-non-subscription';
import { ArrayCoder } from './array';

type Model = AdaptyProfile;
const mocks: Omit<
  Def['AdaptyProfile'],
  'segment_hash' | 'is_test_user' | 'timestamp'
>[] = [
  {
    customer_user_id: '57739865-5F09-45FF-8A95-BBB5AB0B4276',
    paid_access_levels: {
      premium: {
        id: 'premium',
        is_lifetime: false,
        vendor_product_id: 'weekly.premium.599',
        unsubscribed_at: '2023-07-28T08:16:19.000Z',
        expires_at: '2023-07-28T08:16:19.000Z',
        will_renew: false,
        is_active: false,
        is_in_grace_period: false,
        activated_at: '2023-01-08T12:05:59.000Z',
        renewed_at: '2023-07-28T08:13:19.000Z',
        is_refund: false,
        cancellation_reason: 'voluntarily_cancelled',
        store: 'app_store',
      },
    },
    custom_attributes: {},
    subscriptions: {
      'monthly.premium.999': {
        is_lifetime: false,
        vendor_product_id: 'monthly.premium.999',
        is_sandbox: true,
        unsubscribed_at: '2023-01-12T11:36:38.000Z',
        expires_at: '2023-01-12T11:36:38.000Z',
        will_renew: false,
        vendor_transaction_id: '2000000248420224',
        vendor_original_transaction_id: '2000000244587785',
        is_in_grace_period: false,
        activated_at: '2023-01-08T12:05:59.000Z',
        is_active: false,
        renewed_at: '2023-01-12T11:31:38.000Z',
        is_refund: false,
        store: 'app_store',
      },
      'weekly.premium.599': {
        is_lifetime: false,
        vendor_product_id: 'weekly.premium.599',
        is_sandbox: true,
        unsubscribed_at: '2023-07-28T08:16:19.000Z',
        expires_at: '2023-07-28T08:16:19.000Z',
        will_renew: false,
        vendor_transaction_id: '2000000378024239',
        vendor_original_transaction_id: '2000000244587785',
        is_in_grace_period: false,
        activated_at: '2023-01-08T12:05:59.000Z',
        is_active: false,
        renewed_at: '2023-07-28T08:13:19.000Z',
        is_refund: false,
        store: 'app_store',
        cancellation_reason: 'voluntarily_cancelled',
      },
    },
    profile_id: '69a4be0c-7ee2-4669-b637-814a60494346',
  },
  {
    non_subscriptions: {
      adapty_product_1: [
        {
          is_sandbox: true,
          vendor_product_id: 'adapty_product_1',
          is_consumable: false,
          purchased_at: '2020-10-23T07:42:00.000Z',
          vendor_transaction_id: 'GPA.3316-9977-7087-23521',
          purchase_id: 'ec4323b1-a83e-4ed2-be3f-370300323979',
          is_refund: false,
          store: 'play_store',
        },
      ],
      consumable_apples_99: [
        {
          is_sandbox: true,
          vendor_product_id: 'consumable_apples_99',
          is_consumable: true,
          purchased_at: '2023-02-24T12:14:27.000Z',
          vendor_transaction_id: 'GPA.3385-8493-4264-13908',
          purchase_id: 'dba87b14-9d8e-442e-8562-e647b4c6143d',
          is_refund: false,
          store: 'play_store',
        },
      ],
      adapty_product_2: [
        {
          is_sandbox: true,
          vendor_product_id: 'adapty_product_2',
          is_consumable: false,
          purchased_at: '2020-10-23T08:00:00.000Z',
          vendor_transaction_id: 'GPA.3311-5363-7214-69403',
          purchase_id: '269363f6-5617-4c99-ad2e-c1213f403e60',
          is_refund: false,
          store: 'play_store',
        },
      ],
    },
    customer_user_id: 'divan',
    paid_access_levels: {
      premium: {
        id: 'premium',
        is_lifetime: false,
        vendor_product_id: 'weekly.premium.599',
        unsubscribed_at: '2023-08-06T06:56:22.000Z',
        expires_at: '2023-08-06T06:56:22.000Z',
        will_renew: false,
        is_active: false,
        is_in_grace_period: false,
        activated_at: '2023-01-08T12:05:59.000Z',
        renewed_at: '2023-08-06T06:53:22.000Z',
        is_refund: false,
        cancellation_reason: 'voluntarily_cancelled',
        store: 'app_store',
      },
    },
    custom_attributes: {},
    subscriptions: {
      trial_sub_12: {
        is_lifetime: false,
        vendor_product_id: 'trial_sub_12',
        is_sandbox: true,
        unsubscribed_at: '2023-06-12T07:56:29.483Z',
        expires_at: '2023-06-12T07:56:29.483Z',
        will_renew: false,
        vendor_transaction_id: 'GPA.3351-8241-0272-90828..5',
        vendor_original_transaction_id: 'GPA.3351-8241-0272-90828',
        is_in_grace_period: false,
        activated_at: '2023-06-12T07:21:36.251Z',
        is_active: false,
        renewed_at: '2023-06-12T07:51:29.483Z',
        is_refund: false,
        store: 'play_store',
        cancellation_reason: 'billing_error',
      },
      'weekly.premium.599': {
        is_lifetime: false,
        vendor_product_id: 'weekly.premium.599',
        is_sandbox: true,
        unsubscribed_at: '2023-08-06T06:56:22.000Z',
        expires_at: '2023-08-06T06:56:22.000Z',
        will_renew: false,
        vendor_transaction_id: '2000000383944152',
        vendor_original_transaction_id: '2000000244587785',
        is_in_grace_period: false,
        activated_at: '2023-01-08T12:05:59.000Z',
        is_active: false,
        renewed_at: '2023-08-06T06:53:22.000Z',
        is_refund: false,
        store: 'app_store',
        cancellation_reason: 'voluntarily_cancelled',
      },
      'monthly.premium.999': {
        is_lifetime: false,
        vendor_product_id: 'monthly.premium.999',
        is_sandbox: true,
        unsubscribed_at: '2023-01-12T11:36:38.000Z',
        expires_at: '2023-01-12T11:36:38.000Z',
        will_renew: false,
        vendor_transaction_id: '2000000248420224',
        vendor_original_transaction_id: '2000000244587785',
        is_in_grace_period: false,
        activated_at: '2023-01-08T12:05:59.000Z',
        is_active: false,
        renewed_at: '2023-01-12T11:31:38.000Z',
        is_refund: false,
        store: 'app_store',
      },
    },
    profile_id: 'a2d52e41-3a79-4e8f-9872-63a0545d4711',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _levels = new HashmapCoder(new AdaptyAccessLevelCoder());
  const _subs = new HashmapCoder(new AdaptySubscriptionCoder());
  const _nonsubs = new HashmapCoder(
    new ArrayCoder<AdaptyNonSubscription, AdaptyNonSubscriptionCoder>(
      AdaptyNonSubscriptionCoder,
    ),
  );

  return {
    ...(mock.paid_access_levels && {
      accessLevels: _levels.decode(mock.paid_access_levels),
    }),
    ...(mock.subscriptions && {
      subscriptions: _subs.decode(mock.subscriptions),
    }),
    ...(mock.non_subscriptions && {
      nonSubscriptions: _nonsubs.decode(mock.non_subscriptions),
    }),
    customAttributes: mock.custom_attributes,
    customerUserId: mock.customer_user_id,
    profileId: mock.profile_id,
  };
}

describe('AdaptyProfileCoder', () => {
  let coder: AdaptyProfileCoder;

  beforeEach(() => {
    coder = new AdaptyProfileCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock as any);

    expect(decoded).toStrictEqual(toModel(mock));
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock as any);
    const encoded = coder.encode(decoded);

    expect(encoded).toStrictEqual(mock);
  });
});
