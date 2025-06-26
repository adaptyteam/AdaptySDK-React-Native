// import SDK type to link to methods in docs.
import type { Adapty } from '@/adapty-handler';

export const VendorStore = Object.freeze({
  AppStore: 'app_store',
  PlayStore: 'play_store',
  Adapty: 'adapty',
});
export type VendorStore = (typeof VendorStore)[keyof typeof VendorStore];

export const OfferType = Object.freeze({
  FreeTrial: 'free_trial',
  PayAsYouGo: 'pay_as_you_go',
  PayUpFront: 'pay_up_front',
});
export type OfferType = (typeof OfferType)[keyof typeof OfferType];

export const CancellationReason = Object.freeze({
  VolountarilyCancelled: 'voluntarily_cancelled',
  BillingError: 'billing_error',
  Refund: 'refund',
  PriceIncrease: 'price_increase',
  ProductWasNotAvailable: 'product_was_not_available',
  Unknown: 'unknown',
});
export type CancellationReason =
  (typeof CancellationReason)[keyof typeof CancellationReason];

export const Gender = Object.freeze({
  Female: 'f',
  Male: 'm',
  Other: 'o',
});
export type Gender = (typeof Gender)[keyof typeof Gender];

export const AppTrackingTransparencyStatus = Object.freeze({
  NotDetermined: 0,
  Restricted: 1,
  Denied: 2,
  Authorized: 3,
  Unknown: 4,
});
export type AppTrackingTransparencyStatus =
  (typeof AppTrackingTransparencyStatus)[keyof typeof AppTrackingTransparencyStatus];

export const ProductPeriod = Object.freeze({
  Day: 'day',
  Week: 'week',
  Month: 'month',
  Year: 'year',
});
export type ProductPeriod = (typeof ProductPeriod)[keyof typeof ProductPeriod];

export interface AdaptyPrice {
  /**
   * Price as number
   */
  amount: number;
  /**
   * The currency code of the locale
   * used to format the price of the product.
   * The ISO 4217 (USD, EUR).
   */
  currencyCode?: string;
  /**
   * The currency symbol of the locale
   * used to format the price of the product.
   * ($, €).
   */
  currencySymbol?: string;
  /**
   * A price’s language is determined
   * by the preferred language set on the device.
   * On Android, the formatted price from Google Play as is.
   */
  localizedString?: string;
}

/**
 * Describes an object that represents a paywall.
 * Used in {@link Adapty.getPaywall} method.
 * @public
 */
export interface AdaptyPaywall {
  readonly placement: AdaptyPlacement;

  /**
   * If `true`, it is possible to fetch the view object
   * and use it with AdaptyUI library.
   * @readonly
   */
  readonly hasViewConfiguration: boolean;

  /**
   * A paywall name.
   * @readonly
   */
  readonly name: string;
  /**
   * A remote config configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly remoteConfig?: AdaptyRemoteConfig;
  /**
   * An identifier of a variation,
   * used to attribute purchases to this paywall.
   * @readonly
   */
  readonly variationId: string;
  /**
   * Array of initial products info
   * @readonly
   */
  readonly products: ProductReference[];

  id: string;
  version?: number;
  webPurchaseUrl?: string;
  payloadData?: string;
  paywallBuilder?: AdaptyPaywallBuilder;
}

export interface AdaptyOnboarding {
  readonly placement: AdaptyPlacement;
  /**
   * If `true`, it is possible to fetch the view object
   * and use it with AdaptyUI library.
   * @readonly
   */
  readonly hasViewConfiguration: boolean;

  /**
   * A paywall name.
   * @readonly
   */
  readonly name: string;
  /**
   * A remote config configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly remoteConfig?: AdaptyRemoteConfig;
  /**
   * An identifier of a variation,
   * used to attribute purchases to this paywall.
   * @readonly
   */
  readonly variationId: string;

  id: string;
  version?: number;
  payloadData?: string;
  onboardingBuilder?: AdaptyOnboardingBuilder;
}

export interface AdaptyPlacement {
  /**
   * Parent A/B test name.
   * @readonly
   */
  readonly abTestName: string;

  /**
   * A name of an audience to which the paywall belongs.
   * @readonly
   */
  readonly audienceName: string;
  /**
   * ID of a placement configured in Adapty Dashboard.
   * @readonly
   */
  readonly id: string;
  /**
   * Current revision (version) of a paywall.
   * Every change within a paywall creates a new revision.
   * @readonly
   */
  readonly revision: number;

