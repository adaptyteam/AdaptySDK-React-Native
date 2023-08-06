import { AdaptyNonSubscriptionCoder } from './adapty-non-subscription';

describe('AdaptyNonSubscriptionCoder', () => {
  it('should correctly decode and encode non-subscription data', () => {
    const coder = new AdaptyNonSubscriptionCoder();

    const data = {
      purchase_id: 'purchase_123',
      store: 'app_store',
      vendor_product_id: 'product_456',
      vendor_transaction_id: 'transaction_789',
      purchased_at: new Date().toISOString(),
      is_sandbox: false,
      is_refund: false,
      is_consumable: true,
    };

    // Test decoding
    const decoded = coder.decode(data);
    expect(decoded).toBeDefined();

    // Test encoding
    const encoded = coder.encode(decoded);
    expect(encoded).toBeDefined();

    // Test that encoding the decoded data gives back the original data
    expect(encoded).toEqual(data);
  });
});
