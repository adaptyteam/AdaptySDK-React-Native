import React from 'react';
import { ViewProps } from 'react-native';
import { AdaptyPaywall } from '../types';
import { CreatePaywallViewParamsInput, EventHandlers } from './types';
export type Props = ViewProps & {
    paywall: AdaptyPaywall;
    params?: CreatePaywallViewParamsInput;
    onCloseButtonPress?: EventHandlers['onCloseButtonPress'];
    onAndroidSystemBack?: EventHandlers['onAndroidSystemBack'];
    onProductSelected?: EventHandlers['onProductSelected'];
    onPurchaseStarted?: EventHandlers['onPurchaseStarted'];
    onPurchaseCompleted?: EventHandlers['onPurchaseCompleted'];
    onPurchaseFailed?: EventHandlers['onPurchaseFailed'];
    onRestoreStarted?: EventHandlers['onRestoreStarted'];
    onPaywallClosed?: EventHandlers['onPaywallClosed'];
    onPaywallShown?: EventHandlers['onPaywallShown'];
    onWebPaymentNavigationFinished?: EventHandlers['onWebPaymentNavigationFinished'];
    onRestoreCompleted?: EventHandlers['onRestoreCompleted'];
    onRestoreFailed?: EventHandlers['onRestoreFailed'];
    onRenderingFailed?: EventHandlers['onRenderingFailed'];
    onLoadingProductsFailed?: EventHandlers['onLoadingProductsFailed'];
    onCustomAction?: EventHandlers['onCustomAction'];
    onUrlPress?: EventHandlers['onUrlPress'];
};
export declare const AdaptyPaywallView: React.NamedExoticComponent<Props>;
//# sourceMappingURL=AdaptyPaywallView.d.ts.map