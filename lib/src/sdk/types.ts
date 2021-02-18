import { AdaptyModule } from '../utils';

/**
 * @private shouldn't be used by user
 */
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

export type AdaptyVendorStore = 'app_store' | 'play_store' | 'adapty';
export type AdaptyIntroductoryOfferType =
  | 'free_trial'
  | 'pay_as_you_go'
  | 'pay_up_front';
export type AdaptyPromotionalOfferType =
  | 'free_trial'
  | 'pay_as_you_go'
  | 'pay_up_front';

/**
 * Contains information about the product
 */
export interface AdaptyProduct {
  /**
   * The period details for products that are subscriptions
   * @see AdaptyProductSubscriptionPeriod
   */
  subscriptionPeriod: AdaptyProductSubscriptionPeriod;
  /**
   * Localized subscription period of the product
   * @todo NO VALUE ANDROID
   */
  localizedSubscriptionPeriod: string;
  /**
   * An object containing introductory price information for the product
   * @see AdaptyIntroductoryDiscount
   */
  introductoryDiscount: AdaptyProductDiscount;
  /**
   * Product locale currency symbol @example "RU"
   * @todo NO VALUE ANDROID
   */
  regionCode: string;
  /** Eligibility of user for introductory offer */
  introductoryOfferEligibility: boolean;
  /**
   * Array of discount offers available for the product
   * @see AdaptyProductDiscount
   * @todo NO VALUE ANDROID
   */
  discounts: AdaptyProductDiscount[];
  /** Eligibility of a user for promotional offer */
  promotionalOfferEligibility: boolean;
  /** The cost of the product in the local currency */
  price: number;
  /**
   * The identifier of the subscription group
   * to which the subscription belongs
   * @todo NO VALUE ANDROID
   */
  subscriptionGroupIdentifier: string;
  /** @example "$" */
  currencySymbol: string;
  /** Unique identifier of a product */
  vendorProductId: string;
  /** A description of the product */
  localizedDescription: string;
  /** Name of the product */
  localizedTitle: string;
  /** Localized price of the product */
  localizedPrice: string;
  /** Paywall unique ID */
  variationId?: string;
  /** Product locale currency code @example "RUB" */
  currencyCode: string;
  /**
   * ID of the offer, provided by Adapty
   * for this specific user
   * @todo NO VALUE ANDROID
   */
  promotionalOfferId?: string;
}

export interface AdaptyProductDiscount {
  /**
   * An object that defines the period for the product discount
   */
  subscriptionPeriod: AdaptyProductSubscriptionPeriod;
  /** The discount price of the product in the local currency */
  price: number;
  /**
   * Localized number of periods of the discount
   * @todo NO VALUE ANDROID
   */
  localizedNumberOfPeriods: number;
  /**
   * Localized subscription period of the discount
   * @todo NO VALUE ANDROID
   */
  localizedSubscriptionPeriod: string;
  /**
   * A string used to uniquely identify a discount offer for a product
   * @todo NO VALUE ANDROID
   */
  identifier: string;
  /**
   * The payment mode for this product discount
   * @todo NO VALUE ANDROID
   */
  paymentMode: number;
  /** Localized price of the discount */
  localizedPrice: string;
  /**
   * An integer that indicates the number of periods the product
   * discount is available
   */
  numberOfPeriods: number;
}

export interface AdaptyProductSubscriptionPeriod {
  /**
   * The increment of time that a subscription period is
   * specified in
   */
  unit: number;
  /**
   * The number of units per subscription period
   */
  numberOfUnits: number;
}

export interface AdaptyPurchaserInfo {
  /**
   * Object where the keys are paid access level identifiers
   * configured by developer in Adapty dashboard.
   * Not passed if the customer has no access levels.
   * @see AdaptyPaidAccessLevelsInfo
   *
   */
  accessLevels?: { [accessLevelId: string]: AdaptyPaidAccessLevelsInfo };
  /**
   * Object where the keys are vendor product ids
   * Not passed if the customer has no subscriptions.
   */
  subscriptions?: { [vendorProductId: string]: AdaptySubscriptionsInfo };
  /**
   * Object where the keys are vendor product ids.
   *  Values are array[] of NonSubscriptionsInfoModel objects.
   * Not passed if the customer has no purchases.
   * @interface AdaptyNonSubscriptionsInfo
   */
  nonSubscriptions?: {
    [vendorProductId: string]: AdaptyNonSubscriptionsInfo[];
  };
}

/**
 * Stores info about current users access level
 */
