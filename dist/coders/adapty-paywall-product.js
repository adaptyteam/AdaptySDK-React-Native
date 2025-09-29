"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPaywallProductCoder = void 0;
const coder_1 = require("./coder");
const adapty_price_1 = require("./adapty-price");
const adapty_subscription_details_1 = require("./adapty-subscription-details");
class AdaptyPaywallProductCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            vendorProductId: {
                key: 'vendor_product_id',
                required: true,
                type: 'string',
            },
            adaptyId: {
                key: 'adapty_product_id',
                required: true,
                type: 'string',
            },
            paywallProductIndex: {
                key: 'paywall_product_index',
                required: true,
                type: 'number',
            },
            localizedDescription: {
                key: 'localized_description',
                required: true,
                type: 'string',
            },
            localizedTitle: { key: 'localized_title', required: true, type: 'string' },
            regionCode: { key: 'region_code', required: false, type: 'string' },
            variationId: {
                key: 'paywall_variation_id',
                required: true,
                type: 'string',
            },
            paywallABTestName: {
                key: 'paywall_ab_test_name',
                required: true,
                type: 'string',
            },
            paywallName: { key: 'paywall_name', required: true, type: 'string' },
            price: {
                key: 'price',
                required: false,
                type: 'object',
                converter: new adapty_price_1.AdaptyPriceCoder(),
            },
            webPurchaseUrl: {
                key: 'web_purchase_url',
                required: false,
                type: 'string',
            },
            payloadData: { key: 'payload_data', required: false, type: 'string' },
            subscription: {
                key: 'subscription',
                required: false,
                type: 'object',
                converter: new adapty_subscription_details_1.AdaptySubscriptionDetailsCoder(),
            },
            ios: {
                isFamilyShareable: {
                    key: 'is_family_shareable',
                    required: true,
                    type: 'boolean',
                },
            },
        };
    }
    getInput(data) {
        var _a, _b;
        return {
            adapty_product_id: data.adapty_product_id,
            paywall_product_index: data.paywall_product_index,
            paywall_ab_test_name: data.paywall_ab_test_name,
            payload_data: data.payload_data,
            paywall_name: data.paywall_name,
            paywall_variation_id: data.paywall_variation_id,
            subscription_offer_identifier: (_b = (_a = data.subscription) === null || _a === void 0 ? void 0 : _a.offer) === null || _b === void 0 ? void 0 : _b.offer_identifier,
            vendor_product_id: data.vendor_product_id,
        };
    }
}
exports.AdaptyPaywallProductCoder = AdaptyPaywallProductCoder;
//# sourceMappingURL=adapty-paywall-product.js.map