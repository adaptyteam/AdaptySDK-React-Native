"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockStore = void 0;
const mock_data_1 = require("./mock-data");
/**
 * Stateful store for mock data
 * Maintains profile state across operations
 */
class MockStore {
    constructor(config = {}) {
        this.isActivated = false;
        this.config = config;
        this.profile = (0, mock_data_1.createMockProfile)(config.profile);
    }
    /**
     * Get the current profile
     */
    getProfile() {
        return Object.assign({}, this.profile);
    }
    /**
     * Update profile with custom data
     *
     * Note: In real Adapty, updateProfile() sends user attributes (firstName, lastName, email, etc.)
     * to the server for CRM and segmentation, but these fields are NOT returned by getProfile().
     * Only customAttributes are stored in the profile and returned by getProfile().
     */
    updateProfile(updates) {
        // Only codableCustomAttributes are stored in the profile and returned by getProfile()
        if (updates.codableCustomAttributes) {
            const updatedProfile = Object.assign(Object.assign({}, this.profile), { customAttributes: Object.assign(Object.assign({}, this.profile.customAttributes), updates.codableCustomAttributes) });
            this.profile = updatedProfile;
        }
        // Other fields (firstName, lastName, email, phoneNumber, etc.) are sent to Adapty server
        // for CRM and segmentation purposes, but are NOT stored in the profile object
        // and NOT returned by getProfile()
    }
    /**
     * Grant premium access level
     */
    grantPremiumAccess(accessLevelId) {
        const premiumAccessLevel = (0, mock_data_1.createMockPremiumAccessLevel)(accessLevelId);
        const { now, expiresAt, unsubscribedAt } = (0, mock_data_1.createSubscriptionDates)();
        const updatedProfile = Object.assign(Object.assign({}, this.profile), { accessLevels: Object.assign(Object.assign({}, this.profile.accessLevels), { [accessLevelId]: premiumAccessLevel }), subscriptions: Object.assign(Object.assign({}, this.profile.subscriptions), { [mock_data_1.MOCK_VENDOR_PRODUCT_ID_ANNUAL]: {
                    isActive: true,
                    isLifetime: false,
                    vendorProductId: mock_data_1.MOCK_VENDOR_PRODUCT_ID_ANNUAL,
                    store: 'adapty',
                    vendorTransactionId: '2000001082537697',
                    vendorOriginalTransactionId: '2000000971279249',
                    activatedAt: now,
                    renewedAt: now,
                    expiresAt,
                    unsubscribedAt,
                    willRenew: false,
                    isInGracePeriod: false,
                    isRefund: false,
                    isSandbox: true,
                } }) });
        this.profile = updatedProfile;
        return this.getProfile();
    }
    /**
     * Simulate a purchase and update profile accordingly
     *
     * @param productAccessLevelId - Access level ID from the product, or undefined if not available
     */
    makePurchase(productAccessLevelId) {
        const shouldGrantPremium = this.config.autoGrantPremium !== false; // default true
        if (shouldGrantPremium) {
            const accessLevelId = this.config.premiumAccessLevelId ||
                productAccessLevelId ||
                mock_data_1.MOCK_ACCESS_LEVEL_PREMIUM;
            return this.grantPremiumAccess(accessLevelId);
        }
        return this.getProfile();
    }
    /**
     * Get paywall for placement
     */
    getPaywall(placementId) {
        var _a;
        const customPaywall = (_a = this.config.paywalls) === null || _a === void 0 ? void 0 : _a[placementId];
        return (0, mock_data_1.createMockPaywall)(placementId, customPaywall);
    }
    /**
     * Get products for paywall
     */
    getPaywallProducts(placementId, variationId = 'mock_variation_id') {
        var _a;
        // If custom products are provided by variationId, use them
        const customProducts = (_a = this.config.products) === null || _a === void 0 ? void 0 : _a[variationId];
        if (customProducts) {
            return customProducts;
        }
        // Otherwise, generate default products
        const paywall = this.getPaywall(placementId);
        return (0, mock_data_1.createMockProducts)(paywall);
    }
    /**
     * Get onboarding for placement
     */
    getOnboarding(placementId) {
        var _a;
        const customOnboarding = (_a = this.config.onboardings) === null || _a === void 0 ? void 0 : _a[placementId];
        return (0, mock_data_1.createMockOnboarding)(placementId, customOnboarding);
    }
    /**
     * Set activated state
     */
    setActivated(activated) {
        this.isActivated = activated;
    }
    /**
     * Check if SDK is activated
     */
    getIsActivated() {
        return this.isActivated;
    }
    /**
     * Reset profile to initial state
     */
    logout() {
        this.profile = (0, mock_data_1.createMockProfile)(this.config.profile);
    }
    /**
     * Update customer user ID
     */
    identify(customerUserId) {
        const updatedProfile = Object.assign(Object.assign({}, this.profile), { customerUserId });
        this.profile = updatedProfile;
    }
}
exports.MockStore = MockStore;
//# sourceMappingURL=mock-store.js.map