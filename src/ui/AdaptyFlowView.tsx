import React, { memo, useEffect, useMemo, useRef } from 'react';
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
  /**
   * Flow (paywall) object to render.
   *
   * @remarks
   * Encoded and serialized to JSON (`flowJson`) before it is handed to the
   * native view. Keep the reference stable across renders (e.g. memoized or
   * held in state) — a new object identity re-runs the coder and
   * `JSON.stringify` on every render.
   */
  flow: AdaptyFlow;
  /**
   * Optional parameters for the flow view.
   *
   * @remarks
   * Merged with defaults, then encoded and serialized into `flowJson`
   * alongside `flow`. Prefer a referentially stable / memoized object — an
   * inline `{...}` literal is a new reference each render and forces
   * re-encoding.
   */
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
  onRequestPermission?: FlowEventHandlers['onRequestPermission'];
};

const NativeAdaptyFlowView = shouldEnableMock()
  ? AdaptyFlowViewMock
  : requireNativeComponent<NativeAdaptyFlowViewProps>('AdaptyFlowView');

/**
 * Returns a view id that stays stable for the lifetime of the component
 * instance and only changes when `flowId` changes.
 *
 * @remarks
 * Unlike `useMemo` — which React is allowed to discard and recompute at any
 * time — this keeps the generated id in a ref, making the value a true
 * semantic guarantee rather than a best-effort cache. The id is handed to the
 * native view and used to correlate emitted events back to this view, so
 * regenerating it mid-lifecycle would desync the JS event subscriptions from
 * the native view.
 */
function useStableViewId(flowId: string): string {
  const ref = useRef<{ flowId: string; viewId: string } | null>(null);
  if (ref.current === null || ref.current.flowId !== flowId) {
    ref.current = { flowId, viewId: `${flowId}_${generateId()}` };
  }
  return ref.current.viewId;
}

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
  onRequestPermission,
  ...rest
}) => {
  const uniqueViewId = useStableViewId(flow.id);

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
        onRequestPermission,
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
      onRequestPermission,
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

AdaptyFlowView.displayName = 'AdaptyFlowView';