  isTrackingPurchases?: boolean;
  audienceVersionId: string;
}

/**
 * Describes an object that represents a remote config of a paywall.
 * @public
 */
export interface AdaptyRemoteConfig {
  /**
   * Identifier of a paywall locale.
   * @readonly
   */
  readonly lang: string;
  /**
   * A custom dictionary configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly data: Record<string, any>;
  /**
   * A custom JSON string configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly dataString: string;
}

export interface AdaptyPaywallBuilder {
  readonly id: string;
  readonly lang: string;
}

export interface AdaptyOnboardingBuilder {
  readonly url: string;
  readonly lang: string;
}

export type AdaptyPurchaseResult =
  | {
      type: 'pending' | 'user_cancelled';
    }
  | {
      type: 'success';
      profile: AdaptyProfile;
    };

/**
 * Interface representing a user profile in Adapty,
 * including details about the user's subscriptions and consumable products.
 * @public
 */
export interface AdaptyProfile {
  /**
   * Object that maps access level identifiers (configured by you in Adapty Dashboard)
   * to the corresponding access level details. The value can be `null`
   * if the user does not have any access levels.
   * @readonly
   */
  readonly accessLevels?: Record<string, AdaptyAccessLevel>;

  /**
   * Object representing custom attributes set for the user using
   * the {@link Adapty.updateProfile} method.
   * @readonly
   */
  readonly customAttributes?: Record<string, any>;

  /**
   * The identifier for a user in your system.
   * @readonly
   */
  readonly customerUserId?: string;

  /**
   * Object that maps product ids from the store to an array of
   * information about the user's non-subscription purchases.
   * The value can be `null` if the user does not have any purchases.
   * @readonly
   */
  readonly nonSubscriptions?: Record<string, AdaptyNonSubscription[]>;

  /**
   * The identifier for a user in Adapty.
   */
  readonly profileId: string;

  /**
   * Object that maps product ids from a store to
   * information about the user's subscriptions.
   * The value can be `null` if the user does not have any subscriptions.
   * @readonly
   */
  readonly subscriptions?: Record<string, AdaptySubscription>;
}

/**
 * Interface representing access level details of a user.
 * @public
 */
export interface AdaptyAccessLevel {
  /**
   * The date and time when the access level was activated.
   * @readonly
   */
  readonly activatedAt: Date;

  /**
   * Type of active introductory offer, if any.
   * @readonly
   */
  readonly activeIntroductoryOfferType?: OfferType;

  /**
   * Identifier of the active promotional offer, if any.
   * @readonly
   */
  readonly activePromotionalOfferId?: string;

  /**
   * Type of the active promotional offer, if any.
   * @readonly
   */
  readonly activePromotionalOfferType?: OfferType;

  /**
   * The date and time when a billing issue was detected.
   * @readonly
   */
  readonly billingIssueDetectedAt?: Date;

  /**
   * The reason for the cancellation of the subscription.
   * @readonly
   */
  readonly cancellationReason?: CancellationReason;

  /**
   * The expiration date of the access level, if applicable.
   * @readonly
   */
  readonly expiresAt?: Date;

  /**
   * Unique identifier of the access level
   * configured by you in Adapty Dashboard.
   * @readonly
   */
  readonly id: string;

  /**
   * Flag indicating whether the access level is currently active.
   * @readonly
   */
  readonly isActive: boolean;

  /**
   * Flag indicating whether this auto-renewable subscription is in the grace period.
   * @readonly
   */
  readonly isInGracePeriod: boolean;

  /**
   * Flag indicating whether this access level is active for a lifetime.
   * @readonly
   */
  readonly isLifetime: boolean;

  /**
   * Flag indicating whether this purchase was refunded.
   * @readonly
   */
  readonly isRefund: boolean;

  /**
   * The date and time when the access level was renewed.
   * @readonly
   */
  readonly renewedAt?: Date;

  /**
   * The start date of this access level.
   * @readonly
   */
  readonly startsAt?: Date;

  /**
   * The store where the purchase that unlocked this access level was made.
   * @readonly
   */
  readonly store: VendorStore;

  /**
   * The date and time when the auto-renewable subscription was cancelled.
   * @readonly
   */
  readonly unsubscribedAt?: Date;

  /**
   * The identifier of the product in the store that unlocked this access level.
   * @readonly
   */
  readonly vendorProductId: string;

  /**
   * Flag indicating whether this auto-renewable subscription is set to renew.
   * @readonly
   */
  readonly willRenew: boolean;

