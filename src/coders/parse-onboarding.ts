import { parseOnboardingEvent as _parseOnboardingEvent } from '@adapty/core';
import type { LogContext } from '../logger';
import type { ParsedOnboardingEvent } from '@/types/onboarding-events';
import { coderFactory } from './factory';

// Re-export types for convenience
export {
  OnboardingEventId,
  type OnboardingEventIdType,
  type OnboardingEventView,
  type OnboardingCloseEvent,
  type OnboardingCustomEvent,
  type OnboardingPaywallEvent,
  type OnboardingStateUpdatedEvent,
  type OnboardingFinishedLoadingEvent,
  type OnboardingAnalyticsEvent,
  type OnboardingErrorEvent,
  type ParsedOnboardingEvent,
} from '@/types/onboarding-events';

export const parseOnboardingEvent = (
  input: string,
  ctx?: LogContext,
): ParsedOnboardingEvent | null =>
  _parseOnboardingEvent(coderFactory, input, ctx);
