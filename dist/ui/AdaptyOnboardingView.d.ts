import React from 'react';
import { ViewProps } from 'react-native';
import { AdaptyOnboarding } from '../types';
import { OnboardingEventHandlers } from './types';
export type Props = ViewProps & {
    onboarding: AdaptyOnboarding;
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
export declare const AdaptyOnboardingView: React.NamedExoticComponent<Props>;
//# sourceMappingURL=AdaptyOnboardingView.d.ts.map