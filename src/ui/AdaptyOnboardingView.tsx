import React, { memo, useEffect, useMemo } from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import { AdaptyOnboarding } from '@/types';
import { AdaptyOnboardingCoder } from '@/coders/adapty-onboarding';
import { generateId } from '@/utils/generate-id';
import { OnboardingEventHandlers } from './types';
import { registerEventHandlers } from './onboarding-view-controller';

export type Props = ViewProps & {
  onboarding: AdaptyOnboarding;
  eventHandlers?: Partial<OnboardingEventHandlers>;
};

type NativeOnboardingViewProps = ViewProps & {
  viewId: string;
  onboardingJson: string;
};

const NativeAdaptyOnboardingView = requireNativeComponent<NativeOnboardingViewProps>(
  'AdaptyOnboardingView',
);

const AdaptyOnboardingViewComponent: React.FC<Props> = ({
  onboarding,
  eventHandlers,
  ...rest
}) => {
  const uniqueViewId = useMemo(
    () => `${onboarding.id}_${generateId()}`,
    [onboarding.id],
  );

  const onboardingJson = useMemo(
    () => JSON.stringify(new AdaptyOnboardingCoder().encode(onboarding)),
    [onboarding],
  );


  useEffect(() => {
    const unsubscribe = registerEventHandlers(
      eventHandlers ?? {},
      uniqueViewId,
    );
    return unsubscribe;
  }, [uniqueViewId, eventHandlers]);

  return (
    <NativeAdaptyOnboardingView
      {...rest}
      viewId={uniqueViewId}
      onboardingJson={onboardingJson}
    />
  );
};

export const AdaptyOnboardingView = memo(AdaptyOnboardingViewComponent);
