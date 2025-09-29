import React from 'react';
import { ViewProps } from 'react-native';
import { AdaptyOnboarding } from '../types';
import { AdaptyUiOnboardingMeta, OnboardingStateUpdatedAction, OnboardingAnalyticsEventName } from './types';
import { AdaptyError } from '../adapty-error';
export interface OnboardingViewEventHandlers {
    onClose: (actionId: string, meta: AdaptyUiOnboardingMeta) => void;
    onCustom: (actionId: string, meta: AdaptyUiOnboardingMeta) => void;
    onPaywall: (actionId: string, meta: AdaptyUiOnboardingMeta) => void;
    onStateUpdated: (action: OnboardingStateUpdatedAction, meta: AdaptyUiOnboardingMeta) => void;
    onFinishedLoading: (meta: AdaptyUiOnboardingMeta) => void;
    onAnalytics: (event: {
        name: OnboardingAnalyticsEventName;
        element_id?: string;
        reply?: string;
    }, meta: AdaptyUiOnboardingMeta) => void;
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
export declare const AdaptyOnboardingView: React.FC<Props>;
//# sourceMappingURL=AdaptyOnboardingView.d.ts.map