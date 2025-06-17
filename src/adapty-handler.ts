import { Platform } from 'react-native';

import { $bridge } from '@/bridge';
import { LogContext, Log, LogScope } from '@/logger';
import type { Def, Req } from '@/types/schema';

import { AdaptyPaywallCoder } from '@/coders/adapty-paywall';
import { AdaptyPaywallProductCoder } from '@/coders/adapty-paywall-product';
import { AdaptyProfileParametersCoder } from '@/coders/adapty-profile-parameters';

import type * as Model from '@/types';
import * as Input from '@/types/inputs';
import { AddListenerFn, MethodName } from '@/types/bridge';
import { AdaptyType } from '@/coders/parse';
import version from '@/version';
import { AdaptyUiMediaCacheCoder } from '@/coders/adapty-ui-media-cache';
import { AdaptyUiMediaCache } from '@/ui/types';
import { RefundPreference } from '@/types';

/**
 * Entry point for the Adapty SDK.
 * All Adapty methods are available through this class.
 * @public
 */
export class Adapty {
  private resolveHeldActivation?: (() => Promise<void>) | null = null;
  private activating: Promise<void> | null = null;
  private nonWaitingMethods: MethodName[] = [
    'activate',
    'is_activated',
    'get_paywall_for_default_audience',
  ];
  private defaultMediaCache: AdaptyUiMediaCache = {
    memoryStorageTotalCostLimit: 100 * 1024 * 1024,
    memoryStorageCountLimit: 2147483647,
    diskStorageSizeLimit: 100 * 1024 * 1024,
  };

