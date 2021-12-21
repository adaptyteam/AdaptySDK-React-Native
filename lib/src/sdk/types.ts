import { AdaptyModule } from '../utils';

/** @private */
export interface AdaptyContext {
  module: AdaptyModule;
  isActivated: boolean;

  sdkKey: string | undefined;
  observerMode: boolean;
  customerUserId?: string;
}

export enum AdaptyEvent {
  OnPurchaseSuccess = 'onPurchaseSuccess',
  OnPurchaseFailed = 'onPurchaseFailed',
  OnInfoUpdate = 'onInfoUpdate',
  OnPromoReceived = 'onPromoReceived',
}

// export type PurchaseSuccessEventCallback = () => void | Promise<void>;
// export type PurchaseFailedEventCallback = () => void;
export type InfoUpdateEventCallback = (
  purchaserInfo: AdaptyPurchaserInfo,
) => void | Promise<void>;
export type PromoReceievedEventCallback = (
  promo: AdaptyPromo,
) => void | Promise<void>;
export type DeferredPurchaseEventCallback = (
  product: AdaptyProduct,
) => void | Promise<void>;

/** A store that processed a payment */
export type AdaptyVendorStore = 'app_store' | 'play_store' | 'adapty';

export type AdaptyProductPeriod = 'day' | 'week' | 'month' | 'year';

export type AdaptyOfferType = 'free_trial' | 'pay_as_you_go' | 'pay_up_front';

/**
 *
 */
export interface AdaptyProfile {
  /**
   * Adapty UserID for admin panel
   *
   * The most common usecases are after registration,
   * when a user switches from being an anonymous user
   * to an authenticated user with some ID
   *
   * @example "122", "1a262ce2"
   */
  customerUserId: string;
  /**
   * User's first name
   * @example "John"
   */
  firstName: string;
  /**
   * User's last name
   * @example "Doe"
   */
  lastName: string;
  /**
   * User email, can hold any string
   * @example "client@adapty.io"
   */
  email: string;
  /**
   * User phone number, can hold any string
   * @example "+10000000000"
   */
  phoneNumber: string;
  /**
   * User sex, default types are "male" & "female", "other" though
   * you can hold any value
   * @example "male"
   */
  gender: 'male' | 'female' | 'other';
  /** User birthday */
  birthday: Date; // TO ISO
  /**
   * IDFA (The Identifier for Advertisers)
   * @example "EEEEEEEE-AAAA-BBBB-CCCC-DDDDDDDDDDDD"
   */
  idfa: string;
  /**
   * Facebook UserID
   * @example "00000000000000"
   */
  facebookUserId: string;
  /**
   * Facebook Anonymous ID
   */
  facebookAnonymousId: string;
  /**
   * Amplitude UserID
   * @example "00000000000000"
   */
  amplitudeUserId: string;
  /**
   * Amplitude DeviceID
   * @example "00000000000000"
   */
  amplitudeDeviceId: string;
  /**
   * Mixpanel UserID
   * @example "00000000000000"
   */
  mixpanelUserId: string;
  /**
   * AppMetrica ProfileID
   * @example "00000000000000"
   */
  appmetricaProfileId: string;
  /**
   * AppMetrica DeviceID
   * @example "00000000000000"
   */
  appmetricaDeviceId: string;

  customAttributes: Record<string, string | number | boolean>;

  attStatus: 0 | 1 | 2 | 3;
}

/**
 * Android-only Proration Mode
 * @see {@link https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams.ProrationMode}
 */
export type AndroidProrationMode =
  | 'immediate_with_time_proration'
  | 'immediate_and_charge_prorated_price'
  | 'immediate_without_proration'
  | 'deferred'
  | 'immediate_and_charge_full_price';

/**
 * An information about a product
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptyproduct}
 */
