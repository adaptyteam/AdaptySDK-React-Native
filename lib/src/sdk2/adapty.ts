import { Platform } from 'react-native';
import { bridgeArg, bridgeCall } from '../internal/bridge';
import * as Coder from '../internal/coders';
import type * as Model from '../types';
import * as Input from '../types/inputs';

import { AdaptyError } from './error';

export class Adapty {
  private bridge = bridgeCall;

  /**
   * Initializes the Adapty SDK.
   *
   * @remarks
   * This method must be called in order for the SDK to work.
   * It is preffered to call it as early as possible in the app lifecycle,
   * so background activities can be performed and cache can be updated
   *
   * @example
   * ## Basic usage in your app's entry point
   * ```ts
   * useEffect(() => {
   *  adapty.activate('YOUR_API_KEY'); // <-- pass your API key here (required)
   * }, []);
   * ```
   *
   * ## Usage with your user identifier from your system
   * ```ts
   * useEffect(() => {
   *   adapty.activate('YOUR_API_KEY', { // <-- pass your API key here (required)
   *     customerUserId: 'YOUR_USER_ID'  // <-- pass your user identifier here (optional)
   *   });
   * }, []);
   * ```
   *
   * @param {string} apiKey - You can find it in your app settings
   * in {@link https://app.adapty.io/ | Adapty Dashboard} App settings > General.
   * @param {Input.ActivateParamsInput} options - Optional parameters of type {@link ActivateParamsInput}.
   * @returns {Promise<void>} A promise that resolves when the SDK is initialized.
   *
   * @throws {@link AdaptyError}
   * Usually throws if the SDK is already activated or if the API key is invalid.
   */
  public async activate(
    apiKey: string,
    params: Input.ActivateParamsInput = {},
  ): Promise<void> {
    const observerMode = params.observerMode ?? false;
    const customerUserId = params.customerUserId;
    const logLevel = params.logLevel;

    try {
      await this.bridge('activate', {
        [bridgeArg.SDK_KEY]: apiKey,
        [bridgeArg.OBSERVER_MODE]: observerMode,
        [bridgeArg.USER_ID]: customerUserId,
        [bridgeArg.LOG_LEVEL]: logLevel,
      });
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
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
   * @param id {string} The identifier of the desired paywall.
   * This is the value you specified when you created the paywall
   * in the Adapty Dashboard.
   * @returns {Promise<Model.AdaptyPaywall>}
   * A promise that resolves with a requested {@link Model.AdaptyPaywall}
   *
   * @throws {@link AdaptyError}
   * Throws an error:
   * 1. if the paywall with the specified ID is not found
   * 2. if your bundle ID does not match with your Adapty Dashboard setup
   */
  public async getPaywall(id: string): Promise<Model.AdaptyPaywall> {
    try {
      const result = await this.bridge('get_paywall', {
        [bridgeArg.ID]: id,
      });

      if (!result) {
        throw AdaptyError.deserializationError(this.getPaywall.name);
      }
      const maybeObj = JSON.parse(result);

      const decoded = Coder.AdaptyPaywallCoder.tryDecode(maybeObj);
      return decoded.toObject();
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
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
   * @param {Model.AdaptyPaywall} paywall - a paywall to fetch products for.
   * @param {Input.GetPaywallProductsParamsInput} [params] - Optional parameters of type {@link GetPaywallProductsParamsInput}.
   * @returns {Promise<Model.AdaptyProduct[]>} A promise that resolves with a list
   * of {@link Model.AdaptyProduct} associated with a provided paywall.
   * @throws {@link AdaptyError}
   */
  public async getPaywallProducts(
    paywall: Model.AdaptyPaywall,
    params: Input.GetPaywallProductsParamsInput = {},
  ): Promise<Model.AdaptyProduct[]> {
    const fetchPolicy = params.ios?.fetchPolicy || 'default';

    try {
      const data = new Coder.AdaptyPaywallCoder(paywall);

      const result = await this.bridge('get_paywall_products', {
        [bridgeArg.PAYWALL]: JSON.stringify(data.encode()),
        ...(Platform.OS === 'ios' && {
          [bridgeArg.FETCH_POLICY]: fetchPolicy,
        }),
      });

      if (!result) {
        throw AdaptyError.deserializationError(this.getPaywallProducts.name);
      }
      const maybeArr = JSON.parse(result);
      if (!Array.isArray(maybeArr)) {
        throw AdaptyError.deserializationError(this.getPaywallProducts.name);
      }

      const products = maybeArr.map(product => {
        const decoder = Coder.AdaptyProductCoder.tryDecode(product);
        return decoder.toObject();
      });

      return products;
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
   * Fetches a user profile.
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
    try {
      const result = await this.bridge('get_profile', {});

      console.log('profile JSON', result);

      if (!result) {
        throw AdaptyError.deserializationError(this.getProfile.name);
      }
      const maybeObj = JSON.parse(result);
      const decoder = Coder.AdaptyProfileCoder.tryDecode(maybeObj);

      return decoder.toObject();
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
   * If you don't have a user id on SDK initialization,
   * you can set it later at any time with this method.
   * The most common cases are after registration/authorization
   * when the user switches from being an anonymous user to an authenticated user.
   *
   * @param {string} customerUserId - unique user id
   * @throws {@link AdaptyError}
   */
  public async identify(customerUserId: string): Promise<void> {
    try {
      await this.bridge('identify', {
        [bridgeArg.USER_ID]: customerUserId,
      });
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
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
    try {
      const data = new Coder.AdaptyPaywallCoder(paywall);

      await this.bridge('log_show_paywall', {
        [bridgeArg.PAYWALL]: JSON.stringify(data.encode()),
      });
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
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
    try {
      await this.bridge('log_show_onboarding', {
        [bridgeArg.ONBOARDING_PARAMS]: JSON.stringify({
          onboarding_screen_order: screenOrder,
          onboarding_name: onboardingName,
          onboarding_screen_name: screenName,
        }),
      });
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
   * Logs out the current user.
   * You can then login the user using {@link Adapty.identify} method.
   *
   * @throws {@link AdaptyError}
   */
  public async logout(): Promise<void> {
    try {
      await this.bridge('logout', {});
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
   *
   */
  public async makePurchase(
    product: Model.AdaptyProduct,
  ): Promise<Model.AdaptyProfile> {
    try {
      const data = new Coder.AdaptyProductCoder(product);

      const result = await this.bridge('make_purchase', {
        [bridgeArg.PRODUCT]: JSON.stringify(data.encode()),
      });
      if (!result) {
        throw AdaptyError.deserializationError(this.makePurchase.name);
      }
      const maybeObj = JSON.parse(result);
      const decoder = Coder.AdaptyProfileCoder.tryDecode(maybeObj);

      return decoder.toObject();
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
   * Opens a native modal screen to redeem Apple Offer Codes.
   * iOS 14+ only.
   */
  public async presentCodeRedemptionSheet(): Promise<void> {
    await this.bridge('present_code_redemption_sheet', {});
  }

  /**
   * Restores user purchases and updates the profile.
   *
   * @returns {Promise<Model.AdaptyProfile>} resolves with the updated profile
   * @throws {@link AdaptyError}
   */
  public async restorePurchases(): Promise<Model.AdaptyProfile> {
    try {
      const result = await this.bridge('restore_purchases', {});
      if (!result) {
        throw AdaptyError.deserializationError(this.restorePurchases.name);
      }

      const maybeObj = JSON.parse(result);
      const decoder = Coder.AdaptyProfileCoder.tryDecode(maybeObj);

      return decoder.toObject();
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  /**
   *
   * @returns {Promise<void>} resolves when fallback paywalls are saved
   */
  public async setFallbackPaywalls(paywalls: string): Promise<void> {
    try {
      await this.bridge('set_fallback_paywalls', {
        [bridgeArg.PAYWALLS]: paywalls,
      });
    } catch (error) {
      throw AdaptyError.tryWrap(error);
    }
  }

  /**
   * Logs errors and other important information
   * to help you understand what is going on.
   *
   * @remarks
   * There are four levels available:
   *
   * error: only errors will be logged
   * warn: messages from the SDK that do not cause critical errors, but are worth paying attention to
   * info: various information messages, such as those that log the lifecycle of various modules
   * verbose: any additional information that may be useful during debugging, such as function calls, API queries, etc.
   *
   * @param {Input.LogLevel} logLevel - new preferred log level
   * @returns {Promise<void>} resolves when the log level is set
   * @throws {@link AdaptyError} if the log level is invalid
   */
  public async setLogLevel(logLevel: Input.LogLevel): Promise<void> {
    try {
      await this.bridge('set_log_level', {
        [bridgeArg.VALUE]: logLevel,
      });
    } catch (error) {
      throw AdaptyError.tryWrap(error);
    }
  }

  /**
   * In Observer mode, Adapty SDK doesn't know, where the purchase was made from.
   * If you display products using our Paywalls or A/B Tests,
   * you can manually assign variation to the purchase.
   * After doing this, you'll be able to see metrics in Adapty Dashboard.
   *
   * @param {string} variationId - `variationId` property of {@link Model.AdaptyPaywall}
   * @param {string} transactionId - `transactionId` property of {@link Model.AdaptyPurchase}
   * @throws {@link AdaptyError}
   */
  public async setVariationId(
    variationId: string,
    transactionId: string,
  ): Promise<void> {
    try {
      await this.bridge('set_variation_id', {
        [bridgeArg.VARIATION_ID]: variationId,
        [bridgeArg.TRANSACTION_ID]: transactionId,
      });
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
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
   * @throws {@link AdaptyError}
   * Throws if parameters are invalid or not provided.
   */
  public async updateAttribution(
    attribution: Record<string, any>,
    source: Input.AttributionSource,
    networkUserId?: string,
  ): Promise<void> {
    try {
      await this.bridge('update_attribution', {
        [bridgeArg.ATTRIBUTION]: attribution,
        [bridgeArg.SOURCE]: source,
        [bridgeArg.NETWORK_USER_ID]: networkUserId,
      });
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }

  // 22;
  /**
   *
   * @param params
   * @throws
   */
  public async updateProfile(params: {}): Promise<void> {
    try {
      await this.bridge('update_profile', {
        [bridgeArg.PARAMS]: JSON.stringify(params),
      });
    } catch (nativeError) {
      throw AdaptyError.tryWrap(nativeError);
    }
  }
}
