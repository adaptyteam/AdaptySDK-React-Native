import { OnboardingViewEmitter } from './onboarding-view-emitter';
import {
  DEFAULT_ONBOARDING_EVENT_HANDLERS,
  OnboardingEventHandlers,
} from './types';

/**
 * Creates and configures event handlers for an onboarding view without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
export function createOnboardingEventHandlers(
  eventHandlers: Partial<OnboardingEventHandlers>,
  viewId: string,
  onRequestClose?: () => Promise<void>,
): () => void {
  const finalEventHandlers: Partial<OnboardingEventHandlers> = {
    ...DEFAULT_ONBOARDING_EVENT_HANDLERS,
    ...eventHandlers,
  };

  const requestClose: () => Promise<void> = onRequestClose ?? (async () => {});
  const viewEmitter = new OnboardingViewEmitter(viewId);

  Object.keys(finalEventHandlers).forEach(eventStr => {
    const event = eventStr as keyof OnboardingEventHandlers;
    if (!finalEventHandlers.hasOwnProperty(event)) {
      return;
    }
    const handler = finalEventHandlers[
      event
    ] as OnboardingEventHandlers[keyof OnboardingEventHandlers];
    viewEmitter.addListener(event, handler, requestClose);
  });

  return () => viewEmitter.removeAllListeners();
}