  // Middleware to call native handle
  async handle<T>(
    method: MethodName,
    params: string,
    resultType: AdaptyType,
    ctx: LogContext,
    log: LogScope,
  ): Promise<T> {
    /*
     * If resolveHeldActivation is defined,
     * wait until it is resolved before calling native methods
     *
     * Not applicable for activate method ofc
     */
    if (
      this.resolveHeldActivation &&
      !this.nonWaitingMethods.includes(method)
    ) {
      log.wait({});
      await this.resolveHeldActivation();
      this.resolveHeldActivation = null;
      log.waitComplete({});
    }
    /*
     * wait until activate call is resolved before calling native methods
     * Not applicable for activate method ofc
     */
    if (
      this.activating &&
      (!this.nonWaitingMethods.includes(method) || method === 'is_activated')
    ) {
      log.wait({});
      await this.activating;
      log.waitComplete({});
      this.activating = null;
    }

    try {
      const result = await $bridge.request(method, params, resultType, ctx);

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
    if (event !== 'onLatestProfileLoad') {
      throw new Error('Only onLatestProfileLoad event is supported');
    }
    return $bridge.addEventListener('did_load_latest_profile', callback);
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

    // Skipping activation if SDK is already activated
    if (params.__ignoreActivationOnFastRefresh) {
      try {
        const isAlreadyActivated = await this.isActivated();
        if (!!this.activating || isAlreadyActivated) {
          log.success({
            message:
              'SDK already activated, skipping activation because ignoreActivationOnFastRefresh flag is enabled',
          });
          return Promise.resolve();
        }
      } catch (error) {
        log.waitComplete({
          message:
            'Failed to check activation status, proceeding with activation; ignoreActivationOnFastRefresh flag could not be applied',
          error,
        });
      }
    }

    const config: Def['AdaptyConfiguration'] = {
      api_key: apiKey,
      cross_platform_sdk_name: 'react-native',
      cross_platform_sdk_version: version,
    };
    if (params.customerUserId) {
      config['customer_user_id'] = params.customerUserId;
    }
    config['observer_mode'] = params.observerMode ?? false;
    config['ip_address_collection_disabled'] =
      params.ipAddressCollectionDisabled ?? false;
    if (logLevel) {
      config['log_level'] = logLevel;
    }
    config['server_cluster'] = params.serverCluster ?? 'default';
    if (params.backendBaseUrl) {
      config['backend_base_url'] = params.backendBaseUrl;
    }
    if (params.backendFallbackBaseUrl) {
      config['backend_fallback_base_url'] = params.backendFallbackBaseUrl;
    }
    if (params.backendConfigsBaseUrl) {
      config['backend_configs_base_url'] = params.backendConfigsBaseUrl;
    }
    if (params.backendProxyHost) {
      config['backend_proxy_host'] = params.backendProxyHost;
    }
    if (params.backendProxyPort) {
      config['backend_proxy_port'] = params.backendProxyPort;
    }
    config['activate_ui'] = params.activateUi ?? true;
    const coder = new AdaptyUiMediaCacheCoder();
    config['media_cache'] = coder.encode(
      params.mediaCache ?? this.defaultMediaCache,
    );

    if (Platform.OS === 'ios') {
      config['apple_idfa_collection_disabled'] =
        params.ios?.idfaCollectionDisabled ?? false;
    }

    if (Platform.OS === 'android') {
      config['google_adid_collection_disabled'] =
        params.android?.adIdCollectionDisabled ?? false;
    }

    const methodKey = 'activate';
    const body = JSON.stringify({
      method: methodKey,
      configuration: config,
    } satisfies Req['Activate.Request']);

    const activate = async () => {
      this.activating = this.handle<void>(methodKey, body, 'Void', ctx, log);
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

    const methodKey = 'get_paywall';
    const data: Req['GetPaywall.Request'] = {
      method: methodKey,
      placement_id: placementId,
      load_timeout: (params.loadTimeoutMs ?? 5000) / 1000,
    };
    if (locale) {
      data['locale'] = locale;
    }
    if (params.fetchPolicy !== 'return_cache_data_if_not_expired_else_load') {
      data['fetch_policy'] = {
        type:
          params.fetchPolicy ?? Input.FetchPolicy.ReloadRevalidatingCacheData,
      } satisfies Def['AdaptyPaywall.FetchPolicy'];
    } else {
      data['fetch_policy'] = {
        type: params.fetchPolicy,
        max_age: params.maxAgeSeconds,
      } satisfies Def['AdaptyPaywall.FetchPolicy'];
    }

    const body = JSON.stringify(data);

    const result = await this.handle<Model.AdaptyPaywall>(
      methodKey,
      body,
      'AdaptyPaywall',
      ctx,
      log,
    );

    return result;
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
   * @param {Input.GetPaywallForDefaultAudienceParamsInput} [params] - Additional parameters for retrieving paywall.
   * @returns {Promise<Model.AdaptyPaywall>}
   * A promise that resolves with a requested paywall.
   *
   * @throws {@link AdaptyError}
   * Throws an error:
   * 1. if the paywall with the specified ID is not found
   * 2. if your bundle ID does not match with your Adapty Dashboard setup
   */
  public async getPaywallForDefaultAudience(
    placementId: string,
    locale?: string,
    params: Input.GetPaywallForDefaultAudienceParamsInput = {
      fetchPolicy: Input.FetchPolicy.ReloadRevalidatingCacheData,
    },
  ): Promise<Model.AdaptyPaywall> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'getPaywallForDefaultAudience' });

    log.start({ placementId, locale, params });

    const methodKey = 'get_paywall_for_default_audience';
    const data: Req['GetPaywallForDefaultAudience.Request'] = {
      method: methodKey,
      placement_id: placementId,
    };
    if (locale) {
      data['locale'] = locale;
    }
    if (params.fetchPolicy !== 'return_cache_data_if_not_expired_else_load') {
      data['fetch_policy'] = {
        type:
          params.fetchPolicy ?? Input.FetchPolicy.ReloadRevalidatingCacheData,
      } satisfies Def['AdaptyPaywall.FetchPolicy'];
    } else {
      data['fetch_policy'] = {
        type: params.fetchPolicy,
        max_age: params.maxAgeSeconds,
      } satisfies Def['AdaptyPaywall.FetchPolicy'];
    }

    const body = JSON.stringify(data);

    const result = await this.handle<Model.AdaptyPaywall>(
      methodKey,
      body,
      'AdaptyPaywall',
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
    const methodKey = 'get_paywall_products';
    const data: Req['GetPaywallProducts.Request'] = {
      method: methodKey,
      paywall: coder.encode(paywall),
    };

    const body = JSON.stringify(data);

    const result = await this.handle<any>(
      methodKey,
      body,
      'Array<AdaptyPaywallProduct>',
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

    const methodKey = 'get_profile';
    const body = JSON.stringify({
      method: methodKey,
    } satisfies Req['GetProfile.Request']);

    const result = await this.handle<Model.AdaptyProfile>(
      methodKey,
      body,
      'AdaptyProfile',
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

    const methodKey = 'identify';
    const data: Req['Identify.Request'] = {
      method: methodKey,
      customer_user_id: customerUserId,
    };
    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

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
    const methodKey = 'log_show_paywall';
    const data: Req['LogShowPaywall.Request'] = {
      method: methodKey,
      paywall: coder.encode(paywall),
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
  }

  public async openWebPaywall(
    paywallOrProduct: Model.AdaptyPaywall | Model.AdaptyPaywallProduct,
  ): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'openWebPaywall' });
    log.start({ paywallOrProduct });

    const methodKey = 'open_web_paywall';
    const data: Req['OpenWebPaywall.Request'] = {
      method: methodKey,
      ...('vendorProductId' in paywallOrProduct
        ? { product: new AdaptyPaywallProductCoder().encode(paywallOrProduct) }
        : { paywall: new AdaptyPaywallCoder().encode(paywallOrProduct) }),
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
  }

  public async createWebPaywallUrl(
    paywallOrProduct: Model.AdaptyPaywall | Model.AdaptyPaywallProduct,
  ): Promise<string> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'create_web_paywall_url' });
    log.start({ paywallOrProduct });

