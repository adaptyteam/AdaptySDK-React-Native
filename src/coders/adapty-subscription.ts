import type { AdaptySubscription } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { DateCoder } from './date';

type Model = AdaptySubscription;
type Serializable = Def['AdaptyProfile.Subscription'];

export class AdaptySubscriptionCoder extends SimpleCoder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    isActive: {
      key: 'is_active',
      required: true,
      type: 'boolean',
    },
    isLifetime: {
      key: 'is_lifetime',
      required: true,
      type: 'boolean',
    },
    vendorProductId: {
      key: 'vendor_product_id',
      required: true,
      type: 'string',
    },
    store: {
      key: 'store',
      required: true,
      type: 'string',
    },
    vendorTransactionId: {
      key: 'vendor_transaction_id',
      required: true,
      type: 'string',
    },
    vendorOriginalTransactionId: {
      key: 'vendor_original_transaction_id',
      required: true,
      type: 'string',
    },
    activatedAt: {
      key: 'activated_at',
      required: true,
      type: 'string',
      converter: new DateCoder(),
    },
    willRenew: {
      key: 'will_renew',
      required: true,
      type: 'boolean',
    },
    isInGracePeriod: {
      key: 'is_in_grace_period',
      required: true,
      type: 'boolean',
    },
    isRefund: {
      key: 'is_refund',
      required: true,
      type: 'boolean',
    },
    isSandbox: {
      key: 'is_sandbox',
      required: true,
      type: 'boolean',
    },
    renewedAt: {
      key: 'renewed_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    expiresAt: {
      key: 'expires_at',
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
    unsubscribedAt: {
      key: 'unsubscribed_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    billingIssueDetectedAt: {
      key: 'billing_issue_detected_at',
      required: false,
      type: 'string',
      converter: new DateCoder(),
    },
    activeIntroductoryOfferType: {
      key: 'active_introductory_offer_type',
      required: false,
      type: 'string',
    },
    activePromotionalOfferType: {
      key: 'active_promotional_offer_type',
      required: false,
      type: 'string',
    },
    activePromotionalOfferId: {
      key: 'active_promotional_offer_id',
      required: false,
      type: 'string',
    },
    cancellationReason: {
      key: 'cancellation_reason',
      required: false,
      type: 'string',
    },
  };
}
