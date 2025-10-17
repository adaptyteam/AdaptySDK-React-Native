import React, { useMemo } from 'react';
import {
  requireNativeComponent,
  ViewProps,
  NativeSyntheticEvent,
} from 'react-native';
import { AdaptyOnboarding } from '@/types';
import { AdaptyOnboardingCoder } from '@/coders/adapty-onboarding';
import {
  AdaptyUiOnboardingMeta,
  OnboardingStateUpdatedAction,
  OnboardingAnalyticsEventName,
} from './types';
import { AdaptyError } from '@/adapty-error';

export interface OnboardingViewEventHandlers {
  onClose: (actionId: string, meta: AdaptyUiOnboardingMeta) => void;
  onCustom: (actionId: string, meta: AdaptyUiOnboardingMeta) => void;
  onPaywall: (actionId: string, meta: AdaptyUiOnboardingMeta) => void;
  onStateUpdated: (
    action: OnboardingStateUpdatedAction,
    meta: AdaptyUiOnboardingMeta,
  ) => void;
  onFinishedLoading: (meta: AdaptyUiOnboardingMeta) => void;
  onAnalytics: (
    event: {
      name: OnboardingAnalyticsEventName;
      element_id?: string;
      reply?: string;
    },
    meta: AdaptyUiOnboardingMeta,
  ) => void;
  onError: (error: AdaptyError) => void;
}

export type AdaptyOnboardingNativeEvent = {
  eventId: string;
  eventData: string;
};

export type Props = ViewProps & {
  onboarding: AdaptyOnboarding;
  eventHandlers?: Partial<OnboardingViewEventHandlers>;
};

const NativeAdaptyOnboardingView = requireNativeComponent<any>(
  'AdaptyOnboardingView',
);

export const AdaptyOnboardingView: React.FC<Props> = ({
  onboarding,
  eventHandlers,
  ...rest
}) => {
  const coder = new AdaptyOnboardingCoder();

  const uniqueViewId = useMemo(() => {
    const instanceId = `${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    return `${onboarding.id}_${instanceId}`;
  }, [onboarding.id]);

  const handleEvent = (
    e: NativeSyntheticEvent<AdaptyOnboardingNativeEvent>,
  ) => {
    if (!eventHandlers) return;

    const { eventId, eventData } = e.nativeEvent;
    let parsedData: any = {};

    try {
      parsedData = JSON.parse(eventData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse event data:', error);
      return;
    }

    const handlerName = getHandlerNameForEvent(eventId);
    if (!handlerName) {
      return;
    }

    const callbackArgs = extractOnboardingCallbackArgs(handlerName, parsedData);

    const handler = eventHandlers[handlerName];

    if (handler) {
      (handler as any)(...callbackArgs);
    }
  };

  const getHandlerNameForEvent = (
    eventId: string,
  ): keyof OnboardingViewEventHandlers | null => {
    switch (eventId) {
      case 'onboarding_on_close_action':
        return 'onClose';
      case 'onboarding_on_custom_action':
        return 'onCustom';
      case 'onboarding_on_paywall_action':
        return 'onPaywall';
      case 'onboarding_on_state_updated_action':
        return 'onStateUpdated';
      case 'onboarding_did_finish_loading':
        return 'onFinishedLoading';
      case 'onboarding_on_analytics_action':
        return 'onAnalytics';
      case 'onboarding_did_fail_with_error':
        return 'onError';
      default:
        return null;
    }
  };

  const extractOnboardingCallbackArgs = (
    handlerName: keyof OnboardingViewEventHandlers,
    eventArg: Record<string, any>,
  ): any[] => {
    const actionId = eventArg['id'] || '';
    const meta = eventArg['meta'] || {};
    const event = eventArg['event'] || {};
    const action = eventArg['action'] || {};

    switch (handlerName) {
      case 'onClose':
      case 'onCustom':
      case 'onPaywall':
        return [actionId, meta];
      case 'onStateUpdated':
        return [action, meta];
      case 'onFinishedLoading':
        return [meta];
      case 'onAnalytics':
        return [event, meta];
      case 'onError':
        return [eventArg['error']];
      default:
        return [];
    }
  };

  return (
    <NativeAdaptyOnboardingView
      {...rest}
      viewId={uniqueViewId}
      onboardingJson={JSON.stringify(coder.encode(onboarding))}
      onEvent={handleEvent}
    />
  );
};