export interface AdaptyProduct {
  /** Unique identifier of a product from App Store Connect or Google Play Console */
  vendorProductId: string;
  /**
   * Duration of subscription products
   * @see {@link AdaptyProductSubscriptionPeriod}
   */
  subscriptionPeriod: AdaptyProductSubscriptionPeriod;
  /**
   * An information about introductory price and duration for a product
   * @see {@link AdaptyProductDiscount}
   */
  introductoryDiscount?: AdaptyProductDiscount;
  /**
   * User's eligibility for your introductory offer.
   * Check this property before displaying info about
   * introductory offers (i.e. free trials)
   */
  introductoryOfferEligibility: boolean;
  /** The cost of the product in the local currency */
  price: number;
  /** Currency symbol for a user's locale ($, €) */
  currencySymbol: string;
  /** Description of a product for a user's locale */
  localizedDescription: string;
  /** Title of a product for a user's locale */
  localizedTitle: string;
  /** Formatted price of a product for a user's locale */
  localizedPrice: string;
  /** Paywall unique ID */
  variationId?: string;
  /** The ISO 4217 currency code for a user's locale (USD, EUR)
   * @see {@link https://en.wikipedia.org/wiki/ISO_4217}
   */
  currencyCode: string;
  /**
   * Parent Paywall name if any
   */
  paywallName?: string;
  /**
   * Parent A/B test name if any
   */
  paywallABTestName?: string;
  /**
   * Localized subscription period of the product
   */
  localizedSubscriptionPeriod?: string;
  /**
   * Android-only features
   */
  android?: {
    /**
     * Duration of a trial period. Android feature
     * @see {@link AdaptyProductSubscriptionPeriod}
     * @see {@link https://developer.android.com/google/play/billing/subscriptions#free-trial}
     */
    freeTrialPeriod?: AdaptyProductSubscriptionPeriod;
  };
  /**
   * iOS-only features
   */
  ios?: {
    /**
     * User's eligibility for the promotional offers.
     * Check this property before displaying info
     * about promotional offers
     */
    promotionalOfferEligibility: boolean;
    /**
     * Indicates whether a product is available for a
     * family sharing in App Store Connect
     * @since iOS 14 / macOS 11
     * @see {@link https://developer.apple.com/documentation/storekit/skproduct/3564805-isfamilyshareable}
     */
    isFamilyShareable: boolean;
    /**
     * An array of discount offers available for a product.
     * @see {@link AdaptyProductDiscount}
     * @since iOS 14 / macOS 11
     */
    discounts: AdaptyProductDiscount[];
    /**
     * An identifier of a promotional offer,
     * provided by Adapty for this specific user.
     */
    promotionalOfferId?: string;
    /**
     * An identifier of a subscription group from App Store
     * Connect to which the subscription belongs
     */
    subscriptionGroupIdentifier?: string;
    /**
     * ISO 3166 ALPHA-2 region code of the user's localization (US, DE)
     * @see {@link https://en.wikipedia.org/wiki/ISO_3166}
     */
    regionCode?: string;
  };
}

/**
 * Discount model to products
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptyproductdiscount}
 */
export interface AdaptyProductDiscount {
  /** An information about period for a product discount */
  subscriptionPeriod: AdaptyProductSubscriptionPeriod;
  /** Discount price of a product in a local currency */
  price: number;
  /** A formatted price of a discount for a user's locale */
  localizedPrice: string;
  /** A number of periods this product discount is available */
  numberOfPeriods: number;
  /** A formatted subscription period of a discount for a user's locale */
  localizedSubscriptionPeriod: string;
  /**
   * iOS-only features
   * @since iOS 11.2, macOS 10.14.4
   */
  ios?: {
    /** A formatted number of periods of a discount for a user's locale */
    localizedNumberOfPeriods: number;
    /** A payment mode for this product discount */
    paymentMode: string;
    /**
     * Unique identifier of a discount offer for a product
     * @since iOS 12.2
     * @see {@link https://developer.apple.com/documentation/storekit/skpaymentdiscount/3043528-identifier}
     */
    identifier: string;
  };
}

/** @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptyproductsubscriptionperiod} */
export interface AdaptyProductSubscriptionPeriod {
  /**
   * A unit of time that a subscription period is specified in.
   * The possible values are: day, week, month and year
   * @see {@link AdaptyProductPeriod}
   */
  unit: AdaptyProductPeriod;
  /**
   * A number of period units
   */
  numberOfUnits: number;
}

/**
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptypurchaserinfo}
 */
export interface AdaptyPurchaserInfo {
  /** Profile ID */
  profileId: string;
  /** An identifier of a user in your system */
  customerUserId: string;
  /**
   * Object where the keys are paid access level identifiers
   * configured by developer in Adapty dashboard.
   * Not passed if the customer has no access levels.
   * @see {@link AdaptyPaidAccessLevelsInfo}
   */
  accessLevels?: { [accessLevelId: string]: AdaptyPaidAccessLevelsInfo };
  /**
   * Object where the keys are vendor product ids
   * Not passed if the customer has no subscriptions.
   * @see {@link AdaptySubscriptionsInfo}
   */
  subscriptions?: { [vendorProductId: string]: AdaptySubscriptionsInfo };
  /**
   * Object where the keys are vendor product ids.
   *  Values are array[] of NonSubscriptionsInfoModel objects.
   * Not passed if the customer has no purchases.
   * @see {@link AdaptyNonSubscriptionsInfo}
   */
  nonSubscriptions?: {
    [vendorProductId: string]: AdaptyNonSubscriptionsInfo[];
  };
}