    const methodKey = 'create_web_paywall_url';
    const data: Req['CreateWebPaywallUrl.Request'] = {
      method: methodKey,
      ...('vendorProductId' in paywallOrProduct
        ? { product: new AdaptyPaywallProductCoder().encode(paywallOrProduct) }
        : { paywall: new AdaptyPaywallCoder().encode(paywallOrProduct) }),
    };

    const body = JSON.stringify(data);

    const result = await this.handle<string>(
      methodKey,
      body,
      'String',
      ctx,
      log,
    );

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

    const methodKey = 'log_show_onboarding';
    const data: Req['LogShowOnboarding.Request'] = {
      method: methodKey,
      params: {
        onboarding_screen_order: screenOrder,
        onboarding_name: onboardingName,
        onboarding_screen_name: screenName,
      },
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

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

    const methodKey = 'logout';
    const body = JSON.stringify({
      method: methodKey,
    } satisfies Req['Logout.Request']);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
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
  public async makePurchase(
    product: Model.AdaptyPaywallProduct,
    params: Input.MakePurchaseParamsInput = {},
  ): Promise<Model.AdaptyPurchaseResult> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'makePurchase' });
    log.start({ product, params });

    const coder = new AdaptyPaywallProductCoder();
    const encoded = coder.encode(product);
    const productInput = coder.getInput(encoded);

    const methodKey = 'make_purchase';
    const data: Req['MakePurchase.Request'] = {
      method: methodKey,
      product: productInput,
    };

    if (params.android && Platform.OS === 'android') {
      data['subscription_update_params'] = {
        replacement_mode: params.android.prorationMode,
        old_sub_vendor_product_id: params.android.oldSubVendorProductId,
      };

      if (params.android.isOfferPersonalized) {
        data['is_offer_personalized'] = params.android.isOfferPersonalized;
      }
    }

    const body = JSON.stringify(data);

    const result = await this.handle<Model.AdaptyPurchaseResult>(
      methodKey,
      body,
      'AdaptyPurchaseResult',
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
    if (Platform.OS === 'android') {
      return Promise.resolve();
    }

    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'presentCodeRedemptionSheet' });
    log.start({});

    const methodKey = 'present_code_redemption_sheet';
    const body = JSON.stringify({
      method: methodKey,
    } satisfies Req['PresentCodeRedemptionSheet.Request']);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);
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
   * @param {string} transactionId - `transactionId` property of {@link Model.AdaptySubscription}
   * @param {string} variationId - `variationId` property of {@link Model.AdaptyPaywall}
   * @throws {@link AdaptyError}
   */
  public async reportTransaction(
    transactionId: string,
    variationId?: string,
  ): Promise<void> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'reportTransaction' });
    log.start({ variationId, transactionId });

    const methodKey = 'report_transaction';
    const data: Req['ReportTransaction.Request'] = {
      method: methodKey,
      transaction_id: transactionId,
    };

    if (variationId) {
      data['variation_id'] = variationId;
    }

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
  }

  /**
   * Restores user purchases and updates the profile.
   *
   * @returns {Promise<Model.AdaptyProfile>} resolves with the updated profile
   * @throws {@link AdaptyError} if an error occurs during the restore process or while decoding the response
   */
  public async restorePurchases(): Promise<Model.AdaptyProfile> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'restorePurchases' });
    log.start({});

    const methodKey = 'restore_purchases';
    const body = JSON.stringify({
      method: methodKey,
    } satisfies Req['RestorePurchases.Request']);

    const result = await this.handle<Model.AdaptyProfile>(
      methodKey,
      body,
      'AdaptyProfile',
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
  public async setFallbackPaywalls(
    paywallsLocation: Input.FallbackPaywallsLocation,
  ): Promise<void> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'setFallbackPaywalls' });
    const paywallsLocationJson = Platform.select({
      ios: paywallsLocation.ios.fileName,
      android:
        'relativeAssetPath' in paywallsLocation.android
          ? `${paywallsLocation.android.relativeAssetPath}a`
          : `${paywallsLocation.android.rawResName}r`,
    });
    log.start({ paywallsLocationJson });

    const methodKey = 'set_fallback_paywalls';
    const data: Req['SetFallbackPaywalls.Request'] = {
      method: methodKey,
      asset_id: paywallsLocationJson ?? '',
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
  }

  public async setIntegrationIdentifier(
    key: string,
    value: string,
  ): Promise<void> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'setIntegrationIdentifier' });
    log.start({ key });

    const methodKey = 'set_integration_identifiers';
    const data: Req['SetIntegrationIdentifier.Request'] = {
      method: methodKey,
      key_values: { [key]: value },
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

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

    const methodKey = 'set_log_level';
    const data: Req['SetLogLevel.Request'] = {
      method: methodKey,
      value: logLevel,
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

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
   * @param {Record<string, any>} attribution - An object containing attribution data.
   * @param {string} source - The source of the attribution data.
   * @returns {Promise<void>} A promise that resolves when the attribution data is updated.
   *
   * @throws {@link AdaptyError} Throws if parameters are invalid or not provided.
   */
  public async updateAttribution(
    attribution: Record<string, any>,
    source: string,
  ): Promise<void> {
    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'updateAttribution' });
    log.start({ attribution, source });

    const methodKey = 'update_attribution_data';
    const data: Req['UpdateAttributionData.Request'] = {
      method: methodKey,
      attribution: JSON.stringify(attribution),
      source: source,
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
  }

  public async updateCollectingRefundDataConsent(
    consent: boolean,
  ): Promise<void> {
    if (Platform.OS === 'android') {
      return Promise.resolve();
    }

    const ctx = new LogContext();
    const log = ctx.call({
      methodName: 'update_collecting_refund_data_consent',
    });
    log.start({ consent });

    const methodKey = 'update_collecting_refund_data_consent';
    const data: Req['UpdateCollectingRefundDataConsent.Request'] = {
      method: methodKey,
      consent: consent,
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
  }

  public async updateRefundPreference(
    refundPreference: RefundPreference,
  ): Promise<void> {
    if (Platform.OS === 'android') {
      return Promise.resolve();
    }

    const ctx = new LogContext();
    const log = ctx.call({ methodName: 'update_refund_preference' });
    log.start({ refundPreference });

    const methodKey = 'update_refund_preference';
    const data: Req['UpdateRefundPreference.Request'] = {
      method: methodKey,
      refund_preference: refundPreference,
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

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
    const methodKey = 'update_profile';
    const data: Req['UpdateProfile.Request'] = {
      method: methodKey,
      params: coder.encode(params),
    };

    const body = JSON.stringify(data);

    const result = await this.handle<void>(methodKey, body, 'Void', ctx, log);

    return result;
  }

  public async isActivated(): Promise<boolean> {
    const ctx = new LogContext();

    const log = ctx.call({ methodName: 'isActivated' });
    log.start({});

    const methodKey = 'is_activated';
    const body = JSON.stringify({
      method: methodKey,
    } satisfies Req['IsActivated.Request']);

    const result = await this.handle<boolean>(
      methodKey,
      body,
      'Boolean',
      ctx,
      log,
    );

    return result;
  }
}
