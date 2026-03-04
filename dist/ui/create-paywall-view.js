"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaywallView = void 0;
const tslib_1 = require("tslib");
const view_controller_1 = require("./view-controller");
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
//# sourceMappingURL=create-paywall-view.js.map