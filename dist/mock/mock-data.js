"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockOnboarding = exports.createMockPurchaseResult = exports.createMockProducts = exports.createMockPaywall = exports.createMockPremiumAccessLevel = exports.createMockProfile = exports.createSubscriptionDates = exports.addMilliseconds = exports.MOCK_UNSUBSCRIBE_DELAY_MS = exports.MOCK_SUBSCRIPTION_DURATION_MS = exports.MOCK_CUSTOMER_USER_ID = exports.MOCK_PROFILE_ID = exports.MOCK_ACCESS_LEVEL_PREMIUM = exports.MOCK_ADAPTY_PRODUCT_ID_MONTHLY = exports.MOCK_ADAPTY_PRODUCT_ID_ANNUAL = exports.MOCK_VENDOR_PRODUCT_ID_MONTHLY = exports.MOCK_VENDOR_PRODUCT_ID_ANNUAL = void 0;
// Mock Product IDs
exports.MOCK_VENDOR_PRODUCT_ID_ANNUAL = 'mock.product.annual';
exports.MOCK_VENDOR_PRODUCT_ID_MONTHLY = 'mock.product.monthly';
exports.MOCK_ADAPTY_PRODUCT_ID_ANNUAL = 'mock.adapty.annual';
exports.MOCK_ADAPTY_PRODUCT_ID_MONTHLY = 'mock.adapty.monthly';
// Access Levels
exports.MOCK_ACCESS_LEVEL_PREMIUM = 'premium';
// Profile IDs
exports.MOCK_PROFILE_ID = 'mock.profile.id';
exports.MOCK_CUSTOMER_USER_ID = 'mock.customer.user.id';
// Time periods in milliseconds
/** Default subscription duration: 1 year */
exports.MOCK_SUBSCRIPTION_DURATION_MS = 365 * 24 * 60 * 60 * 1000;
/** Time until unsubscribe after activation: 1 day */
exports.MOCK_UNSUBSCRIBE_DELAY_MS = 24 * 60 * 60 * 1000;
/**
 * Helper functions for date calculations
 */
/**
 * Adds milliseconds to a date
 */
function addMilliseconds(date, ms) {
    return new Date(date.getTime() + ms);
}
exports.addMilliseconds = addMilliseconds;
/**
 * Creates subscription date set with default values
 * @returns Object containing now, expiresAt, and unsubscribedAt dates
 */
function createSubscriptionDates() {
    const now = new Date();
    return {
        now,
        expiresAt: addMilliseconds(now, exports.MOCK_SUBSCRIPTION_DURATION_MS),
        unsubscribedAt: addMilliseconds(now, exports.MOCK_UNSUBSCRIBE_DELAY_MS),
    };
}
exports.createSubscriptionDates = createSubscriptionDates;
/**
 * Creates a default mock profile without subscriptions
 */
function createMockProfile(overrides) {
    return Object.assign({ profileId: exports.MOCK_PROFILE_ID, customerUserId: exports.MOCK_CUSTOMER_USER_ID, accessLevels: {}, subscriptions: {}, nonSubscriptions: {}, customAttributes: {} }, overrides);
}
exports.createMockProfile = createMockProfile;
/**
 * Creates a premium access level for mock profile
 */
function createMockPremiumAccessLevel(accessLevelId = exports.MOCK_ACCESS_LEVEL_PREMIUM) {
    const { now, expiresAt, unsubscribedAt } = createSubscriptionDates();
    return {
        id: accessLevelId,
        isActive: true,
        vendorProductId: exports.MOCK_VENDOR_PRODUCT_ID_ANNUAL,
        store: 'adapty',
        activatedAt: now,
        renewedAt: now,
        expiresAt,
        unsubscribedAt,
        isLifetime: false,
        isInGracePeriod: false,
        isRefund: false,
        willRenew: false,
        startsAt: now,
        android: {},
    };
}
exports.createMockPremiumAccessLevel = createMockPremiumAccessLevel;
/**
 * Creates a default mock paywall
 */
function createMockPaywall(placementId, overrides) {
    return Object.assign({ id: `mock-paywall-${placementId}`, placement: {
            id: placementId,
            abTestName: placementId,
            audienceName: 'All Users',
            revision: 0,
            audienceVersionId: 'b7f6a19e-4384-4732-815d-5ad6610b695f',
            isTrackingPurchases: true,
        }, hasViewConfiguration: true, name: placementId, variationId: 'mock_variation_id', products: [
            {
                vendorId: exports.MOCK_VENDOR_PRODUCT_ID_ANNUAL,
                adaptyId: exports.MOCK_ADAPTY_PRODUCT_ID_ANNUAL,
                accessLevelId: exports.MOCK_ACCESS_LEVEL_PREMIUM,
                productType: 'annual',
                ios: {},
                android: {},
            },
            {
                vendorId: exports.MOCK_VENDOR_PRODUCT_ID_MONTHLY,
                adaptyId: exports.MOCK_ADAPTY_PRODUCT_ID_MONTHLY,
                accessLevelId: exports.MOCK_ACCESS_LEVEL_PREMIUM,
                productType: 'subscription',
                ios: {},
                android: {},
            },
        ], productIdentifiers: [
            {
                vendorProductId: exports.MOCK_VENDOR_PRODUCT_ID_ANNUAL,
                adaptyProductId: exports.MOCK_ADAPTY_PRODUCT_ID_ANNUAL,
            },
            {
                vendorProductId: exports.MOCK_VENDOR_PRODUCT_ID_MONTHLY,
                adaptyProductId: exports.MOCK_ADAPTY_PRODUCT_ID_MONTHLY,
            },
        ], paywallBuilder: {
            id: 'mock.paywall.builder.id',
            lang: 'en',
        }, webPurchaseUrl: `http://paywalls-mock.adapty.io/${placementId}`, version: Date.now(), requestLocale: 'en' }, overrides);
}
exports.createMockPaywall = createMockPaywall;
/**
 * Creates default mock products for a paywall
 */