/**
 * Information about the user's access level
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptypaidaccesslevelsinfo}
 */
export interface AdaptyPaidAccessLevelsInfo {
  /** Unique identifier of the access level configured by you in Adapty Dashboard */
  id: string;
  /**
   * True if this access level is active. Generally,
   * you can check this property to determine whether
   * a user has an access to premium features
   */
  isActive: boolean;
  /** An identifier of a product in a store that unlocked this access level */
  vendorProductId: string;
  /** A transaction id of a purchase in a store that unlocked this access level */
  vendorTransactionId?: string;
  /**
   * An original transaction id of a purchase in a store
   * that unlocked this access level. For auto-renewable subscriptions
   *  this would be an id of the first transaction in a subscription
   */
  vendorOriginalTransactionId?: string;
  /**
   * A store of the purchase that unlocked this access level
   * @see {@link AdaptyVendorStore}
   */
  store: AdaptyVendorStore;
  /**
   * Time when this access level was activated. ISO 8601 datetime
   * @todo Date?
   */
  activatedAt: string;
  /**
   * Time when this access level has started (could be in the future). ISO 8601 datetime
   * @todo Date?
   */
  startsAt: string;
  /**
   * Time when the access level was renewed. ISO 8601 datetime
   * @todo Date?
   */
  renewedAt: string;
  /**
   * Time when the access level will expire (could be in the past and could be null for lifetime access).
   * ISO 8601 datetime
   * @todo Date?
   */
  expiresAt: string;
  /** True if this access level is active for a lifetime (no expiration date) */
  isLifetime: boolean;
  /**
   * The type of active introductory offer.
   * If the value is not null it means that offer was applied
   * during the current subscription period
   * @see {@link AdaptyOfferType}
   */
  activeIntroductoryOfferType: AdaptyOfferType;
  /**
   * The type of active promotional offer.
   * If the value is not null it means that offer was applied
   * during the current subscription period.
   * @see {@link AdaptyOfferType}
   */
  activePromotionalOfferType: AdaptyOfferType;
  /** True if this auto-renewable subscription is set to renew */
  willRenew: boolean;
  /**
   * True if this auto-renewable subscription is in the grace period
   * @see {@link https://help.apple.com/app-store-connect/#/dev58bda3212}
   */
  isInGracePeriod: boolean;
  /**
   * DateTime when auto renewable subscription was cancelled.
   * Subscription can still be active, it just means that auto renewal turned off.
   * Will set to null if the user reactivates subscription
   * @todo Date?
   */
  unsubscribedAt?: string;
  /**
   * Time when billing issue was detected. Subscription can still be active.
   * Would be set to null if a charge is made. ISO 8601 datetime
   * @todo Date?
   */
  billingIssueDetectedAt?: string;
}

/**
 * Stores info about vendor subscription
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptysubscriptioninfo}
 */
export interface AdaptySubscriptionsInfo {
  /** True if this subscription is active */
  isActive: boolean;
  /** An identifier of a product in a store that unlocked this subscription */
  vendorProductId: string;
  /**
   * An original transaction id of the purchase
   * in a store that unlocked this subscription.
   * For auto-renewable subscription,
   * this will be an id of the first
   * transaction in this subscription
   */
  vendorOriginalTransactionId?: string;
  /** A transaction id of a purchase in a store that unlocked this subscription */
  vendorTransactionId?: string;
  /**
   * Store where the product was purchased
   * @see {@link AdaptyVendorStore}
   */
  store: AdaptyVendorStore;
  /**
   * Time when the subscription was activated. ISO 8601 datetime
   * @todo
   */
  activatedAt?: string;
  /**
   * Time when the subscription was renewed. ISO 8601 datetime
   * @todo
   */
  renewedAt?: string;
  /**
   * Time when the subscription will expire
   * (could be in the past and could be null for a lifetime access).
   * ISO 8601 datetime
   * @todo Date?
   */
  expiresAt?: string;
  /**
   * Time when the subscription has started (could be in the future). ISO 8601 datetime
   * @todo Date?
   */
  startsAt?: string;
  /**
   * True if the subscription is active for lifetime (no expiration date)
   */
  isLifetime: boolean;
  /**
   * The type of active introductory offer
   * If the value is not null it means that
   * offer was applied during the current subscription period
   * @see {@link AdaptyOfferType}
   */
  activeIntroductoryOfferType: AdaptyOfferType;
  /**
   * The type of active promotional offer
   * @see {@link AdaptyOfferType}
   */
  activePromotionalOfferType?: AdaptyOfferType;
  /**
   * True if auto renewable subscription is set to renew
   */
  willRenew: boolean;
  /**
   * True is auto renewable subscription is in grace period
   */
  isInGracePeriod: boolean;
  /**
   * DateTime when auto renewable subscription was cancelled.
   * Subscription can still be active, it just means that
   * auto renewal turned off.
   * Will set to null if the user reactivates subscription
   * @todo Date?
   */
  unsubscribedAt?: string;
  /**
   * DateTime when billing issue was detected (vendor was not able to charge the card).
   * Subscription can still be active. Will set to null if the charge was successful.
   * @todo Date?
   */
  billingIssueDetectedAt?: string;
  /**
   * True if the product was purchased in sandbox enviroment
   */
  isSandbox: boolean;
  /** A reason why the subscription was cancelled */
  cancellationReason?:
    | 'voluntarily_cancelled'
    | 'billing_error'
    | 'refund'
    | 'price_increase'
    | 'product_was_not_available'
    | 'unknown';
  /** True if the purchase was refunded */
  isRefund: boolean;
}

