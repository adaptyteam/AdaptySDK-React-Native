import type {
  AdaptyAccessLevel,
  CancellationReason,
  OfferType,
  VendorStore,
} from '@/types';
import type { Def } from '@/types/schema';
import { AdaptyAccessLevelCoder } from './adapty-access-level';

type Model = AdaptyAccessLevel;
const mocks: Def['AdaptyProfile.AccessLevel'][] = [
  {
    activated_at: '2023-08-08T12:00:00.000Z',
    active_introductory_offer_type: 'offer1',
    active_promotional_offer_id: 'iosOffer1',
    active_promotional_offer_type: 'promo1',
    billing_issue_detected_at: '2023-08-08T12:00:00.000Z',
    cancellation_reason: 'user_cancelled',
    expires_at: '2023-10-08T12:00:00.000Z',
    id: 'accessLevel1',
    is_active: true,
    is_in_grace_period: false,
    is_lifetime: false,
    is_refund: false,
    offer_id: 'androidOffer1',
    renewed_at: '2023-09-08T12:00:00.000Z',
    starts_at: '2023-08-08T12:00:00.000Z',
    store: 'appstore',
    unsubscribed_at: '2023-08-08T12:00:00.000Z',
    vendor_product_id: 'product1',
    will_renew: true,
  },
  {
    activated_at: '2023-07-15T14:30:00.000Z',
    id: 'accessLevel2',
    is_active: false,
    is_in_grace_period: true,
    is_lifetime: true,
    store: 'appstore',
    is_refund: true,
    will_renew: false,
    vendor_product_id: 'product1',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    activatedAt: new Date(mock.activated_at),
    ...(mock.cancellation_reason && {
      cancellationReason: mock.cancellation_reason as CancellationReason,
    }),
    ...(mock.expires_at && { expiresAt: new Date(mock.expires_at) }),
    id: mock.id,
    isActive: mock.is_active,
    isInGracePeriod: mock.is_in_grace_period,
    isLifetime: mock.is_lifetime,
    isRefund: mock.is_refund,
    ...(mock.renewed_at && { renewedAt: new Date(mock.renewed_at) }),
    store: mock.store as VendorStore,
    ...(mock.starts_at && { startsAt: new Date(mock.starts_at) }),
    ...(mock.billing_issue_detected_at && {
      billingIssueDetectedAt: new Date(mock.billing_issue_detected_at),
    }),
    ...(mock.unsubscribed_at && {
      unsubscribedAt: new Date(mock.unsubscribed_at),
    }),
    vendorProductId: mock.vendor_product_id as string,
    willRenew: mock.will_renew,
    ...(mock.active_introductory_offer_type && {
      activeIntroductoryOfferType:
        mock.active_introductory_offer_type as OfferType,
    }),
    ...(mock.active_promotional_offer_id && {
      activePromotionalOfferId: mock.active_promotional_offer_id,
    }),
    ...(mock.active_promotional_offer_type && {
      activePromotionalOfferType:
        mock.active_promotional_offer_type as OfferType,
    }),
    android: {
      ...(mock.offer_id && {
        offerId: mock.offer_id,
      }),
    },
  };
}

describe('AdaptyAccessLevelCoder', () => {
  let coder: AdaptyAccessLevelCoder;

  beforeEach(() => {
    coder = new AdaptyAccessLevelCoder();
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
