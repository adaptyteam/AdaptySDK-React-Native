import React, { memo, useId, useMemo } from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';
import { AdaptyFlow } from '@/types';
import { coderFactory } from '@/coders/factory';
import { shouldEnableMock } from '@/utils';
import {
  CreateFlowViewParamsInput,
  FlowEventHandlers,
  NativeAdaptyFlowViewProps,
} from './types';
import { useFlowEventSubscription } from './use-flow-event-subscription';
import { DEFAULT_PARAMS } from './flow-view-controller';
import { AdaptyFlowViewMock } from './AdaptyFlowView.mock';

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
   * alongside `flow`.
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
  onObserverPurchaseInitiated?: FlowEventHandlers['onObserverPurchaseInitiated'];
  onObserverRestoreInitiated?: FlowEventHandlers['onObserverRestoreInitiated'];
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
  onRequestPermission,
  onObserverPurchaseInitiated,
  onObserverRestoreInitiated,
  ...rest
}) => {
  const reactId = useId();
  const uniqueViewId = `${flow.id}_${reactId}`;

  // Value-stable key: avoids re-encoding when params is an inline object (wrong usage).
  const paramsKey = JSON.stringify(params ?? {});

  const flowJson = useMemo(() => {
    const encodedFlow = coderFactory.createFlowCoder().encode(flow);
    const paramsWithDefaults = { ...DEFAULT_PARAMS, ...params };
    const encodedParams = coderFactory
      .createUiCreateFlowViewParamsCoder()
      .encode(paramsWithDefaults);
    return JSON.stringify({ flow: encodedFlow, ...encodedParams });
    // params is tracked by value via paramsKey
  }, [flow, paramsKey]);

  useFlowEventSubscription(
    {
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
      onObserverPurchaseInitiated,
      onObserverRestoreInitiated,
    },
    uniqueViewId,
  );

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
 * The view is embedded in your React tree, so its lifecycle is controlled by
 * your app — not by the SDK. Event handlers still run (and their side effects
 * apply), but the boolean they return does NOT dismiss the embedded view: that
 * "close" flag only applies to the imperative view created via
 * {@link createFlowView}. To dismiss the embedded view, stop rendering it
 * (e.g. flip state in `onCloseButtonPress`):
 *
 * ```tsx
 * const [visible, setVisible] = useState(true);
 * const onCloseButtonPress = useCallback(() => {
 *   setVisible(false); // unmount to dismiss; return value is ignored here
 * }, []);
 * return visible ? (
 *   <AdaptyFlowView flow={flow} onCloseButtonPress={onCloseButtonPress} />
 * ) : null;
 * ```
 *
 * @see {@link AdaptyFlowViewProps} for available props
 * @public
 */
export const AdaptyFlowView = memo(AdaptyFlowViewComponent);

AdaptyFlowView.displayName = 'AdaptyFlowView';
