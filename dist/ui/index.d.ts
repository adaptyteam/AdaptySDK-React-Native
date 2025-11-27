import { AdaptyOnboarding, AdaptyPaywall } from '../types';
import { CreatePaywallViewParamsInput } from './types';
import { ViewController } from './view-controller';
import { OnboardingViewController } from '../ui/onboarding-view-controller';
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
export declare function createPaywallView(paywall: AdaptyPaywall, params?: CreatePaywallViewParamsInput): Promise<ViewController>;
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
export declare function createOnboardingView(onboarding: AdaptyOnboarding): Promise<OnboardingViewController>;
export { AdaptyOnboardingView } from './AdaptyOnboardingView';
export { AdaptyPaywallView } from './AdaptyPaywallView';
export * from './types';
//# sourceMappingURL=index.d.ts.map