  android?: {
    offerId?: string;
  };
}

/**
 * Interface representing a consumable or non-subscription purchase made by the user.
 * @public
 */
export interface AdaptyNonSubscription {
  /**
   * Flag indicating whether the product is consumable.
   * @readonly
   */
  readonly isConsumable: boolean;

  /**
   * Flag indicating whether the purchase was refunded.
   * @readonly
   */
  readonly isRefund: boolean;

  /**
   * Flag indicating whether the product was purchased in a sandbox environment.
   * @readonly
   */
  readonly isSandbox: boolean;

  /**
   * The date and time when the purchase was made.
   * @readonly
   */
  readonly purchasedAt: Date;

  /**
   * The identifier of the product in the store that was purchased.
   * @readonly
   */
  readonly vendorProductId: string;
  /**
   * The identifier of the product in the store that was purchased.
   * @readonly
   */
  readonly vendorTransactionId?: string;

  /**
   * The store where the purchase was made.
   * @readonly
   */
  readonly store: VendorStore;

  /**
   * An identifier of the purchase in Adapty.
   * You can use it to ensure that you've already processed this purchase
   * (for example tracking one time products).
   * @readonly
   */
  readonly purchaseId: string;
}

/**
 * Interface representing details about a user's subscription.
 * @public
 */
export interface AdaptySubscription {
  /**
   * The date and time when the subscription was activated.
   * @readonly
   */
  readonly activatedAt: Date;

  /**
   * Type of active introductory offer, if any.
   * @readonly
   */
  readonly activeIntroductoryOfferType?: OfferType;

  /**
   * Identifier of the active promotional offer, if any.
   * @readonly
   */
  readonly activePromotionalOfferId?: string;

  /**
   * Type of the active promotional offer, if any.
   * @readonly
   */
  readonly activePromotionalOfferType?: OfferType;

  /**
   * The date and time when a billing issue was detected.
   * @readonly
   */
  readonly billingIssueDetectedAt?: Date;

  /**
   * The reason for the cancellation of the subscription.
   * @readonly
   */
  readonly cancellationReason?: CancellationReason;

  /**
   * The expiration date of the subscription, if applicable.
   * @readonly
   */
  readonly expiresAt?: Date;

  /**
   * Flag indicating whether the subscription is currently active.
   * @readonly
   */
  readonly isActive: boolean;

  /**
   * Flag indicating whether the subscription is in the grace period.
   * @readonly
   */
  readonly isInGracePeriod: boolean;

  /**
   * Flag indicating whether the subscription is set for a lifetime.
   * @readonly
   */
  readonly isLifetime: boolean;

  /**
   * Flag indicating whether the subscription was refunded.
   * @readonly
   */
  readonly isRefund: boolean;

  /**
   * Flag indicating whether the subscription was purchased in a sandbox environment.
   * @readonly
   */
  readonly isSandbox: boolean;

  /**
   * The date and time when the subscription was renewed.
   * @readonly
   */
  readonly renewedAt?: Date;

  /**
   * The date and time when the subscription starts.
   * @readonly
   */
  readonly startsAt?: Date;

  /**
   * The store where the subscription was made.
   * @readonly
   */
  readonly store: VendorStore;

  /**
   * The date and time when the subscription was cancelled.
   * @readonly
   */
  readonly unsubscribedAt?: Date;

  /**
   * The identifier of the product in the store that was subscribed to.
   * @readonly
   */
  readonly vendorProductId: string;

