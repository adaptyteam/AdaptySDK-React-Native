import { Platform } from 'react-native';

import { $bridge, ParamMap } from '@/bridge';
import { LogContext, Log, LogScope } from '@/logger';
import type { Schema } from '@/types/schema';

import { AdaptyPaywallCoder } from '@/coders/adapty-paywall';
import { AdaptyPaywallProductCoder } from '@/coders/adapty-paywall-product';
import { AdaptyProfileParametersCoder } from '@/coders/adapty-profile-parameters';

import type * as Model from '@/types';
import * as Input from '@/types/inputs';
import type { AddListenerFn, MethodName } from '@/types/bridge';

/**
 * Entry point for the Adapty SDK.
 * All Adapty methods are available through this class.
 * @public
 */
export class Adapty {
  private resolveHeldActivation?: (() => Promise<void>) | null = null;
  private activating: Promise<void> | null = null;

  // Middleware to call native handle
  async handle<T>(
    method: MethodName,
    params: ParamMap,
    ctx: LogContext,
    log: LogScope,
  ): Promise<T> {
    /*
     * If resolveHeldActivation is defined,
     * wait until it is resolved before calling native methods
     *
     * Not applicable for activate method ofc
     */
    if (this.resolveHeldActivation && method !== 'activate') {
      log.wait({});
      await this.resolveHeldActivation();
      this.resolveHeldActivation = null;
      log.waitComplete({});
    }
    /*
     * wait until activate call is resolved before calling native methods
     * Not applicable for activate method ofc
     */
    if (this.activating && method !== 'activate') {
      log.wait({});
      await this.activating;
      log.waitComplete({});
      this.activating = null;
    }

    try {
      const result = await $bridge.request(method, params, ctx);

      log.success(result);
      return result as T;
    } catch (error) {
      /*
       * Success because error was handled validly
       * It is a developer task to define which errors must be logged
       */
      log.success({ error });
      throw error;
    }
  }

  /**
   * Adds a event listener for native event
   */
  addEventListener: AddListenerFn = (event, callback) => {
    return $bridge.addEventListener(event, callback);
  };

  /**
   * Removes all attached event listeners
   */
  removeAllListeners() {
    return $bridge.removeAllEventListeners();
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
  public async activate(
    apiKey: string,
    params: Input.ActivateParamsInput = {},
  ): Promise<void> {
    // call before log ctx calls, so no logs are lost
    const logLevel = params.logLevel;
    Log.logLevel = logLevel || null;

    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'activate' });
    log.start({ apiKey, params });

    const body = new ParamMap();
    body.set('sdk_key', apiKey);
    if (params.observerMode) {
      body.set('observer_mode', params.observerMode);
    }
    if (params.customerUserId) {
      body.set('user_id', params.customerUserId);
    }
    if (params.ipAddressCollectionDisabled) {
      body.set('ip_address_collection_disabled', params.ipAddressCollectionDisabled);
    }
    if (logLevel) {
      body.set('log_level', logLevel);
    }

    if (Platform.OS === 'ios') {
      if (params.ios?.idfaCollectionDisabled) {
        body.set('idfa_collection_disabled', params.ios.idfaCollectionDisabled);
      }
    }

    const activate = async () => {
      this.activating = this.handle<void>('activate', body, ctx, log);
      await this.activating;
    };

    if (!params.__debugDeferActivation) {
      return activate();
    }

    /*
     * Deferring activation solves annoying simulator authentication,
     * by postponing the moment, when simulator will use StoreKit
     */

