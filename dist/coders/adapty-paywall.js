"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPaywallCoder = void 0;
const tslib_1 = require("tslib");
const product_reference_1 = require("./product-reference");
const array_1 = require("./array");
const coder_1 = require("./coder");
const adapty_remote_config_1 = require("./adapty-remote-config");
const adapty_paywall_builder_1 = require("./adapty-paywall-builder");
const adapty_placement_1 = require("../coders/adapty-placement");
class AdaptyPaywallCoder extends coder_1.Coder {
    constructor() {
        super(...arguments);
        this.properties = {
            placement: {
                key: 'placement',
                required: true,
                type: 'object',
                converter: new adapty_placement_1.AdaptyPlacementCoder(),
            },
            id: { key: 'paywall_id', required: true, type: 'string' },
            name: { key: 'paywall_name', required: true, type: 'string' },
            products: {
                key: 'products',
                required: true,
                type: 'array',
                converter: new array_1.ArrayCoder(product_reference_1.ProductReferenceCoder),
            },
            remoteConfig: {
                key: 'remote_config',
                required: false,
                type: 'object',
                converter: new adapty_remote_config_1.AdaptyRemoteConfigCoder(),
            },
            variationId: { key: 'variation_id', required: true, type: 'string' },
            version: { key: 'response_created_at', required: false, type: 'number' },
            paywallBuilder: {
                key: 'paywall_builder',
                required: false,
                type: 'object',
                converter: new adapty_paywall_builder_1.AdaptyPaywallBuilderCoder(),
            },
            webPurchaseUrl: {
                key: 'web_purchase_url',
                required: false,
                type: 'string',
            },
            payloadData: { key: 'payload_data', required: false, type: 'string' },
            requestLocale: { key: 'request_locale', required: true, type: 'string' },
        };
    }
    decode(data) {
        const codablePart = super.decode(data);
        return Object.assign(Object.assign({}, codablePart), { hasViewConfiguration: codablePart.paywallBuilder !== undefined, productIdentifiers: codablePart.products.map(product => {
                var _a;
                return ({
                    vendorProductId: product.vendorId,
                    adaptyProductId: product.adaptyId,
                    basePlanId: (_a = product.android) === null || _a === void 0 ? void 0 : _a.basePlanId,
                });
            }) });
    }
    encode(data) {
        const { hasViewConfiguration, productIdentifiers } = data, codablePart = tslib_1.__rest(data, ["hasViewConfiguration", "productIdentifiers"]);
        return super.encode(codablePart);
    }
}
exports.AdaptyPaywallCoder = AdaptyPaywallCoder;
//# sourceMappingURL=adapty-paywall.js.map