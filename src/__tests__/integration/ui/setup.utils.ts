import { Adapty } from '@/adapty-handler';
import { createOnboardingView } from '@/ui/create-onboarding-view';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import { createPaywallView } from '@/ui/create-paywall-view';
import { ViewController } from '@/ui/view-controller';
import { AdaptyPaywall } from '@/types';
import {
  createAdaptyInstance,
  cleanupAdapty,
} from '../adapty-handler-mock-web/setup.utils';

/**
 * Creates OnboardingViewController for testing
 */
export async function createOnboardingViewController(): Promise<{
  adapty: Adapty;
  view: OnboardingViewController;
}> {
  const adapty = await createAdaptyInstance();
  const onboarding = await adapty.getOnboarding('test_placement');
  const view = await createOnboardingView(onboarding);

  return { adapty, view };
}

/**
 * Cleanup OnboardingViewController and Adapty instance
 */
export function cleanupOnboardingViewController(
  view: OnboardingViewController,
  adapty: Adapty,
): void {
  // View cleanup happens automatically on dismiss
  void view; // Suppress unused variable warning
  cleanupAdapty(adapty);
}

/**
 * Creates PaywallViewController for testing
 */
export async function createPaywallViewController(): Promise<{
  adapty: Adapty;
  view: ViewController;
  paywall: AdaptyPaywall;
}> {
  const adapty = await createAdaptyInstance();
  const paywall = await adapty.getPaywall('test_placement');
  const view = await createPaywallView(paywall);

  return { adapty, view, paywall };
}

/**
 * Cleanup PaywallViewController and Adapty instance
 */
export function cleanupPaywallViewController(
  view: ViewController,
  adapty: Adapty,
): void {
  // View cleanup happens automatically on dismiss
  void view; // Suppress unused variable warning
  cleanupAdapty(adapty);
}