export interface AdaptyPaidAccessLevelsInfo {
  /**
   * Paid Access Level identifier configured
   * by developer in Adapty dashboard
   */
  id: string;
  /**
   * True if the paid access level is active
   */
  isActive: boolean;
  /**
   * Identifier of the product in vendor system
   * that unlocked this access level
   */
  vendorProductId: string;
  /**
   * The store that unlocked this subscription
   * @interface AdaptyVendorStore
   */
  store: AdaptyVendorStore;
  /**
   * DateTime when access level was activated
   * (may be in the future)
   * @todo Date?
   */
  activatedAt: string;
  /**
   * DateTime when access level was renewed
   * @todo Date?
   */
  renewedAt: string;
  /**
   * DateTime when access level will expire
   * (may be in the past and may be null for lifetime access)
   * @todo Date?
   */
  expiresAt: string;
  /**
   * True if  the paid access level is active for lifetime (no expiration date)
   * If set to true you shouldn't use **expires_at**
   */
  isLifetime: boolean;
  /**
   * The type of active introductory offer.
   * If the value is not null it means that offer was applied
   * during the current subscription period
   * @see AdaptyIntroductoryOfferType
   */
  activeIntroductoryOfferType: AdaptyIntroductoryOfferType;
  /**
   * The type of active promotional offer.
   * If the value is not null it means that offer was applied
   * during the current subscription period.
   * @see AdaptyPromotionalOfferType
   */
  activePromotionalOfferType: AdaptyPromotionalOfferType;
  /**
   * True if auto renewable subscription is set to renew
   */
  willRenew: boolean;
  /**
   * True if auto renewable subscription is in grace period
   */
  isInGracePeriod: boolean;
  /**
   * DateTime when auto renewable subscription was cancelled.
   * Subscription can still be active, it just means that auto renewal turned off.
   * Will set to null if the user reactivates subscription
   * @todo Date?
   */
  unsubscribedAt: string;
  /**
   * DateTime when billing issue was detected
   * (vendor was not able to charge the card)
   * Subscription can still be active.
   * Will set to null if the charge was successful.
   * @todo Date?
   */
  billingIssueDetectedAt?: string;
}

/**
 * Stores info about vendor subscription
 */
export interface AdaptySubscriptionsInfo {
  /**
   * True if this subscription is active
   */
  isActive: boolean;
  /**
   * Identifier of the product in vendor system
   */
  vendorProductId: string;
  /**
   * Store where the product was purchased
   */
  store: AdaptyVendorStore;
  /**
   * datetime when access level was activated
   * (may be in the future)
   */
  activatedAt: string;
  /**
   * DateTime when access level was renewed
   * @todo Date?
   */
  renewedAt: string;
  /**
   * DateTime when access level will expire
   * (may be in the past and may be null for lifetime access)
   * @todo Date?
   */
  expiresAt: string | null;
  /**
   * DateTime when access level stared
   * @todo Date?
   */
  startsAt: string;
  /**
   * True if the subscription is active for lifetime (no expiration date)
   * If set to true you shouldn't use **expiresAt**
   */
  isLifetime: boolean;
  /**
   * The type of active introductory offer
   * If the value is not null it means that
   * offer was applied during the current subscription period
   * @see AdaptyIntroductoryOfferType
   */
  activeIntroductoryOfferType: AdaptyIntroductoryOfferType | null;
  /**
   * The type of active promotional offer
   * @see AdaptyPromotionalOfferType
   */
  activePromotionalOfferType: AdaptyPromotionalOfferType | null;
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
  /**
   * Transaction ID in vendor system
   */
  vendorTransactionId: string;
  /**
   * Original transaction id in vendor system.
   * For auto renewable subscription this will be the ID
   * of the first transaction in the subscription.
   */
  vendorOriginalTransactionId: string;
}

/**
 * Stores info about purchases, that are not subscriptions
 */
export interface AdaptyNonSubscriptionsInfo {
  /**
   * Identifier of the purchase in Adapty. You can use it
   * to ensure that you've already processed this purchase
   */
  purchaseId: string;
  /**
   * Identifier of the product in vendor system
   */
  vendorProductId: string;
  /**
   * Store where the product was purchased
   * @see AdaptyVendorStore
   */
  store: AdaptyVendorStore;
  /**
   * DateTime when product was purchased
   * @todo Date?
   */
  purchasedAt: string;
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
 * Contains information about available
 * promotional (if so) offer for current user
 */
export interface AdaptyPromo {
  /**
   * Type of the current promo
   * @todo string?
   */
  promoType: string;
  /** Unique identifier of the promo */
  variationId: string;
  /**
   * DateTime of when current promo offer will expire
   * @todo Date?
   */
  expiresAt: string;
  /**
   * An object containing related purchase paywall
   * @see AdaptyPaywall
   */
  paywall: AdaptyPaywall;
}

/**
 * Cntains info about paywall
 */
export interface AdaptyPaywall {
  /** Revision of the paywall */
  revision: number;
  /**
   * HTML representation of the paywall
   * @todo NO VALUE ANDROID
   */
  visualPaywall?: string;
  /**
   * An array of products relatedd to this paywall
   * @see AdaptyProduct
   */
  products: AdaptyProduct[];
  /** Name of the paywall in dashboard*/
  developerId: string;
  /**
   * true if this pawall is related to some promo
   * @see AdaptyPromo
   */
  isPromo: boolean;
  /** String / JSON */
  customPayloadString?: string;
  /** Unique identifier of the paywall */
  variationId: string;
  name?: string;
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
