"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapty = void 0;
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const bridge_1 = require("./bridge");
const logger_1 = require("./logger");
const adapty_paywall_1 = require("./coders/adapty-paywall");
const adapty_paywall_product_1 = require("./coders/adapty-paywall-product");
const adapty_profile_parameters_1 = require("./coders/adapty-profile-parameters");
const adapty_purchase_params_1 = require("./coders/adapty-purchase-params");
const adapty_configuration_1 = require("./coders/adapty-configuration");
const Input = tslib_1.__importStar(require("./types/inputs"));
/**
 * Entry point for the Adapty SDK.
 * All Adapty methods are available through this class.
 * @public
 */
class Adapty {
    constructor() {
        this.resolveHeldActivation = null;
        this.activating = null;
        this.nonWaitingMethods = [
            'activate',
            'is_activated',
            'get_paywall_for_default_audience',
            'get_onboarding_for_default_audience',
        ];
    }
    // Middleware to call native handle
    handle(method, params, resultType, ctx, log) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /*
             * If resolveHeldActivation is defined,
             * wait until it is resolved before calling native methods
             *
             * Not applicable for activate method ofc
             */
            if (this.resolveHeldActivation &&
                !this.nonWaitingMethods.includes(method)) {
                log.wait({});
                yield this.resolveHeldActivation();
                this.resolveHeldActivation = null;
                log.waitComplete({});
            }
            /*
             * wait until activate call is resolved before calling native methods
             * Not applicable for activate method ofc
             */
            if (this.activating &&
                (!this.nonWaitingMethods.includes(method) || method === 'is_activated')) {
                log.wait({});
                yield this.activating;
                log.waitComplete({});
                this.activating = null;
            }
            try {
                const result = yield bridge_1.$bridge.request(method, params, resultType, ctx);
                log.success(result);
                return result;
            }
            catch (error) {
                /*
                 * Success because error was handled validly
                 * It is a developer task to define which errors must be logged
                 */
                log.success({ error });
                throw error;
            }
        });
    }
    addEventListener(event, callback) {
        switch (event) {
            case 'onLatestProfileLoad':
                return bridge_1.$bridge.addEventListener('did_load_latest_profile', callback);
            case 'onInstallationDetailsSuccess':
                return bridge_1.$bridge.addEventListener('on_installation_details_success', callback);
            case 'onInstallationDetailsFail':
                return bridge_1.$bridge.addEventListener('on_installation_details_fail', callback);
            default:
                throw new Error(`Unsupported event: ${event}`);
        }
    }
    /**
     * Removes all attached event listeners
     */
    removeAllListeners() {
        return bridge_1.$bridge.removeAllEventListeners();
    }
    /**
     * Initializes the Adapty SDK.
     *
     * @remarks
     * This method must be called in order for the SDK to work.
     * It is preffered to call it as early as possible in the app lifecycle,
     * so background activities can be performed and cache can be updated.
     *
     * @example
     * ## Basic usage in your app's entry point
     * ```ts
     *  adapty.activate('YOUR_API_KEY'); // <-- pass your API key here (required)
     * ```
     *
     * ## Usage with your user identifier from your system
     * ```ts
     * adapty.activate('YOUR_API_KEY', { // <-- pass your API key here (required)
     *   customerUserId: 'YOUR_USER_ID'  // <-- pass your user identifier here (optional)
     * });
     * ```
     *
     * @param {string} apiKey - You can find it in your app settings
     * in {@link https://app.adapty.io/ | Adapty Dashboard} App settings > General.
     * @param {Input.ActivateParamsInput} params - Optional parameters of type {@link ActivateParamsInput}.
     * @returns {Promise<void>} A promise that resolves when the SDK is initialized.
     *
     * @throws {@link AdaptyError}
     * Usually throws if the SDK is already activated or if the API key is invalid.
     */
    activate(apiKey, params = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // call before log ctx calls, so no logs are lost
            const logLevel = params.logLevel;
            logger_1.Log.logLevel = logLevel || null;
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'activate' });
            log.start({ apiKey, params });
            // Skipping activation if SDK is already activated
            if (params.__ignoreActivationOnFastRefresh) {
                try {
                    const isAlreadyActivated = yield this.isActivated();
                    if (!!this.activating || isAlreadyActivated) {
                        log.success({
                            message: 'SDK already activated, skipping activation because ignoreActivationOnFastRefresh flag is enabled',
                        });
                        return Promise.resolve();
                    }
                }
                catch (error) {
                    log.waitComplete({
                        message: 'Failed to check activation status, proceeding with activation; ignoreActivationOnFastRefresh flag could not be applied',
                        error,
                    });
                }
            }
            const configurationCoder = new adapty_configuration_1.AdaptyConfigurationCoder();
            const config = configurationCoder.encode(apiKey, params);
            const methodKey = 'activate';
            const body = JSON.stringify({
                method: methodKey,
                configuration: config,
            });
            const activate = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.activating = this.handle(methodKey, body, 'Void', ctx, log);
                yield this.activating;
            });
            if (!params.__debugDeferActivation) {
                return activate();
            }
            /*
             * Deferring activation solves annoying simulator authentication,
             * by postponing the moment, when simulator will use StoreKit
             */
            return new Promise(unlock => {
                // do not resolve promise, only resolveHeldActivation must resolve
                this.resolveHeldActivation = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const result = yield activate();
                    unlock(result);
                });
            });
        });
    }
    /**
     * Fetches the paywall by the specified placement.
     *
     * @remarks
     * With Adapty, you can remotely configure the products and offers in your app
     * by simply adding them to paywalls – no need for hardcoding them.
     * The only thing you hardcode is the placement ID.
     * This flexibility allows you to easily update paywalls, products, and offers,
     * or run A/B tests, all without the need for a new app release.
     *
     * @param {string} placementId - The identifier of the desired placement.
     * This is the value you specified when you created the placement
     * in the Adapty Dashboard.
     * @param {string | undefined} [locale] - The locale of the desired paywall.
     * @param {Input.GetPlacementParamsInput} [params] - Additional parameters for retrieving paywall.
     * @returns {Promise<Model.AdaptyPaywall>}
     * A promise that resolves with a requested paywall.
     *
     * @throws {@link AdaptyError}
     * Throws an error:
     * 1. if the paywall with the specified ID is not found
     * 2. if your bundle ID does not match with your Adapty Dashboard setup
     */
    getPaywall(placementId, locale, params = {
        fetchPolicy: Input.FetchPolicy.ReloadRevalidatingCacheData,
        loadTimeoutMs: 5000,
    }) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'getPaywall' });
            log.start({ placementId, locale, params });
            const methodKey = 'get_paywall';
            const data = {
                method: methodKey,
                placement_id: placementId,
                load_timeout: ((_a = params.loadTimeoutMs) !== null && _a !== void 0 ? _a : 5000) / 1000,
            };
            if (locale) {
                data['locale'] = locale;
            }
            if (params.fetchPolicy !== 'return_cache_data_if_not_expired_else_load') {
                data['fetch_policy'] = {
                    type: (_b = params.fetchPolicy) !== null && _b !== void 0 ? _b : Input.FetchPolicy.ReloadRevalidatingCacheData,
                };
            }
            else {
                data['fetch_policy'] = {
                    type: params.fetchPolicy,
                    max_age: params.maxAgeSeconds,
                };
            }
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'AdaptyPaywall', ctx, log);
            return result;
        });
    }
    /**
     * Fetches the paywall of the specified placement for the **All Users** audience.
     *
     * @remarks
     * With Adapty, you can remotely configure the products and offers in your app
     * by simply adding them to paywalls – no need for hardcoding them.
     * The only thing you hardcode is the placement ID.
     * This flexibility allows you to easily update paywalls, products, and offers,
     * or run A/B tests, all without the need for a new app release.
     *
     * However, it’s crucial to understand that the recommended approach is to fetch the paywall
     * through the placement ID by the {@link getPaywall} method.
     * The `getPaywallForDefaultAudience` method should be a last resort due to its significant drawbacks.
     * See docs for more details
     *
     * @param {string} placementId - The identifier of the desired placement.
     * This is the value you specified when you created the placement
     * in the Adapty Dashboard.
     * @param {string | undefined} [locale] - The locale of the desired paywall.
     * @param {Input.GetPlacementForDefaultAudienceParamsInput} [params] - Additional parameters for retrieving paywall.
     * @returns {Promise<Model.AdaptyPaywall>}
     * A promise that resolves with a requested paywall.
     *
     * @throws {@link AdaptyError}
     * Throws an error:
     * 1. if the paywall with the specified ID is not found
     * 2. if your bundle ID does not match with your Adapty Dashboard setup
     */
    getPaywallForDefaultAudience(placementId, locale, params = {
        fetchPolicy: Input.FetchPolicy.ReloadRevalidatingCacheData,
    }) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'getPaywallForDefaultAudience' });
            log.start({ placementId, locale, params });
            const methodKey = 'get_paywall_for_default_audience';
            const data = {
                method: methodKey,
                placement_id: placementId,
            };
            if (locale) {
                data['locale'] = locale;
            }
            if (params.fetchPolicy !== 'return_cache_data_if_not_expired_else_load') {
                data['fetch_policy'] = {
                    type: (_a = params.fetchPolicy) !== null && _a !== void 0 ? _a : Input.FetchPolicy.ReloadRevalidatingCacheData,
                };
            }
            else {
                data['fetch_policy'] = {
                    type: params.fetchPolicy,
                    max_age: params.maxAgeSeconds,
                };
            }
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'AdaptyPaywall', ctx, log);
            return result;
        });
    }
    /**
     * Fetches a list of products associated with a provided paywall.
     *
     * @example
     * ```ts
     * const paywall = await adapty.getPaywall('paywall_id');
     * const products = await adapty.getPaywallProducts(paywall);
     * ```
     *
     * @param {Model.AdaptyPaywall} paywall - a paywall to fetch products for. You can get it using {@link Adapty.getPaywall} method.
     * @returns {Promise<Model.AdaptyPaywallProduct[]>} A promise that resolves with a list
     * of {@link Model.AdaptyPaywallProduct} associated with a provided paywall.
     * @throws {@link AdaptyError}
     */
    getPaywallProducts(paywall) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'getPaywallProducts' });
            log.start({ paywall });
            const coder = new adapty_paywall_1.AdaptyPaywallCoder();
            const methodKey = 'get_paywall_products';
            const data = {
                method: methodKey,
                paywall: coder.encode(paywall),
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Array<AdaptyPaywallProduct>', ctx, log);
            return result;
        });
    }
    getOnboarding(placementId, locale, params = {
        fetchPolicy: Input.FetchPolicy.ReloadRevalidatingCacheData,
        loadTimeoutMs: 5000,
    }) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'getOnboarding' });
            log.start({ placementId, locale, params });
            const methodKey = 'get_onboarding';
            const data = {
                method: methodKey,
                placement_id: placementId,
                load_timeout: ((_a = params.loadTimeoutMs) !== null && _a !== void 0 ? _a : 5000) / 1000,
            };
            if (locale) {
                data['locale'] = locale;
            }
            if (params.fetchPolicy !== 'return_cache_data_if_not_expired_else_load') {
                data['fetch_policy'] = {
                    type: (_b = params.fetchPolicy) !== null && _b !== void 0 ? _b : Input.FetchPolicy.ReloadRevalidatingCacheData,
                };
            }
            else {
                data['fetch_policy'] = {
                    type: params.fetchPolicy,
                    max_age: params.maxAgeSeconds,
                };
            }
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'AdaptyOnboarding', ctx, log);
            return result;
        });
    }
    getOnboardingForDefaultAudience(placementId, locale, params = {
        fetchPolicy: Input.FetchPolicy.ReloadRevalidatingCacheData,
        loadTimeoutMs: 5000,
    }) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'getOnboardingForDefaultAudience' });
            log.start({ placementId, locale, params });
            const methodKey = 'get_onboarding_for_default_audience';
            const data = {
                method: methodKey,
                placement_id: placementId,
            };
            if (locale) {
                data['locale'] = locale;
            }
            if (params.fetchPolicy !== 'return_cache_data_if_not_expired_else_load') {
                data['fetch_policy'] = {
                    type: (_a = params.fetchPolicy) !== null && _a !== void 0 ? _a : Input.FetchPolicy.ReloadRevalidatingCacheData,
                };
            }
            else {
                data['fetch_policy'] = {
                    type: params.fetchPolicy,
                    max_age: params.maxAgeSeconds,
                };
            }
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'AdaptyOnboarding', ctx, log);
            return result;
        });
    }
    /**
     * Fetches a user profile.
     *
     * Allows you to define the level of access,
     * as well as other parameters.
     *
     * @remarks
     * The getProfile method provides the most up-to-date result
     * as it always tries to query the API.
     * If for some reason (e.g. no internet connection),
     * the Adapty SDK fails to retrieve information from the server,
     * the data from cache will be returned.
     * It is also important to note
     * that the Adapty SDK updates {@link Model.AdaptyProfile} cache
     * on a regular basis, in order
     * to keep this information as up-to-date as possible.
     *
     * @returns {Promise<Model.AdaptyProfile>}
     * @throws {@link AdaptyError}
     */
    getProfile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'getProfile' });
            log.start({});
            const methodKey = 'get_profile';
            const body = JSON.stringify({
                method: methodKey,
            });
            const result = yield this.handle(methodKey, body, 'AdaptyProfile', ctx, log);
            return result;
        });
    }
    /**
     * Logs in a user with a provided customerUserId.
     *
     * If you don't have a user id on SDK initialization,
     * you can set it later at any time with this method.
     * The most common cases are after registration/authorization
     * when the user switches from being an anonymous user to an authenticated user.
     *
     * @param {string} customerUserId - unique user id
     * @throws {@link AdaptyError}
     */
    identify(customerUserId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'identify' });
            log.start({ customerUserId });
            const methodKey = 'identify';
            const data = {
                method: methodKey,
                customer_user_id: customerUserId,
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Logs a paywall view event.
     *
     * Adapty helps you to measure the performance of the paywalls.
     * We automatically collect all the metrics related to purchases except for paywall views.
     * This is because only you know when the paywall was shown to a customer.
     *
     * @remarks
     * Whenever you show a paywall to your user,
     * call this function to log the event,
     * and it will be accumulated in the paywall metrics.
     *
     * @example
     * ```ts
     * const paywall = await adapty.getPaywall('paywall_id');
     * // ...after opening the paywall
     * adapty.logShowPaywall(paywall);
     * ```
     *
     * @param {Model.AdaptyPaywall} paywall - object that was shown to the user.
     * @returns {Promise<void>} resolves when the event is logged
     */
    logShowPaywall(paywall) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'logShowPaywall' });
            log.start({ paywall });
            const coder = new adapty_paywall_1.AdaptyPaywallCoder();
            const methodKey = 'log_show_paywall';
            const data = {
                method: methodKey,
                paywall: coder.encode(paywall),
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    openWebPaywall(paywallOrProduct) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'openWebPaywall' });
            log.start({ paywallOrProduct });
            const methodKey = 'open_web_paywall';
            const data = Object.assign({ method: methodKey }, ('vendorProductId' in paywallOrProduct
                ? { product: new adapty_paywall_product_1.AdaptyPaywallProductCoder().encode(paywallOrProduct) }
                : { paywall: new adapty_paywall_1.AdaptyPaywallCoder().encode(paywallOrProduct) }));
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    createWebPaywallUrl(paywallOrProduct) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'create_web_paywall_url' });
            log.start({ paywallOrProduct });
            const methodKey = 'create_web_paywall_url';
            const data = Object.assign({ method: methodKey }, ('vendorProductId' in paywallOrProduct
                ? { product: new adapty_paywall_product_1.AdaptyPaywallProductCoder().encode(paywallOrProduct) }
                : { paywall: new adapty_paywall_1.AdaptyPaywallCoder().encode(paywallOrProduct) }));
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'String', ctx, log);
            return result;
        });
    }
    /**
     * Logs an onboarding screen view event.
     *
     * In order for you to be able to analyze user behavior
     * at this critical stage without leaving Adapty,
     * we have implemented the ability to send dedicated events
     * every time a user visits yet another onboarding screen.
     *
     * @remarks
     * Even though there is only one mandatory parameter in this function,
     * we recommend that you think of names for all the screens,
     * as this will make the work of analysts
     * during the data examination phase much easier.
     *
     * @example
     * ```ts
     * adapty.logShowOnboarding(1, 'onboarding_name', 'screen_name');
     * ```
     *
     * @param {number} screenOrder - The number of the screen that was shown to the user.
     * @param {string} [onboardingName] - The name of the onboarding.
     * @param {string} [screenName] - The name of the screen.
     * @returns {Promise<void>} resolves when the event is logged
     * @throws {@link AdaptyError}
     */
    logShowOnboarding(screenOrder, onboardingName, screenName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'logShowOnboarding' });
            log.start({ screenOrder, onboardingName, screenName });
            const methodKey = 'log_show_onboarding';
            const data = {
                method: methodKey,
                params: {
                    onboarding_screen_order: screenOrder,
                    onboarding_name: onboardingName,
                    onboarding_screen_name: screenName,
                },
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Logs out the current user.
     * You can then login the user using {@link Adapty.identify} method.
     *
     * @throws {@link AdaptyError}
     */
    logout() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'logout' });
            log.start({});
            const methodKey = 'logout';
            const body = JSON.stringify({
                method: methodKey,
            });
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Performs a purchase of the specified product.
     *
     * All available promotions will be applied automatically.
     *
     * @remarks
     * Successful purchase will also result in a call to the `'onLatestProfileLoad'` listener.
     * You can use {@link Adapty.addEventListener} to subscribe to this event and handle
     * the purchase result outside of this thread.
     *
     * @param {Model.AdaptyPaywallProduct} product - The product to be purchased.
     * You can get the product using {@link Adapty.getPaywallProducts} method.
     * @param {Input.MakePurchaseParamsInput} [params] - Additional parameters for the purchase.
     * @returns {Promise<Model.AdaptyPurchaseResult>} A Promise that resolves to the {@link Model.AdaptyPurchaseResult} object
     * containing details about the purchase. If the result is `'success'`, it also includes the updated user's profile.
     * @throws {AdaptyError} If an error occurs during the purchase process
     * or while decoding the response from the native SDK.
     *
     * @example
     * ```ts
     * try {
     *   const paywall = await adapty.getPaywall('onboarding');
     *   const products = await adapty.getPaywallProducts(paywall);
     *   const product = products[0];
     *
     *   const profile = await adapty.makePurchase(product);
     *   // successful, canceled, or pending purchase
     * } catch (error) {
     *   // handle error
     * }
     * ```
     */
    makePurchase(product, params = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'makePurchase' });
            log.start({ product, params });
            const coder = new adapty_paywall_product_1.AdaptyPaywallProductCoder();
            const encoded = coder.encode(product);
            const productInput = coder.getInput(encoded);
            const methodKey = 'make_purchase';
            const data = {
                method: methodKey,
                product: productInput,
            };
            const purchaseParamsCoder = new adapty_purchase_params_1.AdaptyPurchaseParamsCoder();
            const purchaseParams = purchaseParamsCoder.encode(params);
            if (Object.keys(purchaseParams).length > 0) {
                data.parameters = purchaseParams;
            }
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'AdaptyPurchaseResult', ctx, log);
            return result;
        });
    }
    /**
     * Opens a native modal screen to redeem Apple Offer Codes.
     *
     * @remarks
     * iOS 14+ only.
     */
    presentCodeRedemptionSheet() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (react_native_1.Platform.OS === 'android') {
                return Promise.resolve();
            }
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'presentCodeRedemptionSheet' });
            log.start({});
            const methodKey = 'present_code_redemption_sheet';
            const body = JSON.stringify({
                method: methodKey,
            });
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Sets the variation ID of the purchase.
     *
     * In Observer mode, Adapty SDK doesn't know, where the purchase was made from.
     * If you display products using our Paywalls or A/B Tests,
     * you can manually assign variation to the purchase.
     * After doing this, you'll be able to see metrics in Adapty Dashboard.
     *
     * @param {string} transactionId - `transactionId` property of {@link Model.AdaptySubscription}
     * @param {string} variationId - `variationId` property of {@link Model.AdaptyPaywall}
     * @throws {@link AdaptyError}
     */
    reportTransaction(transactionId, variationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'reportTransaction' });
            log.start({ variationId, transactionId });
            const methodKey = 'report_transaction';
            const data = {
                method: methodKey,
                transaction_id: transactionId,
            };
            if (variationId) {
                data['variation_id'] = variationId;
            }
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Restores user purchases and updates the profile.
     *
     * @returns {Promise<Model.AdaptyProfile>} resolves with the updated profile
     * @throws {@link AdaptyError} if an error occurs during the restore process or while decoding the response
     */
    restorePurchases() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'restorePurchases' });
            log.start({});
            const methodKey = 'restore_purchases';
            const body = JSON.stringify({
                method: methodKey,
            });
            const result = yield this.handle(methodKey, body, 'AdaptyProfile', ctx, log);
            return result;
        });
    }
    /**
     * Sets the fallback paywalls.
     *
     * Fallback file will be used if the SDK fails
     * to fetch the paywalls or onboardings from the dashboard.
     * It is not designed to be used for the offline flow,
     * as products are not cached in Adapty.
     *
     * @returns {Promise<void>} resolves when fallback placements are saved
     */
    setFallback(fileLocation) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'setFallback' });
            const fileLocationJson = react_native_1.Platform.select({
                ios: fileLocation.ios.fileName,
                android: 'relativeAssetPath' in fileLocation.android
                    ? `${fileLocation.android.relativeAssetPath}a`
                    : `${fileLocation.android.rawResName}r`,
            });
            log.start({ fileLocationJson });
            const methodKey = 'set_fallback';
            const data = {
                method: methodKey,
                asset_id: fileLocationJson !== null && fileLocationJson !== void 0 ? fileLocationJson : '',
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * @deprecated use {@link setFallback}
     */
    setFallbackPaywalls(paywallsLocation) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.setFallback(paywallsLocation);
        });
    }
    setIntegrationIdentifier(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'setIntegrationIdentifier' });
            log.start({ key });
            const methodKey = 'set_integration_identifiers';
            const data = {
                method: methodKey,
                key_values: { [key]: value },
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Sets the preferred log level.
     *
     * By default, the log level is set to `error`.
     *
     * @remarks
     * There are four levels available:
     * `error`: only errors will be logged
     * `warn`: messages from the SDK that do not cause critical errors, but are worth paying attention to
     * `info`: various information messages, such as those that log the lifecycle of various modules
     * `verbose`: any additional information that may be useful during debugging, such as function calls, API queries, etc.
     *
     * @param {Input.LogLevel} logLevel - new preferred log level
     * @returns {Promise<void>} resolves when the log level is set
     * @throws {@link AdaptyError} if the log level is invalid
     */
    setLogLevel(logLevel) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'setLogLevel' });
            log.start({ logLevel });
            logger_1.Log.logLevel = logLevel;
            const methodKey = 'set_log_level';
            const data = {
                method: methodKey,
                value: logLevel,
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Updates an attribution data for the current user.
     *
     * @example
     * ```ts
     * const attribution = {
     *   'Adjust Adid': 'adjust_adid',
     *   'Adjust Network': 'adjust_network',
     *   'Adjust Campaign': 'adjust_campaign',
     *   'Adjust Adgroup': 'adjust_adgroup',
     * };
     *
     * adapty.updateAttribution(attribution, 'adjust');
     * ```
     *
     * @param {Record<string, any>} attribution - An object containing attribution data.
     * @param {string} source - The source of the attribution data.
     * @returns {Promise<void>} A promise that resolves when the attribution data is updated.
     *
     * @throws {@link AdaptyError} Throws if parameters are invalid or not provided.
     */
    updateAttribution(attribution, source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'updateAttribution' });
            log.start({ attribution, source });
            const methodKey = 'update_attribution_data';
            const data = {
                method: methodKey,
                attribution: JSON.stringify(attribution),
                source: source,
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    updateCollectingRefundDataConsent(consent) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (react_native_1.Platform.OS === 'android') {
                return Promise.resolve();
            }
            const ctx = new logger_1.LogContext();
            const log = ctx.call({
                methodName: 'update_collecting_refund_data_consent',
            });
            log.start({ consent });
            const methodKey = 'update_collecting_refund_data_consent';
            const data = {
                method: methodKey,
                consent: consent,
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    updateRefundPreference(refundPreference) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (react_native_1.Platform.OS === 'android') {
                return Promise.resolve();
            }
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'update_refund_preference' });
            log.start({ refundPreference });
            const methodKey = 'update_refund_preference';
            const data = {
                method: methodKey,
                refund_preference: refundPreference,
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    /**
     * Updates a profile for the current user.
     *
     * @param {Model.AdaptyProfileParameters} params — an object of parameters to update
     * @throws {@link AdaptyError} If parameters are invalid or there is a network error.
     *
     * @example
     * ```ts
     * const profile = {
     *  email: 'foo@example.com',
     * phone: '+1234567890',
     * };
     *
     * await adapty.updateProfile(profile);
     * ```
     */
    updateProfile(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'updateProfile' });
            log.start({ params });
            const coder = new adapty_profile_parameters_1.AdaptyProfileParametersCoder();
            const methodKey = 'update_profile';
            const data = {
                method: methodKey,
                params: coder.encode(params),
            };
            const body = JSON.stringify(data);
            const result = yield this.handle(methodKey, body, 'Void', ctx, log);
            return result;
        });
    }
    isActivated() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'isActivated' });
            log.start({});
            const methodKey = 'is_activated';
            const body = JSON.stringify({
                method: methodKey,
            });
            const result = yield this.handle(methodKey, body, 'Boolean', ctx, log);
            return result;
        });
    }
    /**
     * Gets the current installation status.
     *
     * @remarks
     * Installation status provides information about when the app was installed,
     * how many times it has been launched, and other installation-related details.
     * The status can be "not_available", "not_determined", or "determined" with details.
     *
     * @returns {Promise<Model.AdaptyInstallationStatus>} A promise that resolves with the installation status.
     * @throws {@link AdaptyError} If an error occurs while retrieving the installation status.
     *
     * @example
     * ```ts
     * try {
     *   const status = await adapty.getCurrentInstallationStatus();
     *   if (status.status === 'determined') {
     *     console.log('Install time:', status.details.installTime);
     *     console.log('Launch count:', status.details.appLaunchCount);
     *   }
     * } catch (error) {
     *   // handle error
     * }
     * ```
     */
    getCurrentInstallationStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctx = new logger_1.LogContext();
            const log = ctx.call({ methodName: 'getCurrentInstallationStatus' });
            log.start({});
            const methodKey = 'get_current_installation_status';
            const body = JSON.stringify({
                method: methodKey,
            });
            const result = yield this.handle(methodKey, body, 'AdaptyInstallationStatus', ctx, log);
            return result;
        });
    }
}
exports.Adapty = Adapty;
//# sourceMappingURL=adapty-handler.js.map