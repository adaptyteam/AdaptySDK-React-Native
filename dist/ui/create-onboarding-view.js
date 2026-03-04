"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOnboardingView = void 0;
const tslib_1 = require("tslib");
const onboarding_view_controller_1 = require("../ui/onboarding-view-controller");
/**
 * Creates an onboarding view controller.
 * You can use it to further configure a view or present it.
 *
 * @see {@link https://adapty.io/docs/react-native-get-onboardings | [DOC] Get onboardings}
 *
 * @param {AdaptyOnboarding} onboarding - onboarding that you want to present.
 * @param {CreateOnboardingViewParamsInput | undefined} [params] - additional params.
 * @returns {Promise<OnboardingViewController>} OnboardingViewController — A promise that resolves to an OnboardingViewController instance.
 *
 * @example
 * ```ts
 * const onboarding = await adapty.getOnboarding("MY_ONBOARDING");
 * const view = await createOnboardingView(onboarding);
 * // Present with default full-screen style
 * view.present();
 *
 * // With custom external URLs presentation
 * const viewWithCustomUrls = await createOnboardingView(onboarding, {
 *   externalUrlsPresentation: WebPresentation.BrowserOutApp
 * });
 * ```
 *
 * @throws {AdaptyError} — If onboarding is not found,
 * does not have a no-code view configured
 * or if there is an error while creating a view.
 */
function createOnboardingView(onboarding, params = {}) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const controller = yield onboarding_view_controller_1.OnboardingViewController.create(onboarding, params);
        return controller;
    });
}
exports.createOnboardingView = createOnboardingView;
//# sourceMappingURL=create-onboarding-view.js.map