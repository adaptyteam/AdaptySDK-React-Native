import { Adapty } from '@/adapty-handler';
import { createOnboardingView } from '@/ui/create-onboarding-view';
import { OnboardingViewController } from '@/ui/onboarding-view-controller';
import { createFlowView } from '@/ui/create-flow-view';
import { FlowViewController } from '@/ui/flow-view-controller';
import { AdaptyFlow } from '@/types';
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
 * Creates FlowViewController for testing
 */
export async function createFlowViewController(): Promise<{
  adapty: Adapty;
  view: FlowViewController;
  flow: AdaptyFlow;
}> {
  const adapty = await createAdaptyInstance();
  const flow = await adapty.getFlow('test_placement');
  const view = await createFlowView(flow);

  return { adapty, view, flow };
}

/**
 * Cleanup FlowViewController and Adapty instance
 */
export function cleanupFlowViewController(
  view: FlowViewController,
  adapty: Adapty,
): void {
  // View cleanup happens automatically on dismiss
  void view; // Suppress unused variable warning
  cleanupAdapty(adapty);
}
