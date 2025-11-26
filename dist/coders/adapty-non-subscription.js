"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyNonSubscriptionCoder = void 0;
const coder_1 = require("./coder");
const date_1 = require("./date");
class AdaptyNonSubscriptionCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            isConsumable: { key: 'is_consumable', required: true, type: 'boolean' },
            isRefund: { key: 'is_refund', required: true, type: 'boolean' },
            isSandbox: { key: 'is_sandbox', required: true, type: 'boolean' },
            purchasedAt: {
                key: 'purchased_at',
                required: true,
                type: 'string',
                converter: new date_1.DateCoder(),
            },
            purchaseId: { key: 'purchase_id', required: true, type: 'string' },
            store: { key: 'store', required: true, type: 'string' },
            vendorProductId: {
                key: 'vendor_product_id',
                required: true,
                type: 'string',
            },
            vendorTransactionId: {
                key: 'vendor_transaction_id',
                required: false,
                type: 'string',
            },
        };
    }
}
exports.AdaptyNonSubscriptionCoder = AdaptyNonSubscriptionCoder;
//# sourceMappingURL=adapty-non-subscription.js.map