function createMockProducts(paywall) {
    return [
        {
            vendorProductId: exports.MOCK_VENDOR_PRODUCT_ID_ANNUAL,
            adaptyId: exports.MOCK_ADAPTY_PRODUCT_ID_ANNUAL,
            localizedTitle: 'Premium Annual',
            localizedDescription: 'Get premium access for 1 year',
            regionCode: 'US',
            paywallName: paywall.name,
            paywallABTestName: paywall.placement.abTestName,
            variationId: paywall.variationId,
            accessLevelId: exports.MOCK_ACCESS_LEVEL_PREMIUM,
            productType: 'subscription',
            price: {
                amount: 99.99,
                currencyCode: 'USD',
                currencySymbol: '$',
                localizedString: '$99.99',
            },
            webPurchaseUrl: paywall.webPurchaseUrl,
            paywallProductIndex: 0,
            subscription: {
                subscriptionPeriod: {
                    numberOfUnits: 1,
                    unit: 'year',
                },
                localizedSubscriptionPeriod: '1 year',
                offer: {
                    identifier: {
                        type: 'introductory',
                    },
                    phases: [
                        {
                            localizedNumberOfPeriods: '1 month',
                            localizedSubscriptionPeriod: '1 month',
                            numberOfPeriods: 1,
                            paymentMode: 'free_trial',
                            price: {
                                amount: 0,
                                currencyCode: 'USD',
                                localizedString: '$0.00',
                            },
                            subscriptionPeriod: {
                                unit: 'month',
                                numberOfUnits: 1,
                            },
                        },
                    ],
                },
                ios: {
                    subscriptionGroupIdentifier: '20770576',
                },
            },
            ios: {
                isFamilyShareable: false,
            },
        },
        {
            vendorProductId: exports.MOCK_VENDOR_PRODUCT_ID_MONTHLY,
            adaptyId: exports.MOCK_ADAPTY_PRODUCT_ID_MONTHLY,
            localizedTitle: 'Premium Monthly',
            localizedDescription: 'Get premium access for 1 month',
            regionCode: 'US',
            paywallName: paywall.name,
            paywallABTestName: paywall.placement.abTestName,
            variationId: paywall.variationId,
            accessLevelId: exports.MOCK_ACCESS_LEVEL_PREMIUM,
            productType: 'subscription',
            price: {
                amount: 9.99,
                currencyCode: 'USD',
                currencySymbol: '$',
                localizedString: '$9.99',
            },
            webPurchaseUrl: paywall.webPurchaseUrl,
            paywallProductIndex: 1,
            subscription: {
                subscriptionPeriod: {
                    numberOfUnits: 1,
                    unit: 'month',
                },
                localizedSubscriptionPeriod: '1 month',
                offer: {
                    identifier: {
                        type: 'introductory',
                    },
                    phases: [
                        {
                            localizedNumberOfPeriods: '1 month',
                            localizedSubscriptionPeriod: '1 month',
                            numberOfPeriods: 1,
                            paymentMode: 'pay_up_front',
                            price: {
                                amount: 1.99,
                                currencyCode: 'USD',
                                localizedString: '$1.99',
                            },
                            subscriptionPeriod: {
                                unit: 'month',
                                numberOfUnits: 1,
                            },
                        },
                    ],
                },
                ios: {
                    subscriptionGroupIdentifier: '20770576',
                },
            },
            ios: {
                isFamilyShareable: false,
            },
        },
    ];
}
exports.createMockProducts = createMockProducts;
/**
 * Creates a successful purchase result with updated profile
 */
function createMockPurchaseResult(profile) {
    return {
        type: 'success',
        profile,
    };
}
exports.createMockPurchaseResult = createMockPurchaseResult;
/**
 * Creates a default mock onboarding
 */
function createMockOnboarding(placementId, overrides) {
    return Object.assign({ id: `mock_onboarding_${placementId}`, placement: {
            id: placementId,
            abTestName: 'Mock Onboarding A/B Test',
            audienceName: 'All Users',
            revision: 1,
            audienceVersionId: 'mock_onboarding_audience_v1',
            isTrackingPurchases: true,
        }, hasViewConfiguration: true, name: `Mock Onboarding for ${placementId}`, variationId: 'mock_onboarding_variation_id', version: 1, requestLocale: 'en', remoteConfig: {
            lang: 'en',
            data: { screens: ['Welcome', 'Features', 'Pricing'] },
            dataString: '{"screens":["Welcome","Features","Pricing"]}',
        } }, overrides);
}
exports.createMockOnboarding = createMockOnboarding;
//# sourceMappingURL=mock-data.js.map