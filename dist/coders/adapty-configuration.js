"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyConfigurationCoder = void 0;
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const adapty_ui_media_cache_1 = require("../coders/adapty-ui-media-cache");
const version_1 = tslib_1.__importDefault(require("../version"));
class AdaptyConfigurationCoder {
    encode(apiKey, params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const config = {
            api_key: apiKey,
            cross_platform_sdk_name: 'react-native',
            cross_platform_sdk_version: version_1.default,
        };
        if (params.customerUserId) {
            config['customer_user_id'] = params.customerUserId;
        }
        config['observer_mode'] = (_a = params.observerMode) !== null && _a !== void 0 ? _a : false;
        config['ip_address_collection_disabled'] =
            (_b = params.ipAddressCollectionDisabled) !== null && _b !== void 0 ? _b : false;
        if (params.logLevel) {
            config['log_level'] = params.logLevel;
        }
        config['server_cluster'] = (_c = params.serverCluster) !== null && _c !== void 0 ? _c : 'default';
        if (params.backendProxyHost) {
            config['backend_proxy_host'] = params.backendProxyHost;
        }
        if (params.backendProxyPort) {
            config['backend_proxy_port'] = params.backendProxyPort;
        }
        config['activate_ui'] = (_d = params.activateUi) !== null && _d !== void 0 ? _d : true;
        const mediaCacheCoder = new adapty_ui_media_cache_1.AdaptyUiMediaCacheCoder();
        config['media_cache'] = mediaCacheCoder.encode((_e = params.mediaCache) !== null && _e !== void 0 ? _e : {
            memoryStorageTotalCostLimit: 100 * 1024 * 1024,
            memoryStorageCountLimit: 2147483647,
            diskStorageSizeLimit: 100 * 1024 * 1024,
        });
        if (react_native_1.Platform.OS === 'ios') {
            config['apple_idfa_collection_disabled'] =
                (_g = (_f = params.ios) === null || _f === void 0 ? void 0 : _f.idfaCollectionDisabled) !== null && _g !== void 0 ? _g : false;
            if ((_h = params.ios) === null || _h === void 0 ? void 0 : _h.appAccountToken) {
                config['customer_identity_parameters'] = {
                    app_account_token: params.ios.appAccountToken,
                };
            }
        }
        if (react_native_1.Platform.OS === 'android') {
            config['google_adid_collection_disabled'] =
                (_k = (_j = params.android) === null || _j === void 0 ? void 0 : _j.adIdCollectionDisabled) !== null && _k !== void 0 ? _k : false;
            config['google_enable_pending_prepaid_plans'] =
                (_m = (_l = params.android) === null || _l === void 0 ? void 0 : _l.pendingPrepaidPlansEnabled) !== null && _m !== void 0 ? _m : false;
            config['google_local_access_level_allowed'] =
                (_p = (_o = params.android) === null || _o === void 0 ? void 0 : _o.localAccessLevelAllowed) !== null && _p !== void 0 ? _p : false;
            if ((_q = params.android) === null || _q === void 0 ? void 0 : _q.obfuscatedAccountId) {
                config['customer_identity_parameters'] = {
                    obfuscated_account_id: params.android.obfuscatedAccountId,
                };
            }
        }
        return config;
    }
}
exports.AdaptyConfigurationCoder = AdaptyConfigurationCoder;
//# sourceMappingURL=adapty-configuration.js.map