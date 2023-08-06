import { AdaptyAccessLevelCoder } from './adapty-access-level';

describe('AdaptyAccessLevelCoder', () => {
  let coder: AdaptyAccessLevelCoder;

  beforeEach(() => {
    coder = new AdaptyAccessLevelCoder();
  });

  it('should decode a valid JSON object into an AdaptyAccessLevel object', () => {
    const input = {
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
    };

    const output = coder.decode(input);

    expect(output).toEqual({
      id: 'premium',
      isLifetime: false,
      vendorProductId: 'weekly.premium.599',
      unsubscribedAt: new Date('2023-07-28T08:16:19.000Z'),
      expiresAt: new Date('2023-07-28T08:16:19.000Z'),
      willRenew: false,
      isActive: false,
      isInGracePeriod: false,
      activatedAt: new Date('2023-01-08T12:05:59.000Z'),
      renewedAt: new Date('2023-07-28T08:13:19.000Z'),
      isRefund: false,
      cancellationReason: 'voluntarily_cancelled',
      store: 'app_store',
    });

    const remake = coder.encode(output);
    expect(remake).toEqual(input);
  });
});
