import type { AdaptyPurchaseResult } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptyPurchaseResultCoder } from '@/coders/adapty-purchase-result';
import { AdaptyProfileCoder } from '@/coders/adapty-profile';
import { Platform } from 'react-native';

type Model = AdaptyPurchaseResult;
type TestAdaptyPurchaseResultDef =
  | Exclude<Def['AdaptyPurchaseResult'], { type: 'success' }>
  | {
      type: 'success';
      profile: Omit<
        Def['AdaptyProfile'],
        'segment_hash' | 'is_test_user' | 'timestamp'
      >;
      apple_jws_transaction?: string;
      google_purchase_token?: string;
    };
const mocks: TestAdaptyPurchaseResultDef[] = [
  {
    type: 'success',
    profile: {
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
  },
  {
    type: 'success',
    profile: {
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
    apple_jws_transaction: 'test_apple_jws_transaction',
  },
  {
    type: 'success',
    profile: {
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
    google_purchase_token: 'test_google_purchase_token',
  },
  { type: 'pending' },
  { type: 'user_cancelled' },
];

function toModel(mock: (typeof mocks)[number]): Model {
  const _profile = new AdaptyProfileCoder();
  if (mock.type === 'success') {
    return {
      type: mock.type,
      profile: _profile.decode(mock.profile as any),
      ...(Platform.OS === 'ios' && mock.apple_jws_transaction
        ? { ios: { jwsTransaction: mock.apple_jws_transaction } }
        : {}),
      ...(Platform.OS === 'android' && mock.google_purchase_token
        ? { android: { purchaseToken: mock.google_purchase_token } }
        : {}),
    };
  } else {
    return {
      type: mock.type,
    };
  }
}

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('AdaptyPurchaseResultCoder', () => {
  let coder: AdaptyPurchaseResultCoder;

  beforeEach(() => {
    coder = new AdaptyPurchaseResultCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const originalPlatform = require('react-native').Platform;
    if (mock.apple_jws_transaction) {
      require('react-native').Platform = { OS: 'ios' };
    }
    if (mock.google_purchase_token) {
      require('react-native').Platform = { OS: 'android' };
    }

    const decoded = coder.decode(mock as any);

    expect(decoded).toStrictEqual(toModel(mock));

    require('react-native').Platform = originalPlatform;
  });

  it.each(mocks)('should decode/encode', mock => {
    const originalPlatform = require('react-native').Platform;
    if (mock.apple_jws_transaction) {
      require('react-native').Platform = { OS: 'ios' };
    }
    if (mock.google_purchase_token) {
      require('react-native').Platform = { OS: 'android' };
    }

    const decoded = coder.decode(mock as any);
    const encoded = coder.encode(decoded);

    expect(encoded).toStrictEqual(mock);

    require('react-native').Platform = originalPlatform;
  });
});