  /**
   * The identifier of the product in the store that was subscribed to.
   * @readonly
   */
  readonly vendorTransactionId: string;
  /**
   * An original transaction id of the purchase in a store that unlocked this subscription.
   * For auto-renewable subscription, this will be an id of the first transaction in this subscription.
   * @readonly
   */
  readonly vendorOriginalTransactionId: string;
  /**
   * Flag indicating whether the subscription is set to auto-renew.
   * @readonly
   */
  readonly willRenew: boolean;
}

/**
 * Describes an object that represents a product.
 * Used in {@link Adapty.getPaywallProducts} method and in {@link Adapty.makePurchase} method.
 * @public
 */
export interface AdaptyPaywallProduct {
  /**
   * A description of the product.
   */
  readonly localizedDescription: string;
  /**
   * The region code of the locale used to format the price of the product.
   * ISO 3166 ALPHA-2 (US, DE)
   */
  readonly regionCode?: string;
  /**
   * The name of the product.
   */
  readonly localizedTitle: string;
  /**
   * Same as `abTestName` property of the parent {@link AdaptyPaywall}.
   */
  readonly paywallABTestName: string;
  /**
   * Same as `name` property of the parent {@link AdaptyPaywall}.
   */
  readonly paywallName: string;
  /**
   * The cost of the product in the local currency
   */
  readonly price?: AdaptyPrice;
  readonly adaptyId: string;
  /**
   * Same as `variationId` property of the parent {@link AdaptyPaywall}.
   */
  readonly variationId: string;
  /**
   * Unique identifier of a product
   * from App Store Connect or Google Play Console
   */
  readonly vendorProductId: string;
  paywallProductIndex: number;
  webPurchaseUrl?: string;
  payloadData?: string;
  subscription?: AdaptySubscriptionDetails;
  ios?: {
    /**
     * Boolean value that indicates
     * whether the product is available for family sharing
     * in App Store Connect.
     * Will be `false` for iOS version below 14.0 and macOS version below 11.0.
     * @see {@link https://developer.apple.com/documentation/storekit/skproduct/3564805-isfamilyshareable}
     */
    readonly isFamilyShareable: boolean;
  };
}

export interface AdaptySubscriptionDetails {
  /**
   * The period details for products that are subscriptions.
   * Will be `null` for iOS version below 11.2 and macOS version below 10.14.4.
   */
  subscriptionPeriod: AdaptySubscriptionPeriod;
  /**
   * The period’s language is determined
   * by the preferred language set on the device.
   */
  localizedSubscriptionPeriod?: string;
  /**
   * A subscription offer if available for the auto-renewable subscription.
   */
  offer?: AdaptySubscriptionOffer;

  ios?: {
    /**
     * An identifier of the subscription group
     * to which the subscription belongs.
     * Will be `null` for iOS version below 12.0 and macOS version below 10.14.
     */
    subscriptionGroupIdentifier?: string;
  };

  android?: {
    basePlanId: string;
    renewalType?: 'prepaid' | 'autorenewable';
  };
}

/**
 * Subscription offer model to products
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptysubscriptionoffer}
 */
export interface AdaptySubscriptionOffer {
  readonly identifier: AdaptySubscriptionOfferId;

  phases: AdaptyDiscountPhase[];

  android?: {
    offerTags?: string[];
  };
}

export type AdaptySubscriptionOfferId =
  | { id?: string; type: 'introductory' }
  | { id: string; type: 'promotional' | 'win_back' };

/**
 * Discount model to products
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptyproductdiscount}
 */
export interface AdaptyDiscountPhase {
  /**
   * A formatted number of periods of a discount for a user’s locale.
   * @readonly
   */
  readonly localizedNumberOfPeriods?: string;
  /**
   * A formatted subscription period of a discount for a user’s locale.
   * @readonly
   */
  readonly localizedSubscriptionPeriod?: string;
  /**
   * A number of periods this product discount is available.
   * @readonly
   */
  readonly numberOfPeriods: number;
  /**
   * Discount price of a product in a local currency.
   * @readonly
   */
  readonly price: AdaptyPrice;
  /**
   * An information about period for a product discount.
   * @readonly
   */
  readonly subscriptionPeriod: AdaptySubscriptionPeriod;

  /**
   * A payment mode for this product discount.
   * @readonly
   */
  readonly paymentMode: OfferType;
}

/**
 * An object containing information about a subscription period.
 * @public
 */
export interface AdaptySubscriptionPeriod {
  /**
   * A number of period units.
   * @readonly
   */
  readonly numberOfUnits: number;
  /**
   * A unit of time that a subscription period is specified in.
   * @readonly
   */
  readonly unit: ProductPeriod;
}

export interface AdaptyProfileParameters {
  analyticsDisabled?: boolean;
  codableCustomAttributes?: { [key: string]: any };
  appTrackingTransparencyStatus?: AppTrackingTransparencyStatus;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  birthday?: string;
  email?: string;
  phoneNumber?: string;
}

export interface ProductReference {
  vendorId: string;
  adaptyId: string;

  ios?: {
    promotionalOfferId?: string;
    winBackOfferId?: string;
  };

  android?: {
    basePlanId?: string;
    offerId?: string;
  };
}

export const RefundPreference = Object.freeze({
  NoPreference: 'no_preference',
  Grant: 'grant',
  Decline: 'decline',
});
export type RefundPreference =
  (typeof RefundPreference)[keyof typeof RefundPreference];
