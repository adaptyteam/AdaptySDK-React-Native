"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyProfileCoder = void 0;
const coder_1 = require("./coder");
const adapty_access_level_1 = require("./adapty-access-level");
const adapty_non_subscription_1 = require("./adapty-non-subscription");
const adapty_subscription_1 = require("./adapty-subscription");
const hashmap_1 = require("./hashmap");
const array_1 = require("./array");
class AdaptyProfileCoder extends coder_1.SimpleCoder {
    constructor() {
        super(...arguments);
        this.properties = {
            accessLevels: {
                key: 'paid_access_levels',
                required: false,
                type: 'object',
                converter: new hashmap_1.HashmapCoder(new adapty_access_level_1.AdaptyAccessLevelCoder()),
            },
            customAttributes: {
                key: 'custom_attributes',
                required: false,
                type: 'object',
            },
            customerUserId: {
                key: 'customer_user_id',
                required: false,
                type: 'string',
            },
            nonSubscriptions: {
                key: 'non_subscriptions',
                required: false,
                type: 'object',
                converter: new hashmap_1.HashmapCoder(new array_1.ArrayCoder(adapty_non_subscription_1.AdaptyNonSubscriptionCoder)),
            },
            profileId: {
                key: 'profile_id',
                required: true,
                type: 'string',
            },
            subscriptions: {
                key: 'subscriptions',
                required: false,
                type: 'object',
                converter: new hashmap_1.HashmapCoder(new adapty_subscription_1.AdaptySubscriptionCoder()),
            },
        };
    }
}
exports.AdaptyProfileCoder = AdaptyProfileCoder;
//# sourceMappingURL=adapty-profile.js.map