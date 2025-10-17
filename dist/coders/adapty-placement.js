"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPlacementCoder = void 0;
const coder_1 = require("./coder");
class AdaptyPlacementCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            abTestName: { key: 'ab_test_name', required: true, type: 'string' },
            audienceName: { key: 'audience_name', required: true, type: 'string' },
            id: { key: 'developer_id', required: true, type: 'string' },
            revision: { key: 'revision', required: true, type: 'number' },
            audienceVersionId: {
                key: 'placement_audience_version_id',
                required: true,
                type: 'string',
            },
            isTrackingPurchases: {
                key: 'is_tracking_purchases',
                required: false,
                type: 'boolean',
            },
        };
    }
}
exports.AdaptyPlacementCoder = AdaptyPlacementCoder;
//# sourceMappingURL=adapty-placement.js.map