/**
 * Stores info about purchases, that are not subscriptions
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptynonsubscriptionsinfo}
 */
export interface AdaptyNonSubscriptionsInfo {
  /**
   * An identifier of the purchase in Adapty.
   * You can use it to ensure that you've already processed
   * this purchase (for example tracking one time products)
   */
  purchaseId: string;
  /** An identifier of the product in a store */
  vendorProductId: string;
  /**
   * A store of the purchase
   * @see {@link AdaptyVendorStore}
   */
  store: AdaptyVendorStore;
  /**
   * Time when the product was purchased. ISO 8601 datetime
   * @todo Date?
   */
  purchasedAt?: string;
  /**
   * True if a product should only be processed once.
   * If true, the purchase will be returned by Adapty API one time only
   */
  isOneTime: string;
  /**
   * True if the product was purchased in sandbox
   * environment
   */
  isSandbox: boolean;
  /**
   * Transaction ID in vendor system
   */
  vendorTransactionId: string;
  /**
   * Original transaction ID in vendor system.
   * For auto renewable subscription this will be an ID
   * of the first transaction in the subscription
   */
  vendorOriginalTransactionId: string;
}

/**
 * Information about a promo offer for a user
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptypromo}
 */
export interface AdaptyPromo {
  /** Type of the promo */
  promoType: string;
  /** An identifier of a variation, used to attribute purchases to this promo */
  variationId: string;
  /**
   * ISO 8601 datetime formatted string, when this promo offer expires
   * @see {@link https://en.wikipedia.org/wiki/ISO_8601}
   */
  expiresAt: string;
  /**
   * An object containing related purchase paywall
   * @see AdaptyPaywall
   */
  paywall: AdaptyPaywall;
}

/**
 * An information about a paywall including products.
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptypaywall}
 */
export interface AdaptyPaywall {
  /** Revision of the paywall */
  revision: number;
  /** HTML representation of the paywall */
  visualPaywall?: string;
  /**
   * An array of products related to this paywall
   * @see {@link AdaptyProduct}
   */
  products: AdaptyProduct[];
  /** An identifier of a paywall configured in Adapty Dashboard */
  developerId: string;
  /**
   * True if this paywall is a part of a promo campaign
   * @see AdaptyPromo
   */
  isPromo: boolean;
  /** A custom JSON string configured in Adapty Dashboard for this paywall */
  customPayloadString?: string;
  /** Unique identifier of the paywall */
  variationId: string;
  /** Paywall name */
  name?: string;
  /** Parent A/B test name */
  abTestName?: string;
}

export interface MakePurchaseResult {
  receipt: string;
  product?: AdaptyProduct;
  purchaserInfo?: AdaptyPurchaserInfo;
}

export interface RestorePurchasesResult {
  receipt?: string;
  googleValidationResults?: string[];
  purchaserInfo?: AdaptyPurchaserInfo;
}

export interface MakePurchaseParams {
  ios?: {
    offerId?: string;
  };

  android?: {
    /**
     * @see {@link https://developer.android.com/reference/com/android/billingclient/api/BillingFlowParams}
     */
    subscriptionUpdateParam?: {
      oldSubVendorProductId: string;

      prorationMode: AndroidProrationMode;
    };
  };
}
