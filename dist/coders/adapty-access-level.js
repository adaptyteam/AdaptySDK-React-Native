"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyAccessLevelCoder = void 0;
const coder_1 = require("./coder");
const date_1 = require("./date");
class AdaptyAccessLevelCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            activatedAt: {
                key: 'activated_at',
                required: true,
                type: 'string',
                converter: new date_1.DateCoder(),
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
                converter: new date_1.DateCoder(),
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
                converter: new date_1.DateCoder(),
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
                converter: new date_1.DateCoder(),
            },
            startsAt: {
                key: 'starts_at',
                required: false,
                type: 'string',
                converter: new date_1.DateCoder(),
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
                converter: new date_1.DateCoder(),
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
}
exports.AdaptyAccessLevelCoder = AdaptyAccessLevelCoder;
//# sourceMappingURL=adapty-access-level.js.map