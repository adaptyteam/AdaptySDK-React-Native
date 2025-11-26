import type { Def } from '@/types/schema';
import type { AdaptyAccessLevel } from '../types';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { DateCoder } from './date';

type Model = AdaptyAccessLevel;
type Serializable = Def['AdaptyProfile.AccessLevel'];

export class AdaptyAccessLevelCoder extends SimpleCoder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    activatedAt: {
      key: 'activated_at',
      required: true,
      type: 'string',
      converter: new DateCoder(),
    },
    activeIntroductoryOfferType: {
      key: 'active_introductory_offer_type',
      required: false,
      type: 'string',
    },
    activePromotionalOfferId: {
      key: 'active_promotional_offer_id',
      required: false,
      type: 'string',
    },
    activePromotionalOfferType: {
      key: 'active_promotional_offer_type',
      required: false,
      type: 'string',
    },
    billingIssueDetectedAt: {
      key: 'billing_issue_detected_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    cancellationReason: {
      key: 'cancellation_reason',
      required: false,
      type: 'string',
    },
    expiresAt: {
      key: 'expires_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    id: {
      key: 'id',
      required: true,
      type: 'string',
    },
    isActive: {
      key: 'is_active',
      required: true,
      type: 'boolean',
    },
    isInGracePeriod: {
      key: 'is_in_grace_period',
      required: true,
      type: 'boolean',
    },
    isLifetime: {
      key: 'is_lifetime',
      required: true,
      type: 'boolean',
    },
    isRefund: {
      key: 'is_refund',
      required: true,
      type: 'boolean',
    },
    renewedAt: {
      key: 'renewed_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    startsAt: {
      key: 'starts_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    store: {
      key: 'store',
      required: true,
      type: 'string',
    },
    unsubscribedAt: {
      key: 'unsubscribed_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    vendorProductId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    willRenew: {
      key: 'will_renew',
      required: true,
      type: 'boolean',
    },
    android: {
      offerId: {
        key: 'offer_id',
        required: false,
        type: 'string',
      },
    },
  };
}