    return new Promise<void>(unlock => {
      // do not resolve promise, only resolveHeldActivation must resolve
      this.resolveHeldActivation = async () => {
        const result = await activate();
        unlock(result);
      };
    });
  }

  /**
   * Fetches a paywall by its developer ID.
   *
   * @remarks
   * Adapty allows you remotely configure the products
   * that will be displayed in your app.
   * This way you don’t have to hardcode the products
   * and can dynamically change offers or run A/B tests without app releases.
   *
   * @param {string} placementId - The identifier of the desired placement.
   * This is the value you specified when you created the placement
   * in the Adapty Dashboard.
   * @param {string | undefined} [locale] - The locale of the desired paywall.
   * @param {Input.GetPaywallParamsInput} [params] - Additional parameters for retrieving paywall.
   * @returns {Promise<Model.AdaptyPaywall>}
   * A promise that resolves with a requested paywall.
   *
   * @throws {@link AdaptyError}
   * Throws an error:
   * 1. if the paywall with the specified ID is not found
   * 2. if your bundle ID does not match with your Adapty Dashboard setup
   */
  public async getPaywall(
    placementId: string,
    locale?: string,
    params: Input.GetPaywallParamsInput = {
      fetchPolicy: Input.FetchPolicy.ReloadRevalidatingCacheData,
      loadTimeoutMs: 5000,
    },
  ): Promise<Model.AdaptyPaywall> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'getPaywall' });

    log.start({ placementId, locale, params });

    const body = new ParamMap();
    body.set('placement_id', placementId);
    if (locale) {
      body.set('locale', locale);
    }
    body.set('load_timeout', params.loadTimeoutMs);

    if (params.fetchPolicy !== 'return_cache_data_if_not_expired_else_load') {
      body.set(
        'fetch_policy',
        JSON.stringify({
          type:
            params.fetchPolicy ?? Input.FetchPolicy.ReloadRevalidatingCacheData,
        } satisfies Schema['InOutput.AdaptyPaywallFetchPolicy']),
      );
    } else {
      body.set(
        'fetch_policy',
        JSON.stringify({
          type: params.fetchPolicy,
          max_age: params.maxAgeSeconds,
        } satisfies Schema['InOutput.AdaptyPaywallFetchPolicy']),
      );
    }

    const result = await this.handle<Model.AdaptyPaywall>(
      'get_paywall',
      body,
      ctx,
      log,
    );

    return result;
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
  public async getPaywallProducts(
    paywall: Model.AdaptyPaywall,
  ): Promise<Model.AdaptyPaywallProduct[]> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'getPaywallProducts' });

    log.start({ paywall });

    const coder = new AdaptyPaywallCoder();
    const body = new ParamMap();
    body.set('paywall', JSON.stringify(coder.encode(paywall)));

    const result = await this.handle<any>(
      'get_paywall_products',
      body,
      ctx,
      log,
    );

    return result;
  }

  public async getProductsIntroductoryOfferEligibility<
    T extends Model.AdaptyPaywallProduct['vendorProductId'],
  >(
    products: Model.AdaptyPaywallProduct[],
  ): Promise<Record<T, Model.OfferEligibility>> {
    const ctx = new LogContext();
    const log = ctx.call({
      methodName: 'getProductsIntroductoryOfferEligibility',
    });
    log.start({ products });

    if (Platform.OS === 'android') {
      const result = products.reduce(
        (acc, product) => {
          acc[product.vendorProductId as T] =
            product.subscriptionDetails?.android
              ?.introductoryOfferEligibility ?? 'ineligible';
          return acc;
        },
        {} as Record<T, Model.OfferEligibility>,
      );

      log.success(result);
      return result;
    }

    const body = new ParamMap();
    body.set(
      'product_ids',
      products.map(product => product.vendorProductId),
    );

    const result = await this.handle<Record<T, Model.OfferEligibility>>(
      'get_products_introductory_offer_eligibility',
      body,
      ctx,
      log,
    );

    return result;
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
  public async getProfile(): Promise<Model.AdaptyProfile> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'getProfile' });
    log.start({});

    const body = new ParamMap();

    const result = await this.handle<Model.AdaptyProfile>(
      'get_profile',
      body,
      ctx,
      log,
    );

    return result;
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
  public async identify(customerUserId: string): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'identify' });
    log.start({ customerUserId });

    const body = new ParamMap();
    body.set('user_id', customerUserId);

    const result = await this.handle<void>('identify', body, ctx, log);

    return result;
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
  public async logShowPaywall(paywall: Model.AdaptyPaywall): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'logShowPaywall' });
    log.start({ paywall });

    const coder = new AdaptyPaywallCoder();
    const body = new ParamMap();
    body.set('paywall', JSON.stringify(coder.encode(paywall)));

    const result = await this.handle<void>('log_show_paywall', body, ctx, log);

    return result;
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
  public async logShowOnboarding(
    screenOrder: number,
    onboardingName?: string,
    screenName?: string,
  ): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'logShowOnboarding' });
    log.start({ screenOrder, onboardingName, screenName });

    const body = new ParamMap();
    body.set(
      'onboarding_params',
      JSON.stringify({
        onboarding_screen_order: screenOrder,
        onboarding_name: onboardingName,
        onboarding_screen_name: screenName,
      }),
    );

    const result = await this.handle<void>(
      'log_show_onboarding',
      body,
      ctx,
      log,
    );

    return result;
  }

  /**
   * Logs out the current user.
   * You can then login the user using {@link Adapty.identify} method.
   *
   * @throws {@link AdaptyError}
   */
  public async logout(): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'logout' });
    log.start({});

    const body = new ParamMap();

    const result = await this.handle<void>('logout', body, ctx, log);

    return result;
  }

  /**
   * Performs a purchase of the specified product.
   *
   * All the available promotions will be applied automatically.
   *
   * @remarks
   * Successful purchase will also result in a call to `'onLatestProfileLoad'` listener.
   * You can use {@link Adapty.addEventListener} to subscribe to this event and handle
   * the purchase result outside of this thread.
   *
   * @param {Model.AdaptyPaywallProduct} product - The product to e purchased.
   * You can get the product using {@link Adapty.getPaywallProducts} method.
   * @param {Input.MakePurchaseParams} [params] - Additional parameters for the purchase.
   * @returns {Promise<Model.AdaptyProfile>} A Promise that resolves to an {@link Model.AdaptyProfile} object
   * containing the user's profile information after the purchase is made.
   * @throws {AdaptyError} If an error occurs during the purchase process
   * or while decoding the response from the native SDK.
   * Some of the possible errors are:
   * * #1006 — User has cancelled
   *
   * @example
   * ```ts
   * try {
   *   const paywall = await adapty.getPaywall('onboarding');
   *   const products = await adapty.getPaywallProducts(paywall);
   *   const product = products[0];
   *
   *   const profile = await adapty.makePurchase(product);
   *   // successfull purchase
   * } catch (error) {
   *   // handle error
   * }
   * ```
   */
  public async makePurchase(
    product: Model.AdaptyPaywallProduct,
    params: Input.MakePurchaseParamsInput = {},
  ): Promise<Model.AdaptyProfile> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'makePurchase' });
    log.start({ product, params });

    const coder = new AdaptyPaywallProductCoder();
    const encoded = coder.encode(product);
    const productInput = coder.getInput(encoded);

    const body = new ParamMap();

    body.set('product', JSON.stringify(productInput));

    if (params.android && Platform.OS === 'android') {
      if (params.android) {
        body.set(
          'params',
          JSON.stringify({
            replacement_mode: params.android.prorationMode,
            old_sub_vendor_product_id: params.android.oldSubVendorProductId,
          }),
        );
      }

      if (params.android.isOfferPersonalized) {
        body.set('is_offer_personalized', params.android.isOfferPersonalized);
      }
    }

    const result = await this.handle<Model.AdaptyProfile>(
      'make_purchase',
      body,
      ctx,
      log,
    );

    return result;
  }

  /**
   * Opens a native modal screen to redeem Apple Offer Codes.
   *
   * @remarks
   * iOS 14+ only.
   */
  public async presentCodeRedemptionSheet(): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'presentCodeRedemptionSheet' });
    log.start({});

    const body = new ParamMap();

    const result = await this.handle<void>(
      'present_code_redemption_sheet',
      body,
      ctx,
      log,
    );
    return result;
  }

  /**
   * Restores user purchases and updates the profile.
   *
   * @returns {Promise<Model.AdaptyProfile>} resolves with the updated profile
   * @throws {@link AdaptyError} if an error occurs during the restore proccess or while decoding the response
   */
  public async restorePurchases(): Promise<Model.AdaptyProfile> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'restorePurchases' });
    log.start({});

    const body = new ParamMap();

    const result = await this.handle<Model.AdaptyProfile>(
      'restore_purchases',
      body,
      ctx,
      log,
    );

    return result;
  }

  /**
   * Sets the fallback paywalls.
   *
   * Fallback paywalls will be used if the SDK fails
   * to fetch the paywalls from the dashboard.
   * It is not designed to be used for the offline flow,
   * as products are not cached in Adapty.
   *
   * @returns {Promise<void>} resolves when fallback paywalls are saved
   */
  public async setFallbackPaywalls(paywallsLocation: Input.FallbackPaywallsLocation): Promise<void> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'setFallbackPaywalls' });
    const paywallsLocationJson = Platform.select({
      ios: JSON.stringify(paywallsLocation.ios),
      android: JSON.stringify(paywallsLocation.android),
    });
    log.start({ paywallsLocationJson });

    const body = new ParamMap();
    body.set('file_location', paywallsLocationJson);

    const result = await this.handle<void>(
      'set_fallback_paywalls',
      body,
      ctx,
      log,
    );

    return result;
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
  public async setLogLevel(logLevel: Input.LogLevel): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'setLogLevel' });
    log.start({ logLevel });

    Log.logLevel = logLevel;

    const body = new ParamMap();
    body.set('value', logLevel);

    const result = await this.handle<void>('set_log_level', body, ctx, log);

    return result;
  }

  /**
   * Sets the variation ID of the purchase.
   *
   * In Observer mode, Adapty SDK doesn't know, where the purchase was made from.
   * If you display products using our Paywalls or A/B Tests,
   * you can manually assign variation to the purchase.
   * After doing this, you'll be able to see metrics in Adapty Dashboard.
   *
   * @param {string} variationId - `variationId` property of {@link Model.AdaptyPaywall}
   * @param {string} transactionId - `transactionId` property of {@link Model.AdaptySubscription}
   * @throws {@link AdaptyError}
   */
  public async setVariationId(
    variationId: string,
    transactionId: string,
  ): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'setVariationId' });
    log.start({ variationId, transactionId });

    const body = new ParamMap();

    body.set('variation_id', variationId);
    body.set('transaction_id', transactionId);
    body.set(
      'params',
      JSON.stringify({
        variation_id: variationId,
        transaction_id: transactionId,
      }),
    );

    const result = await this.handle<void>('set_variation_id', body, ctx, log);

    return result;
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
   * @param {Record<string | number, any>} attribution - An object containing attribution data.
   * @param {string} source - The source of the attribution data.
   * @param {string} [networkUserId] - The network user ID.
   * @returns {Promise<void>} A promise that resolves when the attribution data is updated.
   *
   * @throws {@link AdaptyError} Throws if parameters are invalid or not provided.
   */
  public async updateAttribution(
    attribution: Record<string, any>,
    source: Input.AttributionSource,
    networkUserId?: string,
  ): Promise<void> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'updateAttribution' });
    log.start({ attribution, source, networkUserId });

    let bridgeSource = source;
    if ((Input.AttributionSource as object).hasOwnProperty(source)) {
      bridgeSource =
        Input.AttributionSource[source as keyof typeof Input.AttributionSource];
    }

    let attributionData: any = attribution;
    if (Platform.OS === 'android') {
      // Android bridge handles objects poorly
      attributionData = JSON.stringify(attribution);
    }

    const body = new ParamMap();
    body.set('attribution', attributionData);
    body.set('source', bridgeSource);
    body.set('network_user_id', networkUserId);

    const result = await this.handle<void>(
      'update_attribution',
      body,
      ctx,
      log,
    );

    return result;
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
  public async updateProfile(
    params: Partial<Model.AdaptyProfileParameters>,
  ): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'updateProfile' });
    log.start({ params });

    const coder = new AdaptyProfileParametersCoder();
    const body = new ParamMap();

    body.set('params', JSON.stringify(coder.encode(params)));

    const result = await this.handle<void>('update_profile', body, ctx, log);

    return result;
  }
}
