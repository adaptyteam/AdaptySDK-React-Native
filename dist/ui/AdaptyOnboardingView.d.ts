import React from 'react';
import { ViewProps } from 'react-native';
import { AdaptyOnboarding, WebPresentation } from '../types';
import { OnboardingEventHandlers } from './types';
/**
 * Props for the {@link AdaptyOnboardingView} component.
 * @public
 */
export type AdaptyOnboardingViewProps = ViewProps & {
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
/**
 * React component that renders a native onboarding view.
 *
 * @remarks
 * Accepts an onboarding object and optional event handler props.
 * Under the hood, it creates a native view and subscribes to onboarding events.
 *
 * @see {@link AdaptyOnboardingViewProps} for available props
 * @public
 */
export declare const AdaptyOnboardingView: React.NamedExoticComponent<AdaptyOnboardingViewProps>;
//# sourceMappingURL=AdaptyOnboardingView.d.ts.map