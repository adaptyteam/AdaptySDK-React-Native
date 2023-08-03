// import SDK type to link to methods in docs.
import { Adapty } from '../sdk/adapty';

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
  NotDetermined: 'not_determined',
  Restricted: 'restricted',
  Denied: 'denied',
  Authorized: 'authorized',
  Unknown: 'unknown',
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

export const OfferEligibility = Object.freeze({
  Eligible: 'eligible',
  Ineligible: 'ineligible',
  Unknown: 'unknown',
});
export type OfferEligibility =
  (typeof OfferEligibility)[keyof typeof OfferEligibility];

/**
 * Describes an object that represents a paywall.
 * Used in {@link Adapty.getPaywall} method.
 * @public
 */
export interface AdaptyPaywall {
  /**
   * Parent A/B test name.
   * @readonly
   */
  readonly abTestName: string;
  /**
   * ID of a paywall configured in Adapty Dashboard.
   * @readonly
   */
  readonly id: string;
  /**
   * Identifier of a paywall locale.
   * @readonly
   */
  readonly locale: string;
  /**
   * A paywall name.
   * @readonly
   */
  readonly name?: string;
  /**
   * A custom dictionary configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly remoteConfig?: Record<string, any>;
  /**
   * A custom JSON string configured in Adapty Dashboard for this paywall.
   * @readonly
   */
  readonly remoteConfigString?: string;
  /**
   * Current revision (version) of a paywall.
   * Every change within a paywall creates a new revision.
   * @readonly
   */
  readonly revision: number;
  /**
   * An identifier of a variation,
   * used to attribute purchases to this paywall.
   * @readonly
   */
  readonly variationId: string;
  /**
   * Array of related products ids.
   * @readonly
   */
  readonly vendorProductIds?: string[];
}

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
  readonly accessLevels: Record<string, AdaptyAccessLevel>;

  /**
   * Object representing custom attributes set for the user using
   * the {@link Adapty.updateProfile} method.
   * @readonly
   */
  readonly customAttributes: Record<string, any>;

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
  readonly nonSubscriptions: Record<string, AdaptyNonSubscription[]>;

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
  readonly subscriptions: Record<string, AdaptySubscription>;
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
export interface AdaptyProduct {
  /**
   * The currency code of the locale
   * used to format the price of the product.
   * The ISO 4217 (USD, EUR).
   * @readonly
   */
  readonly currencyCode?: string;
  /**
   * The currency symbol of the locale
   * used to format the price of the product.
   * ($, €).
   * @readonly
   */
  readonly currencySymbol?: string;
  /**
   * An object containing introductory price information for a product.
   * iOS: Will be null for iOS version below 11.2
   * and macOS version below 10.14.4.
   */
  readonly introductoryDiscount?: AdaptyProductDiscount;
  /**
   * User's eligibility for your introductory offer.
   * Check this property before displaying info about
   * introductory offers (i.e. free trials)
   * @readonly
   */
  readonly introductoryOfferEligibility: OfferEligibility;
  /**
   * A description of the product.
   * @readonly
   */
  readonly localizedDescription: string;
  /**
   * A price’s language is determined
   * by the preferred language set on the device.
   * On Android, the formatted price from Google Play as is.
   * @readonly
   */
  readonly localizedPrice?: string;
  /**
   * The period’s language is determined
   * by the preferred language set on the device.
   * @readonly
   */
  readonly localizedSubscriptionPeriod?: string;
  /**
   * The name of the product.
   * @readonly
   */
  readonly localizedTitle: string;
  /**
   * Same as `abTestName` property of the parent {@link AdaptyPaywall}.
   * @readonly
   */
  readonly paywallABTestName: string;
  /**
   * Same as `name` property of the parent {@link AdaptyPaywall}.
   * @readonly
   */
  readonly paywallName: string;
  /**
   * The cost of the product in the local currency
   * @readonly
   */
  readonly price: number;
  /**
   * The period details for products that are subscriptions.
   * Will be `null` for iOS version below 11.2 and macOS version below 10.14.4.
   * @readonly
   */
  readonly subscriptionPeriod?: AdaptySubscriptionPeriod;
  /**
   * Same as `variationId` property of the parent {@link AdaptyPaywall}.
   * @readonly
   */
  readonly variationId: string;
  /**
   * Unique identifier of a product
   * from App Store Connect or Google Play Console
   * @readonly
   */
  readonly vendorProductId: string;

  android?: {
    /**
     * An object containing free trial information for the given product.
     * @see {@link https://developer.android.com/google/play/billing/subscriptions#free-trial}
     * @readonly
     */
    readonly freeTrialPeriod?: AdaptySubscriptionPeriod;
    /**
     * The period’s language is determined
     * by the preferred language set on the device.
     * @readonly
     */
    readonly localizedFreeTrialPeriod?: string;
  };
  ios?: {
    /**
     * An array of subscription offers available for the auto-renewable subscription.
     * Will be empty for iOS version below 12.2
     * and macOS version below 10.14.4.
     * @readonly
     */
    readonly discounts: AdaptyProductDiscount[];
    /**
     * Boolean value that indicates
     * whether the product is available for family sharing
     * in App Store Connect.
     * Will be `false` for iOS version below 14.0 and macOS version below 11.0.
     * @see {@link https://developer.apple.com/documentation/storekit/skproduct/3564805-isfamilyshareable}
     * @readonly
     */
    readonly isFamilyShareable: boolean;
    /**
     * User's eligibility for the promotional offers.
     * Check this property before displaying info
     * about promotional offers
     * @readonly
     */
    readonly promotionalOfferEligibility: OfferEligibility;
    /**
     * An identifier of a promotional offer,
     * provided by Adapty for this specific user.
     * @readonly
     */
    readonly promotionalOfferId?: string;
    /**
     * The region code of the locale used to format the price of the product.
     * ISO 3166 ALPHA-2 (US, DE)
     * @readonly
     */
    readonly regionCode?: string;
    /**
     * An identifier of the subscription group
     * to which the subscription belongs.
     * Will be `null` for iOS version below 12.0 and macOS version below 10.14.
     * @readonly
     */
    readonly subscriptionGroupIdentifier?: string;
  };
}

/**
 * Discount model to products
 * @see {@link https://doc.adapty.io/docs/rn-api-reference#adaptyproductdiscount}
 */
export interface AdaptyProductDiscount {
  /**
   * A formatted number of periods of a discount for a user’s locale.
   * @readonly
   */
  readonly localizedNumberOfPeriods?: string;
  /**
   * A formatted price of a discount for a user’s locale.
   * @readonly
   */
  readonly localizedPrice?: string;
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
  readonly price: number;
  /**
   * An information about period for a product discount.
   * @readonly
   */
  readonly subscriptionPeriod: AdaptySubscriptionPeriod;

  ios?: {
    /**
     * Unique identifier of a discount offer for a product.
     * @see {@link https://developer.apple.com/documentation/storekit/skpaymentdiscount/3043528-identifier}
     * @readonly
     */
    readonly identifier?: string;
    /**
     * A payment mode for this product discount.
     * @readonly
     */
    readonly paymentMode: OfferType;
  };
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
  storeCountry?: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  birthday?: string;
  email?: string;
  phoneNumber?: string;
  facebookAnonymousId?: string;
  amplitudeUserId?: string;
  amplitudeDeviceId?: string;
  mixpanelUserId?: string;
  appmetricaProfileId?: string;
  appmetricaDeviceId?: string;
  oneSignalPlayerId?: string;
  pushwooshHWID?: string;
  firebaseAppInstanceId?: string;
  airbridgeDeviceId?: string;
}
