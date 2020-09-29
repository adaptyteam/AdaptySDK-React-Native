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
   * Unique identifier of a product
   */
  vendorProductId: string;
  /**
   * Eligibility of user for introductory offer
   * @todo @type
   */
  introductoryOfferEligibility: any;
  /**
   * Eligibility of user for promotional offer
   *  @todo @type
   */
  promotionalOfferEligibility: any;
  /**
   * ID of the offer, provided by Adapty
   * for this specific user
   */
  promotionalOfferId: string;
  /**
   * A description of the product
   */
  localizedDescription: string;
  /**
   * The name of the product
   */
  localizedTitle: string;
  /**
   * The cost of the product in the local currency
   * @todo @type
   */
  price: any;
  /**
   *
   * Product locale currency code
   * @todo @type
   */
  currencyCode: string;
  /**
   * Product locale currency symbol
   * @todo @type
   */
  regionCode: string;
  /**
   * The period details for products that are subscriptions
   * @see AdaptyProductSubscriptionPeriod
   */
  subscriptionPeriod: AdaptyProductSubscriptionPeriod;
  /**
   * An object containing introductory price information for the product
   * @see AdaptyIntroductoryDiscount
   */
  introductoryDiscount: AdaptyProductDiscount;
  /**
   * Array of discount offers available for the product
   * @see AdaptyProductDiscount
   */
  discounts: AdaptyProductDiscount[];
  /**
   * The identifier of the subscription group
   * to which the subscription belongs
   */
  subscriptionGroupIdentifier: string;
  /**
   * Localized price of the product
   */
  localizedPrice: string;
  /**
   * Localized subscription period of the product
   */
  localizedSubscriptionPeriod: string;
}

export interface AdaptyProductDiscount {
  /**
   * The discount price of the product in the local currency
   */
  price: string;
  /**
   * A string used to uniquely identify a discount offer for a product
   */
  identifier: string;
  /**
   * An object that defines the period for the product discount
   */
  subscriptionPeriod: AdaptyProductSubscriptionPeriod;
  /**
   * An integer that indicates the number of periods the product
   * discount is available
   */
  numberOfPeriods: number;
  /**
   * The payment mode for this product discount
   * @todo @type
   */
  paymentMode: any;
  /**
   * Localized price of the discount
   */
  localizedPrice: string;
  /**
   * Localized subscription period of the discount
   */
  localizedSubscriptionPeriod: string;
  /**
   * Localized number of periods of the discount
   */
  localizedNumberOfPeriods: number;
}

export interface AdaptyProductSubscriptionPeriod {
  /**
   * The increment of time that a subscription period is
   * specified in
   */
  until: string;
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
  paidAccessLevels?: { [accessLevelId: string]: AdaptyPaidAccessLevelsInfo };
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
  /**
   * Unique identifier of the promo
   */
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
  /**
   * Name of the paywall in dashboard
   */
  developerId: string;
  /**
   * Unique identifier of the paywall
   */
  variationId: string;
  /**
   * Revision of the paywall
   */
  revision: any;
  /**
   * true if this pawall is related to some promo
   * @see AdaptyPromo
   */
  isPromo: boolean;
  /**
   * An array of products relatedd to this paywall
   * @see AdaptyProduct
   */
  products: AdaptyProduct[];
  /**
   * HTML representation of the paywall
   */
  visualPaywall: string;
}
