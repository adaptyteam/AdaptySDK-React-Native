const {
  AdaptyProfileCoder,
} = require('../../lib/dist/internal/coders/AdaptyProfile');

describe('AdaptyProfileCoder', () => {
  const profile = {
    customer_user_id: 'divan_2',
    paid_access_levels: {
      premium: {
        renewed_at: '2023-01-08T15:08:55.000+0300',
        is_lifetime: false,
        vendor_product_id: 'weekly.premium.599',
        id: 'premium',
        expires_at: '2023-01-08T15:11:55.000+0300',
        activated_at: '2023-01-08T15:05:59.000+0300',
        is_refund: false,
        will_renew: true,
        is_in_grace_period: false,
        is_active: true,
        store: 'app_store',
      },
    },
    custom_attributes: {
      foo: 23,
      bar: 'hello',
    },
    subscriptions: {
      'weekly.premium.599': {
        is_lifetime: false,
        vendor_product_id: 'weekly.premium.599',
        is_sandbox: true,
        expires_at: '2023-01-08T15:11:55.000+0300',
        will_renew: true,
        vendor_transaction_id: '2000000244588337',
        vendor_original_transaction_id: '2000000244587785',
        is_in_grace_period: false,
        activated_at: '2023-01-08T15:05:59.000+0300',
        is_active: true,
        renewed_at: '2023-01-08T15:08:55.000+0300',
        is_refund: false,
        store: 'app_store',
      },
    },
    profile_id: 'ff7c28c7-013c-41c4-8dcb-99496f27ae3e',
  };

  it('should decode', () => {
    const decoder = AdaptyProfileCoder.tryDecode(profile);

    const expected = {
      accessLevels: {
        premium: {
          activatedAt: new Date('2023-01-08T12:05:59.000Z'),
          expiresAt: new Date('2023-01-08T12:11:55.000Z'),
          id: 'premium',
          isActive: true,
          isInGracePeriod: false,
          isLifetime: false,
          isRefund: false,
          renewedAt: new Date('2023-01-08T12:08:55.000Z'),
          store: 'app_store',
          vendorProductId: 'weekly.premium.599',
          willRenew: true,
        },
      },
      customAttributes: { foo: 23, bar: 'hello' },
      customerUserId: 'divan_2',
      nonSubscriptions: {},
      profileId: 'ff7c28c7-013c-41c4-8dcb-99496f27ae3e',
      subscriptions: {
        'weekly.premium.599': {
          activatedAt: new Date('2023-01-08T12:05:59.000Z'),
          activeIntroductoryOfferType: undefined,
          activePromotionalOfferId: undefined,
          activePromotionalOfferType: undefined,
          billingIssueDetectedAt: undefined,
          cancellationReason: undefined,
          expiresAt: new Date('2023-01-08T12:11:55.000Z'),
          isActive: true,
          isInGracePeriod: false,
          isLifetime: false,
          isRefund: false,
          isSandbox: true,
          renewedAt: new Date('2023-01-08T12:08:55.000Z'),
          startsAt: undefined,
          store: 'app_store',
          unsubscribedAt: undefined,
          vendorOriginalTransactionId: '2000000244587785',
          vendorProductId: 'weekly.premium.599',
          vendorTransactionId: '2000000244588337',
          willRenew: true,
        },
      },
    };

    expect(decoder.toObject()).toStrictEqual(expected);
  });
  // it('should not decode (missing required)', () => {
  //   expect(() => AdaptyPaywallCoder.tryDecode(paywall2)).toThrow('Required');
  // });
  // it('should not decode (missing required)', () => {
  //   const coder = AdaptyProfileCoder.tryDecode(profileXX);
  //   console.log(coder.toObject());
  // });
});
