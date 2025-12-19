import { AdaptyError } from '@/adapty-error';
import type {
  AdaptyUiOnboardingMeta,
  OnboardingStateUpdatedAction,
} from '@/ui/types';

// Onboarding Event IDs
export const OnboardingEventId = {
  Close: 'onboarding_on_close_action',
  Custom: 'onboarding_on_custom_action',
  Paywall: 'onboarding_on_paywall_action',
  StateUpdated: 'onboarding_on_state_updated_action',
  FinishedLoading: 'onboarding_did_finish_loading',
  Analytics: 'onboarding_on_analytics_action',
  Error: 'onboarding_did_fail_with_error',
} as const;

export type OnboardingEventIdType =
  (typeof OnboardingEventId)[keyof typeof OnboardingEventId];

// Event View
export interface OnboardingEventView {
  id: string;
  placement_id?: string;
  variation_id?: string;
}

// Base Event
interface BaseOnboardingEvent {
  id: OnboardingEventIdType;
  view: OnboardingEventView;
}

// Event Types
export interface OnboardingCloseEvent extends BaseOnboardingEvent {
  id: typeof OnboardingEventId.Close;
  actionId: string;
  meta: AdaptyUiOnboardingMeta;
}

export interface OnboardingCustomEvent extends BaseOnboardingEvent {
  id: typeof OnboardingEventId.Custom;
  actionId: string;
  meta: AdaptyUiOnboardingMeta;
}

export interface OnboardingPaywallEvent extends BaseOnboardingEvent {
  id: typeof OnboardingEventId.Paywall;
  actionId: string;
  meta: AdaptyUiOnboardingMeta;
}

export interface OnboardingStateUpdatedEvent extends BaseOnboardingEvent {
  id: typeof OnboardingEventId.StateUpdated;
  action: OnboardingStateUpdatedAction;
  meta: AdaptyUiOnboardingMeta;
}

export interface OnboardingFinishedLoadingEvent extends BaseOnboardingEvent {
  id: typeof OnboardingEventId.FinishedLoading;
  meta: AdaptyUiOnboardingMeta;
}

export interface OnboardingAnalyticsEvent extends BaseOnboardingEvent {
  id: typeof OnboardingEventId.Analytics;
  event: { name: string; elementId?: string; reply?: string };
  meta: AdaptyUiOnboardingMeta;
}

export interface OnboardingErrorEvent extends BaseOnboardingEvent {
  id: typeof OnboardingEventId.Error;
  error: AdaptyError;
}

export type ParsedOnboardingEvent =
  | OnboardingCloseEvent
  | OnboardingCustomEvent
  | OnboardingPaywallEvent
  | OnboardingStateUpdatedEvent
  | OnboardingFinishedLoadingEvent
  | OnboardingAnalyticsEvent
  | OnboardingErrorEvent;

