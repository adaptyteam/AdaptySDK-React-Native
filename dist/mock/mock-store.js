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
     */
    updateProfile(updates) {
        this.profile = Object.assign(Object.assign({}, this.profile), updates);
    }
    /**
     * Grant premium access level
     */
    grantPremiumAccess(product, accessLevelId) {
        const levelId = accessLevelId || product.accessLevelId || 'premium';
        const premiumAccessLevel = (0, mock_data_1.createMockPremiumAccessLevel)(levelId);
        this.profile = Object.assign(Object.assign({}, this.profile), { accessLevels: Object.assign(Object.assign({}, this.profile.accessLevels), { [levelId]: premiumAccessLevel }) });
        return this.getProfile();
    }
    /**
     * Simulate a purchase and update profile accordingly
     */
    makePurchase(product) {
        const shouldGrantPremium = this.config.autoGrantPremium !== false; // default true
        if (shouldGrantPremium) {
            const accessLevelId = this.config.premiumAccessLevelId || product.accessLevelId || 'premium';
            return this.grantPremiumAccess(product, accessLevelId);
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
        this.profile = Object.assign(Object.assign({}, this.profile), { customerUserId });
    }
}
exports.MockStore = MockStore;
//# sourceMappingURL=mock-store.js.map