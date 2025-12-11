"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyUiMediaCacheCoder = void 0;
const coder_1 = require("./coder");
class AdaptyUiMediaCacheCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            memoryStorageTotalCostLimit: {
                key: 'memory_storage_total_cost_limit',
                required: false,
                type: 'number',
            },
            memoryStorageCountLimit: {
                key: 'memory_storage_count_limit',
                required: false,
                type: 'number',
            },
            diskStorageSizeLimit: {
                key: 'disk_storage_size_limit',
                required: false,
                type: 'number',
            },
        };
    }
}
exports.AdaptyUiMediaCacheCoder = AdaptyUiMediaCacheCoder;
//# sourceMappingURL=adapty-ui-media-cache.js.map