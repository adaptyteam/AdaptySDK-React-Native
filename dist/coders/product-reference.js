"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReferenceCoder = void 0;
const coder_1 = require("./coder");
class ProductReferenceCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            vendorId: {
                key: 'vendor_product_id',
                required: true,
                type: 'string',
            },
            adaptyId: {
                key: 'adapty_product_id',
                required: true,
                type: 'string',
            },
            accessLevelId: {
                key: 'access_level_id',
                required: true,
                type: 'string',
            },
            productType: {
                key: 'product_type',
                required: true,
                type: 'string',
            },
            ios: {
                promotionalOfferId: {
                    key: 'promotional_offer_id',
                    required: false,
                    type: 'string',
                },
                winBackOfferId: {
                    key: 'win_back_offer_id',
                    required: false,
                    type: 'string',
                },
            },
            android: {
                basePlanId: {
                    key: 'base_plan_id',
                    required: false,
                    type: 'string',
                },
                offerId: {
                    key: 'offer_id',
                    required: false,
                    type: 'string',
                },
            },
        };
    }
}
exports.ProductReferenceCoder = ProductReferenceCoder;
//# sourceMappingURL=product-reference.js.map