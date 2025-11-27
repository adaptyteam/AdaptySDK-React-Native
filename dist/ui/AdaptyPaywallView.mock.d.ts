import React from 'react';
import { NativeAdaptyPaywallViewProps } from './types';
/**
 * Mock implementation of AdaptyPaywallView component.
 *
 * This component is used in environments where native modules are not available:
 * - Expo Go
 * - Web browsers
 *
 * In builds with native dependencies (Expo EAS or dev-client), the actual native
 * AdaptyPaywallView component will be used instead, which renders the real paywall
 * UI configured in the Adapty Dashboard.
 *
 * @see {@link https://docs.adapty.io/docs/paywall-builder-getting-started Adapty Paywall Builder Documentation}
 */
export declare const AdaptyPaywallViewMock: React.FC<NativeAdaptyPaywallViewProps>;
//# sourceMappingURL=AdaptyPaywallView.mock.d.ts.map