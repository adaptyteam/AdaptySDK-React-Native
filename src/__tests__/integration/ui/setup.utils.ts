import { Adapty } from '@/adapty-handler';
import { createOnboardingView } from '@/ui/create-onboarding-view';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import {
  createAdaptyInstance,
  cleanupAdapty,
} from '../adapty-handler/setup.utils';

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
