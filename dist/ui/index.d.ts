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
 * view.present();
 * ```
 *
 * @throws {AdaptyError} — If paywall is not found,
 * does not have a no-code view configured
 * or if there is an error while creating a view.
 */
export declare function createPaywallView(paywall: AdaptyPaywall, params?: CreatePaywallViewParamsInput): Promise<ViewController>;
export declare function createOnboardingView(onboarding: AdaptyOnboarding): Promise<OnboardingViewController>;
export { AdaptyOnboardingView } from './AdaptyOnboardingView';
//# sourceMappingURL=index.d.ts.map