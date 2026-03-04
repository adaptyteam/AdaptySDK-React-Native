"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRequestHandler = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("../logger");
const parse_1 = require("../coders/parse");
const parse_paywall_1 = require("../coders/parse-paywall");
const parse_onboarding_1 = require("../coders/parse-onboarding");
const mock_store_1 = require("./mock-store");
const mock_data_1 = require("./mock-data");
const utils_1 = require("../utils");
const factory_1 = require("../coders/factory");
/**
 * Simple event emitter for mock events
 */
class SimpleEventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    addListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        return {
            remove: () => {
                var _a;
                (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.delete(callback);
            },
        };
    }
    emit(event, ...args) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(...args);
                }
                catch (error) {
                    const ctx = new logger_1.LogContext();
                    const log = ctx.event({ methodName: `mock/${event}` });
                    log.failed(() => ({ error }));
                }
            });
        }
    }
    removeAllListeners() {
        this.listeners.clear();
    }
}
/**
 * Mock implementation of NativeRequestHandler
 * Returns mock data instead of calling native modules
 */
class MockRequestHandler {
    constructor(config = {}) {
        this.store = new mock_store_1.MockStore(config);
        this.emitter = new SimpleEventEmitter();
        this.listeners = new Set();
    }
    /**
     * Provides access to internal emitter for testing purposes only
     * @internal
     */
    get testEmitter() {
        return this.emitter;
    }
    /**
     * Mock request handler that returns appropriate mock data
     *
     * @param method - The SDK method name (e.g., 'make_purchase', 'get_paywall_products')
     * @param params - JSON string containing request parameters in cross_platform.yaml format
     * @param _resultType - Expected result type (not used in mock)
     * @param ctx - Log context for debugging
     *
     * @remarks
     * The `params` argument contains JSON-stringified data that follows the request format
     * defined in `cross_platform.yaml`. For example, for 'make_purchase' method, it contains
     * `MakePurchase.Request` structure with `product` field in `AdaptyPaywallProduct.Request`
     * format (snake_case, minimal field set).
     *
     * @returns Promise resolving to mock data in the expected format
     */
    request(method, params, _resultType, ctx) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const log = ctx === null || ctx === void 0 ? void 0 : ctx.bridge({ methodName: `mock/${method}` });
            log === null || log === void 0 ? void 0 : log.start(() => ({ method, params }));
            try {
                let result;
                // Parse params from cross_platform.yaml format (e.g., MakePurchase.Request, GetPaywallProducts.Request)
                // All fields are in snake_case as defined in the cross-platform specification
                const parsedParams = JSON.parse(params);
                switch (method) {
                    case 'activate':
                        this.store.setActivated(true);
                        result = undefined; // void
                        break;
                    case 'is_activated':
                        result = this.store.getIsActivated();
                        break;
                    case 'get_profile':
                        result = this.store.getProfile();
                        break;
                    case 'get_paywall':
                    case 'get_paywall_for_default_audience':
                        const paywallPlacementId = parsedParams.placement_id;
                        result = this.store.getPaywall(paywallPlacementId);
                        break;
                    case 'get_paywall_products':
                        const paywall = parsedParams.paywall;
                        const placementId = ((_a = paywall === null || paywall === void 0 ? void 0 : paywall.placement) === null || _a === void 0 ? void 0 : _a.developer_id) || 'default';
                        const variationId = (paywall === null || paywall === void 0 ? void 0 : paywall.variation_id) || 'mock_variation_id';
                        result = this.store.getPaywallProducts(placementId, variationId);
                        break;
                    case 'get_onboarding':
                    case 'get_onboarding_for_default_audience':
                        const onboardingPlacementId = parsedParams.placement_id;
                        result = this.store.getOnboarding(onboardingPlacementId);
                        break;
                    case 'make_purchase':
                        // Extract accessLevelId from Request format (snake_case)
                        const productAccessLevelId = parsedParams.product.access_level_id;
                        const updatedProfile = this.store.makePurchase(productAccessLevelId);
                        result = (0, mock_data_1.createMockPurchaseResult)(updatedProfile);
                        // Emit profile update event
                        // Event format must match cross_platform.yaml: { profile: <encoded_profile> }
                        setTimeout(() => {
                            const profileCoder = factory_1.coderFactory.createProfileCoder();
                            const encodedProfile = profileCoder.encode(updatedProfile);
                            this.emitter.emit('did_load_latest_profile', JSON.stringify({ profile: encodedProfile }));
                        }, 50);
                        break;
                    case 'restore_purchases':
                        result = this.store.getProfile();
                        break;
                    case 'identify':
                        const customerUserId = parsedParams.customer_user_id;
                        this.store.identify(customerUserId);
                        result = undefined; // void
                        break;
                    case 'logout':
                        this.store.logout();
                        result = undefined; // void
                        break;
                    case 'update_profile':
                        const profileParamsCoder = factory_1.coderFactory.createProfileParametersCoder();
                        const profileParams = profileParamsCoder.decode(parsedParams.params);
                        this.store.updateProfile(profileParams);
                        result = undefined; // void
                        break;
                    case 'log_show_paywall':
                    case 'set_log_level':
                    case 'update_attribution_data':
                    case 'set_fallback':
                    case 'set_integration_identifiers':
                    case 'report_transaction':
                    case 'present_code_redemption_sheet':
                    case 'update_collecting_refund_data_consent':
                    case 'update_refund_preference':
                    case 'open_web_paywall':
                        // These methods don't return anything meaningful in mock mode
                        result = undefined; // void
                        break;
                    case 'create_web_paywall_url':
                        result = 'https://mock-web-paywall-url.adapty.io';
                        break;
                    case 'get_current_installation_status':
                        result = {
                            status: 'determined',
                            details: {
                                installTime: new Date(),
                                appLaunchCount: 1,
                            },
                        };
                        break;
                    // UI methods
                    case 'adapty_ui_create_paywall_view':
                        result = { id: `mock-paywall-${(0, utils_1.generateId)()}` };
                        break;
                    case 'adapty_ui_create_onboarding_view':
                        result = { id: `mock-onboarding-${(0, utils_1.generateId)()}` };
                        break;
                    case 'adapty_ui_present_paywall_view':
                    case 'adapty_ui_present_onboarding_view':
                    case 'adapty_ui_dismiss_paywall_view':
                    case 'adapty_ui_dismiss_onboarding_view':
                    case 'adapty_ui_activate':
                        result = undefined; // void
                        break;
                    case 'adapty_ui_show_dialog':
                        result = 'primary';
                        break;
                    default:
                        result = undefined;
                }
                log === null || log === void 0 ? void 0 : log.success(() => ({ result }));
                return result;
            }
            catch (error) {
                log === null || log === void 0 ? void 0 : log.success(() => ({ error }));
                throw error;
            }
        });
    }
    /**
     * Add event listener for mock events
     */
    addRawEventListener(event, cb) {
        const subscription = this.emitter.addListener(event, cb);
        this.listeners.add(subscription);
        return subscription;
    }
    /**
     * Add typed event listener
     */
    addEventListener(event, cb) {
        const consumeNativeCallback = (...data) => {
            const ctx = new logger_1.LogContext();
            const log = ctx.event({ methodName: `mock/${event}` });
            log.start(() => ({ args: data }));
            let rawValue = null;
            const args = data.map(arg => {
                try {
                    const commonEvent = (0, parse_1.parseCommonEvent)(event, arg, ctx);
                    if (commonEvent)
                        return commonEvent;
                    try {
                        rawValue = JSON.parse(arg);
                    }
                    catch (_a) { }
                    const onboardingEvent = (0, parse_onboarding_1.parseOnboardingEvent)(arg, ctx);
                    if (onboardingEvent) {
                        return onboardingEvent;
                    }
                    const paywallEvent = (0, parse_paywall_1.parsePaywallEvent)(arg, ctx);
                    return paywallEvent;
                }
                catch (error) {
                    log.failed(() => ({ error }));
                    throw error;
                }
            });
            cb.apply({ rawValue }, args);
        };
        const subscription = this.emitter.addListener(event, consumeNativeCallback);
        this.listeners.add(subscription);
        return subscription;
    }
    /**
     * Remove all event listeners
     */
    removeAllEventListeners() {
        this.listeners.forEach(listener => listener.remove());
        this.listeners.clear();
        this.emitter.removeAllListeners();
    }
}
exports.MockRequestHandler = MockRequestHandler;
//# sourceMappingURL=mock-request-handler.js.map