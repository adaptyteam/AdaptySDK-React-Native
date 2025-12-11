"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPaywallView = exports.AdaptyOnboardingView = exports.createOnboardingView = exports.createPaywallView = void 0;
const tslib_1 = require("tslib");
const view_controller_1 = require("./view-controller");
const onboarding_view_controller_1 = require("../ui/onboarding-view-controller");
/**
 * Creates a paywall view controller.
 * You can use it to further configure a view or present it.
 *
 * @see {@link https://docs.adapty.io/docs/paywall-builder-fetching | [DOC] Creating a paywall view}
 *
 * @param {AdaptyPaywall} paywall - paywall that you want to present.
 * @param {CreatePaywallViewParamsInput | undefined} [params] - additional params.
 * @returns {Promise<ViewController>} ViewController — A promise that resolves to a ViewController instance.
 *
 * @example
 * ```ts
 * const paywall = await adapty.getPaywall("MY_PAYWALL");
 * const view = await createPaywallView(paywall);
 * // Present with default full-screen style
 * view.present();
 * // Or present with custom style (iOS only)
 * view.present({ iosPresentationStyle: 'page_sheet' }); // or 'full_screen'
 * ```
 *
 * @throws {AdaptyError} — If paywall is not found,
 * does not have a no-code view configured
 * or if there is an error while creating a view.
 */
function createPaywallView(paywall, params = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const controller = yield view_controller_1.ViewController.create(paywall, params);
        return controller;
    });
}
exports.createPaywallView = createPaywallView;
/**
 * Creates an onboarding view controller.
 * You can use it to further configure a view or present it.
 *
 * @param {AdaptyOnboarding} onboarding - onboarding that you want to present.
 * @returns {Promise<OnboardingViewController>} OnboardingViewController — A promise that resolves to an OnboardingViewController instance.
 *
 * @example
 * ```ts
 * const onboarding = await adapty.getOnboarding("MY_ONBOARDING");
 * const view = await createOnboardingView(onboarding);
 * // Present with default full-screen style
 * view.present();
 * // Or present with custom style (iOS only)
 * view.present({ iosPresentationStyle: 'page_sheet' }); // or 'full_screen'
 * ```
 *
 * @throws {AdaptyError} — If onboarding is not found,
 * does not have a no-code view configured
 * or if there is an error while creating a view.
 */
function createOnboardingView(onboarding) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const controller = yield onboarding_view_controller_1.OnboardingViewController.create(onboarding);
        return controller;
    });
}
exports.createOnboardingView = createOnboardingView;
var AdaptyOnboardingView_1 = require("./AdaptyOnboardingView");
Object.defineProperty(exports, "AdaptyOnboardingView", { enumerable: true, get: function () { return AdaptyOnboardingView_1.AdaptyOnboardingView; } });
var AdaptyPaywallView_1 = require("./AdaptyPaywallView");
Object.defineProperty(exports, "AdaptyPaywallView", { enumerable: true, get: function () { return AdaptyPaywallView_1.AdaptyPaywallView; } });
tslib_1.__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map