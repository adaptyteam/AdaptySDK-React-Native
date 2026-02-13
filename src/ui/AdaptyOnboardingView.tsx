import React, { memo, useEffect, useMemo } from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import { AdaptyOnboarding, WebPresentation } from '@/types';
import { coderFactory } from '@/coders/factory';
import { generateId, shouldEnableMock } from '@/utils';
import {
  OnboardingEventHandlers,
  NativeAdaptyOnboardingViewProps,
} from './types';
import { createOnboardingEventHandlers } from './create-onboarding-event-handlers';
import { DEFAULT_ONBOARDING_PARAMS } from './onboarding-view-controller';
import { AdaptyOnboardingViewMock } from './AdaptyOnboardingView.mock';
import { filterUndefined } from '@adapty/core';

export type Props = ViewProps & {
  onboarding: AdaptyOnboarding;
  externalUrlsPresentation?: WebPresentation;
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
  externalUrlsPresentation = DEFAULT_ONBOARDING_PARAMS.externalUrlsPresentation,
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
    const encodedOnboarding = coderFactory
      .createOnboardingCoder()
      .encode(onboarding);

    const encodedParams = coderFactory
      .createUiCreateOnboardingViewParamsCoder()
      .encode({
        externalUrlsPresentation,
      });

    return JSON.stringify({
      onboarding: encodedOnboarding,
      ...encodedParams,
    });
  }, [onboarding, externalUrlsPresentation]);

  const combinedEventHandlers =
    useMemo((): Partial<OnboardingEventHandlers> => {
      // Merge legacy eventHandlers with individual props (individual props take priority)
      return {
        ...eventHandlers,
        ...filterUndefined({
          onClose,
          onCustom,
          onPaywall,
          onStateUpdated,
          onFinishedLoading,
          onAnalytics,
          onError,
        }),
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
