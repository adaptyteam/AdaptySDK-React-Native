import React, { memo, useEffect, useMemo } from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import { AdaptyPaywall } from '@/types';
import { AdaptyPaywallCoder } from '@/coders/adapty-paywall';
import { AdaptyUICreatePaywallViewParamsCoder } from '@/coders';
import { generateId } from '@/utils/generate-id';
import { shouldEnableMock } from '@/utils';
import {
  CreatePaywallViewParamsInput,
  EventHandlers,
  NativeAdaptyPaywallViewProps,
} from './types';
import { createPaywallEventHandlers } from './create-paywall-event-handlers';
import { DEFAULT_PARAMS } from './view-controller';
import { AdaptyPaywallViewMock } from './AdaptyPaywallView.mock';

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

const NativeAdaptyPaywallView = shouldEnableMock()
  ? AdaptyPaywallViewMock
  : requireNativeComponent<NativeAdaptyPaywallViewProps>('AdaptyPaywallView');

const AdaptyPaywallViewComponent: React.FC<Props> = ({
  paywall,
  params,
  onCloseButtonPress,
  onAndroidSystemBack,
  onProductSelected,
  onPurchaseStarted,
  onPurchaseCompleted,
  onPurchaseFailed,
  onRestoreStarted,
  onPaywallClosed,
  onPaywallShown,
  onWebPaymentNavigationFinished,
  onRestoreCompleted,
  onRestoreFailed,
  onRenderingFailed,
  onLoadingProductsFailed,
  onCustomAction,
  onUrlPress,
  ...rest
}) => {
  const uniqueViewId = useMemo(
    () => `${paywall.id}_${generateId()}`,
    [paywall.id],
  );

  const paywallJson = useMemo(() => {
    const encodedPaywall = new AdaptyPaywallCoder().encode(paywall);
    const paramsWithDefaults = { ...DEFAULT_PARAMS, ...params };
    const encodedParams = new AdaptyUICreatePaywallViewParamsCoder().encode(
      paramsWithDefaults,
    );
    return JSON.stringify({ paywall: encodedPaywall, ...encodedParams });
  }, [paywall, params]);

  const eventHandlers = useMemo((): Partial<EventHandlers> => {
    const handlers: Partial<EventHandlers> = {};

    if (onCloseButtonPress) handlers.onCloseButtonPress = onCloseButtonPress;
    if (onAndroidSystemBack) handlers.onAndroidSystemBack = onAndroidSystemBack;
    if (onProductSelected) handlers.onProductSelected = onProductSelected;
    if (onPurchaseStarted) handlers.onPurchaseStarted = onPurchaseStarted;
    if (onPurchaseCompleted) handlers.onPurchaseCompleted = onPurchaseCompleted;
    if (onPurchaseFailed) handlers.onPurchaseFailed = onPurchaseFailed;
    if (onRestoreStarted) handlers.onRestoreStarted = onRestoreStarted;
    if (onPaywallClosed) handlers.onPaywallClosed = onPaywallClosed;
    if (onPaywallShown) handlers.onPaywallShown = onPaywallShown;
    if (onWebPaymentNavigationFinished)
      handlers.onWebPaymentNavigationFinished = onWebPaymentNavigationFinished;
    if (onRestoreCompleted) handlers.onRestoreCompleted = onRestoreCompleted;
    if (onRestoreFailed) handlers.onRestoreFailed = onRestoreFailed;
    if (onRenderingFailed) handlers.onRenderingFailed = onRenderingFailed;
    if (onLoadingProductsFailed)
      handlers.onLoadingProductsFailed = onLoadingProductsFailed;
    if (onCustomAction) handlers.onCustomAction = onCustomAction;
    if (onUrlPress) handlers.onUrlPress = onUrlPress;

    return handlers;
  }, [
    onCloseButtonPress,
    onAndroidSystemBack,
    onProductSelected,
    onPurchaseStarted,
    onPurchaseCompleted,
    onPurchaseFailed,
    onRestoreStarted,
    onPaywallClosed,
    onPaywallShown,
    onWebPaymentNavigationFinished,
    onRestoreCompleted,
    onRestoreFailed,
    onRenderingFailed,
    onLoadingProductsFailed,
    onCustomAction,
    onUrlPress,
  ]);

  useEffect(() => {
    const unsubscribe = createPaywallEventHandlers(eventHandlers, uniqueViewId);
    return unsubscribe;
  }, [uniqueViewId, eventHandlers]);

  return (
    <NativeAdaptyPaywallView
      {...rest}
      viewId={uniqueViewId}
      paywallJson={paywallJson}
    />
  );
};

export const AdaptyPaywallView = memo(AdaptyPaywallViewComponent);
