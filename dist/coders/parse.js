"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaywallEvent = exports.parseCommonEvent = exports.parseMethodResult = void 0;
const adapty_error_1 = require("../adapty-error");
const adapty_native_error_1 = require("./adapty-native-error");
const adapty_paywall_1 = require("./adapty-paywall");
const adapty_paywall_product_1 = require("./adapty-paywall-product");
const adapty_profile_1 = require("./adapty-profile");
const array_1 = require("./array");
const bridge_error_1 = require("./bridge-error");
const adapty_remote_config_1 = require("./adapty-remote-config");
const adapty_paywall_builder_1 = require("./adapty-paywall-builder");
const adapty_purchase_result_1 = require("../coders/adapty-purchase-result");
const adapty_onboarding_1 = require("../coders/adapty-onboarding");
const adapty_ui_onboarding_meta_1 = require("../coders/adapty-ui-onboarding-meta");
const adapty_ui_onboarding_state_params_1 = require("../coders/adapty-ui-onboarding-state-params");
const adapty_ui_onboarding_state_updated_action_1 = require("../coders/adapty-ui-onboarding-state-updated-action");
const adapty_installation_status_1 = require("../coders/adapty-installation-status");
const adapty_installation_details_1 = require("../coders/adapty-installation-details");
const AdaptyTypes = [
    'AdaptyError',
    'AdaptyProfile',
    'AdaptyPurchaseResult',
    'AdaptyPaywall',
    'AdaptyPaywallProduct',
    'AdaptyOnboarding',
    'AdaptyRemoteConfig',
    'AdaptyPaywallBuilder',
    'AdaptyInstallationStatus',
    'AdaptyInstallationDetails',
    'AdaptyUiView',
    'AdaptyUiDialogActionType',
    'AdaptyUiOnboardingMeta',
    'AdaptyUiOnboardingStateParams',
    'AdaptyUiOnboardingStateUpdatedAction',
    'Array<AdaptyPaywallProduct>',
    'BridgeError',
    'String',
    'Boolean',
    'Void',
];
function parseMethodResult(input, resultType, ctx) {
    const log = ctx === null || ctx === void 0 ? void 0 : ctx.decode({ methodName: 'parseMethodResult' });
    log === null || log === void 0 ? void 0 : log.start({ input });
    let obj;
    // Attempt to parse the input into a JSON object
    try {
        obj = JSON.parse(input);
    }
    catch (error) {
        const adaptyError = adapty_error_1.AdaptyError.failedToDecode(`Failed to decode native response. JSON.parse raised an error: ${(error === null || error === void 0 ? void 0 : error.message) || ''}`);
        log === null || log === void 0 ? void 0 : log.failed(adaptyError.message);
        throw adaptyError;
    }
    if (obj.hasOwnProperty('success')) {
        if ([
            'String',
            'Boolean',
            'Void',
            'AdaptyUiView',
            'AdaptyUiDialogActionType',
        ].includes(resultType)) {
            return obj.success;
        }
        const coder = getCoder(resultType, ctx);
        return coder === null || coder === void 0 ? void 0 : coder.decode(obj.success);
    }
    else if (obj.hasOwnProperty('error')) {
        const coder = getCoder('AdaptyError', ctx);
        const errorData = coder === null || coder === void 0 ? void 0 : coder.decode(obj.error);
        throw coder.getError(errorData);
    }
    else {
        const adaptyError = adapty_error_1.AdaptyError.failedToDecode(`Failed to decode native response. Response does not have expected "success" or "error" property`);
        log === null || log === void 0 ? void 0 : log.failed(adaptyError.message);
        throw adaptyError;
    }
}
exports.parseMethodResult = parseMethodResult;
function parseCommonEvent(event, input, ctx) {
    var _a, _b, _c;
    let obj;
    try {
        obj = JSON.parse(input);
    }
    catch (error) {
        throw adapty_error_1.AdaptyError.failedToDecode(`Failed to decode event: ${error === null || error === void 0 ? void 0 : error.message}`);
    }
    switch (event) {
        case 'did_load_latest_profile':
            return (_a = getCoder('AdaptyProfile', ctx)) === null || _a === void 0 ? void 0 : _a.decode(obj['profile']);
        case 'on_installation_details_success':
            return (_b = getCoder('AdaptyInstallationDetails', ctx)) === null || _b === void 0 ? void 0 : _b.decode(obj['details']);
        case 'on_installation_details_fail':
            return (_c = getCoder('AdaptyError', ctx)) === null || _c === void 0 ? void 0 : _c.decode(obj['error']);
        default:
            return null;
    }
}
exports.parseCommonEvent = parseCommonEvent;
function parsePaywallEvent(input, ctx) {
    var _a, _b, _c, _d;
    const log = ctx === null || ctx === void 0 ? void 0 : ctx.decode({ methodName: 'parsePaywallEvent' });
    log === null || log === void 0 ? void 0 : log.start({ input });
    let obj;
    try {
        obj = JSON.parse(input);
    }
    catch (error) {
        throw adapty_error_1.AdaptyError.failedToDecode(`Failed to decode event: ${error === null || error === void 0 ? void 0 : error.message}`);
    }
    const result = {};
    if (obj.hasOwnProperty('id')) {
        result['id'] = obj['id'];
    }
    if (obj.hasOwnProperty('profile')) {
        result['profile'] = (_a = getCoder('AdaptyProfile', ctx)) === null || _a === void 0 ? void 0 : _a.decode(obj['profile']);
    }
    if (obj.hasOwnProperty('product')) {
        result['product'] = (_b = getCoder('AdaptyPaywallProduct', ctx)) === null || _b === void 0 ? void 0 : _b.decode(obj['product']);
    }
    if (obj.hasOwnProperty('error')) {
        result['error'] = (_c = getCoder('AdaptyError', ctx)) === null || _c === void 0 ? void 0 : _c.decode(obj['error']);
    }
    if (obj.hasOwnProperty('action')) {
        result['action'] = obj['action'];
    }
    if (obj.hasOwnProperty('view')) {
        result['view'] = obj['view'];
    }
    if (obj.hasOwnProperty('product_id')) {
        result['product_id'] = obj['product_id'];
    }
    if (obj.hasOwnProperty('purchased_result')) {
        result['purchased_result'] = (_d = getCoder('AdaptyPurchaseResult', ctx)) === null || _d === void 0 ? void 0 : _d.decode(obj['purchased_result']);
    }
    return result;
}
exports.parsePaywallEvent = parsePaywallEvent;
function getCoder(type, ctx) {
    ctx === null || ctx === void 0 ? void 0 : ctx.stack;
    switch (type) {
        case 'AdaptyError':
            return new adapty_native_error_1.AdaptyNativeErrorCoder();
        case 'AdaptyProfile':
            return new adapty_profile_1.AdaptyProfileCoder();
        case 'AdaptyPaywall':
            return new adapty_paywall_1.AdaptyPaywallCoder();
        case 'AdaptyPaywallProduct':
            return new adapty_paywall_product_1.AdaptyPaywallProductCoder();
        case 'AdaptyRemoteConfig':
            return new adapty_remote_config_1.AdaptyRemoteConfigCoder();
        case 'AdaptyPaywallBuilder':
            return new adapty_paywall_builder_1.AdaptyPaywallBuilderCoder();
        case 'AdaptyOnboarding':
            return new adapty_onboarding_1.AdaptyOnboardingCoder();
        case 'AdaptyPurchaseResult':
            return new adapty_purchase_result_1.AdaptyPurchaseResultCoder();
        case 'AdaptyInstallationStatus':
            return new adapty_installation_status_1.AdaptyInstallationStatusCoder();
        case 'AdaptyInstallationDetails':
            return new adapty_installation_details_1.AdaptyInstallationDetailsCoder();
        case 'AdaptyUiOnboardingMeta':
            return new adapty_ui_onboarding_meta_1.AdaptyUiOnboardingMetaCoder();
        case 'AdaptyUiOnboardingStateParams':
            return new adapty_ui_onboarding_state_params_1.AdaptyUiOnboardingStateParamsCoder();
        case 'AdaptyUiOnboardingStateUpdatedAction':
            return new adapty_ui_onboarding_state_updated_action_1.AdaptyUiOnboardingStateUpdatedActionCoder();
        case 'BridgeError':
            return new bridge_error_1.BridgeErrorCoder();
        case 'Array<AdaptyPaywallProduct>':
            return new array_1.ArrayCoder(adapty_paywall_product_1.AdaptyPaywallProductCoder);
        case 'String':
            return null;
    }
    // @ts-ignore
    throw adapty_error_1.AdaptyError.failedToDecode(`Failed to decode native response. Response has unexpected "type" property: ${type}`);
}
//# sourceMappingURL=parse.js.map