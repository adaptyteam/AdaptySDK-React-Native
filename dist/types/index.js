"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundPreference = exports.ProductPeriod = exports.AppTrackingTransparencyStatus = exports.Gender = exports.CancellationReason = exports.OfferType = exports.VendorStore = void 0;
exports.VendorStore = Object.freeze({
    AppStore: 'app_store',
    PlayStore: 'play_store',
    Adapty: 'adapty',
});
exports.OfferType = Object.freeze({
    FreeTrial: 'free_trial',
    PayAsYouGo: 'pay_as_you_go',
    PayUpFront: 'pay_up_front',
});
exports.CancellationReason = Object.freeze({
    VolountarilyCancelled: 'voluntarily_cancelled',
    BillingError: 'billing_error',
    Refund: 'refund',
    PriceIncrease: 'price_increase',
    ProductWasNotAvailable: 'product_was_not_available',
    Unknown: 'unknown',
});
exports.Gender = Object.freeze({
    Female: 'f',
    Male: 'm',
    Other: 'o',
});
exports.AppTrackingTransparencyStatus = Object.freeze({
    NotDetermined: 0,
    Restricted: 1,
    Denied: 2,
    Authorized: 3,
    Unknown: 4,
});
exports.ProductPeriod = Object.freeze({
    Day: 'day',
    Week: 'week',
    Month: 'month',
    Year: 'year',
});
exports.RefundPreference = Object.freeze({
    NoPreference: 'no_preference',
    Grant: 'grant',
    Decline: 'decline',
});
//# sourceMappingURL=index.js.map