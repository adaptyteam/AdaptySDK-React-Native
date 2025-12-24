import { AdaptyOnboarding } from '@/types';
import { CreateOnboardingViewParamsInput } from './types';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';

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
export async function createOnboardingView(
  onboarding: AdaptyOnboarding,
  params: CreateOnboardingViewParamsInput = {},
): Promise<OnboardingViewController> {
  const controller = await OnboardingViewController.create(onboarding, params);

  return controller;
}
