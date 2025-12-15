import React, { memo, useEffect, useMemo } from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import { AdaptyOnboarding } from '@/types';
import { AdaptyOnboardingCoder } from '@/coders/adapty-onboarding';
import { AdaptyUICreateOnboardingViewParamsCoder } from '@/coders';
import { generateId } from '@/utils/generate-id';
import { shouldEnableMock } from '@/utils';
import {
  CreateOnboardingViewParamsInput,
  OnboardingEventHandlers,
  NativeAdaptyOnboardingViewProps,
} from './types';
import { createOnboardingEventHandlers } from './create-onboarding-event-handlers';
import { DEFAULT_ONBOARDING_PARAMS } from './onboarding-view-controller';
import { AdaptyOnboardingViewMock } from './AdaptyOnboardingView.mock';

export type Props = ViewProps & {
  onboarding: AdaptyOnboarding;
  params?: CreateOnboardingViewParamsInput;
  onClose?: OnboardingEventHandlers['onClose'];
  onCustom?: OnboardingEventHandlers['onCustom'];
  onPaywall?: OnboardingEventHandlers['onPaywall'];
  onStateUpdated?: OnboardingEventHandlers['onStateUpdated'];
  onFinishedLoading?: OnboardingEventHandlers['onFinishedLoading'];
  onAnalytics?: OnboardingEventHandlers['onAnalytics'];
  onError?: OnboardingEventHandlers['onError'];
  /**
   * @deprecated Use individual event handler props instead (onClose, onCustom, onPaywall, etc.)
   * This prop is kept for backward compatibility and will be removed in a future version.
   */
  eventHandlers?: Partial<OnboardingEventHandlers>;
};

const NativeAdaptyOnboardingView = shouldEnableMock()
  ? AdaptyOnboardingViewMock
  : requireNativeComponent<NativeAdaptyOnboardingViewProps>(
      'AdaptyOnboardingView',
    );

const AdaptyOnboardingViewComponent: React.FC<Props> = ({
  onboarding,
  params,
  eventHandlers,
  onClose,
  onCustom,
  onPaywall,
  onStateUpdated,
  onFinishedLoading,
  onAnalytics,
  onError,
  ...rest
}) => {
  const uniqueViewId = useMemo(
    () => `${onboarding.id}_${generateId()}`,
    [onboarding.id],
  );

  const onboardingJson = useMemo(() => {
    const encodedOnboarding = new AdaptyOnboardingCoder().encode(onboarding);

    const paramsWithDefaults = { ...DEFAULT_ONBOARDING_PARAMS, ...params };

    const encodedParams = new AdaptyUICreateOnboardingViewParamsCoder().encode(
      paramsWithDefaults,
    );

    return JSON.stringify({
      onboarding: encodedOnboarding,
      ...encodedParams,
    });
  }, [onboarding, params]);

  const combinedEventHandlers =
    useMemo((): Partial<OnboardingEventHandlers> => {
      const individualHandlers: Partial<OnboardingEventHandlers> = {};

      if (onClose) individualHandlers.onClose = onClose;
      if (onCustom) individualHandlers.onCustom = onCustom;
      if (onPaywall) individualHandlers.onPaywall = onPaywall;
      if (onStateUpdated) individualHandlers.onStateUpdated = onStateUpdated;
      if (onFinishedLoading)
        individualHandlers.onFinishedLoading = onFinishedLoading;
      if (onAnalytics) individualHandlers.onAnalytics = onAnalytics;
      if (onError) individualHandlers.onError = onError;

      // Merge legacy eventHandlers with individual props (individual props take priority)
      return {
        ...eventHandlers,
        ...individualHandlers,
      };
    }, [
      onClose,
      onCustom,
      onPaywall,
      onStateUpdated,
      onFinishedLoading,
      onAnalytics,
      onError,
      eventHandlers,
    ]);

  useEffect(() => {
    const unsubscribe = createOnboardingEventHandlers(
      combinedEventHandlers,
      uniqueViewId,
    );
    return unsubscribe;
  }, [uniqueViewId, combinedEventHandlers]);

  return (
    <NativeAdaptyOnboardingView
      {...rest}
      viewId={uniqueViewId}
      onboardingJson={onboardingJson}
    />
  );
};

export const AdaptyOnboardingView = memo(AdaptyOnboardingViewComponent);
