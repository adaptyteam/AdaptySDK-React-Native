import React from 'react';
import { ViewProps } from 'react-native';
import { AdaptyPaywall } from '../types';
import { CreatePaywallViewParamsInput, EventHandlers } from './types';
/**
 * Props for the {@link AdaptyPaywallView} component.
 * @public
 */
export type AdaptyPaywallViewProps = ViewProps & {
    paywall: AdaptyPaywall;
    params?: CreatePaywallViewParamsInput;
    onCloseButtonPress?: EventHandlers['onCloseButtonPress'];
    onProductSelected?: EventHandlers['onProductSelected'];
    onPurchaseStarted?: EventHandlers['onPurchaseStarted'];
    onPurchaseCompleted?: EventHandlers['onPurchaseCompleted'];
    onPurchaseFailed?: EventHandlers['onPurchaseFailed'];
    onRestoreStarted?: EventHandlers['onRestoreStarted'];
    onPaywallShown?: EventHandlers['onPaywallShown'];
    onWebPaymentNavigationFinished?: EventHandlers['onWebPaymentNavigationFinished'];
    onRestoreCompleted?: EventHandlers['onRestoreCompleted'];
    onRestoreFailed?: EventHandlers['onRestoreFailed'];
    onRenderingFailed?: EventHandlers['onRenderingFailed'];
    onLoadingProductsFailed?: EventHandlers['onLoadingProductsFailed'];
    onCustomAction?: EventHandlers['onCustomAction'];
    onUrlPress?: EventHandlers['onUrlPress'];
};
/**
 * React component that renders a native paywall view.
 *
 * @remarks
 * Accepts a paywall object and optional event handler props.
 * Under the hood, it creates a native view and subscribes to paywall events.
 *
 * @see {@link AdaptyPaywallViewProps} for available props
 * @public
 */
export declare const AdaptyPaywallView: React.NamedExoticComponent<AdaptyPaywallViewProps>;
//# sourceMappingURL=AdaptyPaywallView.d.ts.map