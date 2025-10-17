import { EmitterSubscription } from 'react-native';
import { LogContext, LogScope } from './logger';
import type * as Model from './types';
import * as Input from './types/inputs';
import { MethodName, UserEventName } from './types/bridge';
import { AdaptyType } from './coders/parse';
import { RefundPreference, AdaptyProfile, AdaptyInstallationDetails } from './types';
import { AdaptyError } from './adapty-error';
/**
 * Entry point for the Adapty SDK.
 * All Adapty methods are available through this class.
 * @public
 */
export declare class Adapty {
    private resolveHeldActivation?;
    private activating;
    private nonWaitingMethods;
    handle<T>(method: MethodName, params: string, resultType: AdaptyType, ctx: LogContext, log: LogScope): Promise<T>;
    /**
     * Adds an event listener for the latest profile load event.
     */
    addEventListener(event: Extract<UserEventName, 'onLatestProfileLoad'>, callback: (data: AdaptyProfile) => void | Promise<void>): EmitterSubscription;
    /**
     * Adds an event listener for successful installation details retrieval.
     */
    addEventListener(event: Extract<UserEventName, 'onInstallationDetailsSuccess'>, callback: (data: AdaptyInstallationDetails) => void | Promise<void>): EmitterSubscription;
    /**
     * Adds an event listener for installation details retrieval failures.
     */
    addEventListener(event: Extract<UserEventName, 'onInstallationDetailsFail'>, callback: (data: AdaptyError) => void | Promise<void>): EmitterSubscription;
    /**
     * Removes all attached event listeners
     */
    removeAllListeners(): void;
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
    activate(apiKey: string, params?: Input.ActivateParamsInput): Promise<void>;
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
    getPaywall(placementId: string, locale?: string, params?: Input.GetPlacementParamsInput): Promise<Model.AdaptyPaywall>;
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
    getPaywallForDefaultAudience(placementId: string, locale?: string, params?: Input.GetPlacementForDefaultAudienceParamsInput): Promise<Model.AdaptyPaywall>;
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
    getPaywallProducts(paywall: Model.AdaptyPaywall): Promise<Model.AdaptyPaywallProduct[]>;
    getOnboarding(placementId: string, locale?: string, params?: Input.GetPlacementParamsInput): Promise<Model.AdaptyOnboarding>;
    getOnboardingForDefaultAudience(placementId: string, locale?: string, params?: Input.GetPlacementParamsInput): Promise<Model.AdaptyOnboarding>;
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
    getProfile(): Promise<Model.AdaptyProfile>;
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
    identify(customerUserId: string): Promise<void>;
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
    logShowPaywall(paywall: Model.AdaptyPaywall): Promise<void>;
    openWebPaywall(paywallOrProduct: Model.AdaptyPaywall | Model.AdaptyPaywallProduct): Promise<void>;
    createWebPaywallUrl(paywallOrProduct: Model.AdaptyPaywall | Model.AdaptyPaywallProduct): Promise<string>;
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
    logShowOnboarding(screenOrder: number, onboardingName?: string, screenName?: string): Promise<void>;
    /**
     * Logs out the current user.
     * You can then login the user using {@link Adapty.identify} method.
     *
     * @throws {@link AdaptyError}
     */
    logout(): Promise<void>;
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
    makePurchase(product: Model.AdaptyPaywallProduct, params?: Input.MakePurchaseParamsInput): Promise<Model.AdaptyPurchaseResult>;
    /**
     * Opens a native modal screen to redeem Apple Offer Codes.
     *
     * @remarks
     * iOS 14+ only.
     */
    presentCodeRedemptionSheet(): Promise<void>;
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
    reportTransaction(transactionId: string, variationId?: string): Promise<void>;
    /**
     * Restores user purchases and updates the profile.
     *
     * @returns {Promise<Model.AdaptyProfile>} resolves with the updated profile
     * @throws {@link AdaptyError} if an error occurs during the restore process or while decoding the response
     */
    restorePurchases(): Promise<Model.AdaptyProfile>;
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
    setFallback(fileLocation: Input.FileLocation): Promise<void>;
    /**
     * @deprecated use {@link setFallback}
     */
    setFallbackPaywalls(paywallsLocation: Input.FileLocation): Promise<void>;
    setIntegrationIdentifier(key: string, value: string): Promise<void>;
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
    setLogLevel(logLevel: Input.LogLevel): Promise<void>;
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
    updateAttribution(attribution: Record<string, any>, source: string): Promise<void>;
    updateCollectingRefundDataConsent(consent: boolean): Promise<void>;
    updateRefundPreference(refundPreference: RefundPreference): Promise<void>;
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
    updateProfile(params: Partial<Model.AdaptyProfileParameters>): Promise<void>;
    isActivated(): Promise<boolean>;
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
    getCurrentInstallationStatus(): Promise<Model.AdaptyInstallationStatus>;
}
//# sourceMappingURL=adapty-handler.d.ts.map