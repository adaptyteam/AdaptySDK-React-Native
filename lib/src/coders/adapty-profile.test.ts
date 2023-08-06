import { AdaptyProfileCoder } from './adapty-profile';

describe('AdaptyProfileCoder', () => {
  const coder = new AdaptyProfileCoder();
  const input = {
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
  };

  it('should decode and encode to the same value', () => {
    const decoded = coder.decode(input);
    const encoded = coder.encode(decoded);

    expect(encoded).toEqual(input);
  });
});
