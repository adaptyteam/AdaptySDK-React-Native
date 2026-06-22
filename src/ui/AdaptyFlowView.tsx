import React, { memo, useEffect, useMemo } from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import { AdaptyFlow } from '@/types';
import { coderFactory } from '@/coders/factory';
import { generateId, shouldEnableMock } from '@/utils';
import {
  CreateFlowViewParamsInput,
  FlowEventHandlers,
  NativeAdaptyFlowViewProps,
} from './types';
import { createFlowEventHandlers } from './create-flow-event-handlers';
import { DEFAULT_PARAMS } from './flow-view-controller';
import { AdaptyFlowViewMock } from './AdaptyFlowView.mock';
import { filterUndefined } from '@adapty/core';

/**
 * Props for the {@link AdaptyFlowView} component.
 * @public
 */
export type AdaptyFlowViewProps = ViewProps & {
  flow: AdaptyFlow;
  params?: CreateFlowViewParamsInput;
  onCloseButtonPress?: FlowEventHandlers['onCloseButtonPress'];
  onProductSelected?: FlowEventHandlers['onProductSelected'];
  onPurchaseStarted?: FlowEventHandlers['onPurchaseStarted'];
  onPurchaseCompleted?: FlowEventHandlers['onPurchaseCompleted'];
  onPurchaseFailed?: FlowEventHandlers['onPurchaseFailed'];
  onRestoreStarted?: FlowEventHandlers['onRestoreStarted'];
  onAppeared?: FlowEventHandlers['onAppeared'];
  onWebPaymentNavigationFinished?: FlowEventHandlers['onWebPaymentNavigationFinished'];
  onRestoreCompleted?: FlowEventHandlers['onRestoreCompleted'];
  onRestoreFailed?: FlowEventHandlers['onRestoreFailed'];
  onError?: FlowEventHandlers['onError'];
  onLoadingProductsFailed?: FlowEventHandlers['onLoadingProductsFailed'];
  onCustomAction?: FlowEventHandlers['onCustomAction'];
  onUrlPress?: FlowEventHandlers['onUrlPress'];
  onRequestAppReview?: FlowEventHandlers['onRequestAppReview'];
  onAnalytics?: FlowEventHandlers['onAnalytics'];
};

const NativeAdaptyFlowView = shouldEnableMock()
  ? AdaptyFlowViewMock
  : requireNativeComponent<NativeAdaptyFlowViewProps>('AdaptyFlowView');

const AdaptyFlowViewComponent: React.FC<AdaptyFlowViewProps> = ({
  flow,
  params,
  onCloseButtonPress,
  onProductSelected,
  onPurchaseStarted,
  onPurchaseCompleted,
  onPurchaseFailed,
  onRestoreStarted,
  onAppeared,
  onWebPaymentNavigationFinished,
  onRestoreCompleted,
  onRestoreFailed,
  onError,
  onLoadingProductsFailed,
  onCustomAction,
  onUrlPress,
  onRequestAppReview,
  onAnalytics,
  ...rest
}) => {
  const uniqueViewId = useMemo(() => `${flow.id}_${generateId()}`, [flow.id]);

  const flowJson = useMemo(() => {
    const encodedFlow = coderFactory.createFlowCoder().encode(flow);
    const paramsWithDefaults = { ...DEFAULT_PARAMS, ...params };
    const encodedParams = coderFactory
      .createUiCreateFlowViewParamsCoder()
      .encode(paramsWithDefaults);
    return JSON.stringify({ flow: encodedFlow, ...encodedParams });
  }, [flow, params]);

  const eventHandlers = useMemo(
    (): Partial<FlowEventHandlers> =>
      filterUndefined({
        onCloseButtonPress,
        onProductSelected,
        onPurchaseStarted,
        onPurchaseCompleted,
        onPurchaseFailed,
        onRestoreStarted,
        onAppeared,
        onWebPaymentNavigationFinished,
        onRestoreCompleted,
        onRestoreFailed,
        onError,
        onLoadingProductsFailed,
        onCustomAction,
        onUrlPress,
        onRequestAppReview,
        onAnalytics,
      }),
    [
      onCloseButtonPress,
      onProductSelected,
      onPurchaseStarted,
      onPurchaseCompleted,
      onPurchaseFailed,
      onRestoreStarted,
      onAppeared,
      onWebPaymentNavigationFinished,
      onRestoreCompleted,
      onRestoreFailed,
      onError,
      onLoadingProductsFailed,
      onCustomAction,
      onUrlPress,
      onRequestAppReview,
      onAnalytics,
    ],
  );

  useEffect(() => {
    const unsubscribe = createFlowEventHandlers(eventHandlers, uniqueViewId);
    return unsubscribe;
  }, [uniqueViewId, eventHandlers]);

  return (
    <NativeAdaptyFlowView
      {...rest}
      viewId={uniqueViewId}
      flowJson={flowJson}
    />
  );
};

/**
 * React component that renders a native flow view.
 *
 * @remarks
 * Accepts a flow object and optional event handler props.
 * Under the hood, it creates a native view and subscribes to flow events.
 *
 * @see {@link AdaptyFlowViewProps} for available props
 * @public
 */
export const AdaptyFlowView = memo(AdaptyFlowViewComponent);
