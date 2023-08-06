import { AdaptySubscriptionCoder } from './adapty-subscription';

describe('AdaptySubscriptionCoder', () => {
  it('should correctly decode and encode subscription data', () => {
    const coder = new AdaptySubscriptionCoder();

    const data = [
      {
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
      {
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
    ];

    for (const item of data) {
      // Test decoding
      const decoded = coder.decode(item);
      expect(decoded).toBeDefined();

      // Test encoding
      const encoded = coder.encode(decoded);
      expect(encoded).toBeDefined();

      // Test that encoding the decoded data gives back the original data
      expect(encoded).toEqual(item);
    }
  });
});
