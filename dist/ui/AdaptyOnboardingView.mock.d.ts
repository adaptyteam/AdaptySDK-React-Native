import React from 'react';
import { NativeAdaptyOnboardingViewProps } from './types';
/**
 * Mock implementation of AdaptyOnboardingView component.
 *
 * This component is used in environments where native modules are not available:
 * - Expo Go
 * - Web browsers
 *
 * In builds with native dependencies (Expo EAS or dev-client), the actual native
 * AdaptyOnboardingView component will be used instead, which renders the real
 * onboarding UI configured in the Adapty Dashboard.
 *
 * @see {@link https://docs.adapty.io/docs/paywall-builder-getting-started Adapty Paywall Builder Documentation}
 */
export declare const AdaptyOnboardingViewMock: React.FC<NativeAdaptyOnboardingViewProps>;
//# sourceMappingURL=AdaptyOnboardingView.mock.d.ts.map