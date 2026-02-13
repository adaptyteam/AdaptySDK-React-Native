import React, { memo, useEffect, useMemo } from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import { AdaptyPaywall } from '@/types';
import { coderFactory } from '@/coders/factory';
import { generateId, shouldEnableMock } from '@/utils';
import {
  CreatePaywallViewParamsInput,
  EventHandlers,
  NativeAdaptyPaywallViewProps,
} from './types';
import { createPaywallEventHandlers } from './create-paywall-event-handlers';
import { DEFAULT_PARAMS } from './view-controller';
import { AdaptyPaywallViewMock } from './AdaptyPaywallView.mock';
import { filterUndefined } from '@adapty/core';

export type Props = ViewProps & {
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

const NativeAdaptyPaywallView = shouldEnableMock()
  ? AdaptyPaywallViewMock
  : requireNativeComponent<NativeAdaptyPaywallViewProps>('AdaptyPaywallView');

const AdaptyPaywallViewComponent: React.FC<Props> = ({
  paywall,
  params,
  onCloseButtonPress,
  onProductSelected,
  onPurchaseStarted,
  onPurchaseCompleted,
  onPurchaseFailed,
  onRestoreStarted,
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
    const encodedPaywall = coderFactory.createPaywallCoder().encode(paywall);
    const paramsWithDefaults = { ...DEFAULT_PARAMS, ...params };
    const encodedParams = coderFactory
      .createUiCreatePaywallViewParamsCoder()
      .encode(paramsWithDefaults);
    return JSON.stringify({ paywall: encodedPaywall, ...encodedParams });
  }, [paywall, params]);

  const eventHandlers = useMemo(
    (): Partial<EventHandlers> =>
      filterUndefined({
        onCloseButtonPress,
        onProductSelected,
        onPurchaseStarted,
        onPurchaseCompleted,
        onPurchaseFailed,
        onRestoreStarted,
        onPaywallShown,
        onWebPaymentNavigationFinished,
        onRestoreCompleted,
        onRestoreFailed,
        onRenderingFailed,
        onLoadingProductsFailed,
        onCustomAction,
        onUrlPress,
      }),
    [
      onCloseButtonPress,
      onProductSelected,
      onPurchaseStarted,
      onPurchaseCompleted,
      onPurchaseFailed,
      onRestoreStarted,
      onPaywallShown,
      onWebPaymentNavigationFinished,
      onRestoreCompleted,
      onRestoreFailed,
      onRenderingFailed,
      onLoadingProductsFailed,
      onCustomAction,
      onUrlPress,
    ],
  );

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
