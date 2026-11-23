import React, {
  forwardRef,
  memo,
  useId,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { ViewProps } from 'react-native';
import { AdaptyFlow } from '@/types';
import { coderFactory } from '@/coders/factory';
import { shouldEnableMock } from '@/utils';
import {
  AdaptyFlowMessage,
  CreateFlowViewParamsInput,
  FlowEventHandlers,
} from './types';
import { useFlowEventSubscription } from './use-flow-event-subscription';
import { DEFAULT_PARAMS } from './flow-view-controller';
import { AdaptyFlowViewMock } from './AdaptyFlowView.mock';
import { AdaptyFlowViewHost } from './native-components';
import { sendAppMessageRequest } from './send-app-message';

/**
 * Full default params for the embedded component: the shared
 * {@link DEFAULT_PARAMS} with component-specific overrides applied. Merged
 * once at module load, so the render path only spreads it with the caller's
 * `params`.
 *
 * The embedded component opts out of safe-area paddings by default
 * (the imperative FlowViewController defaults to `true`).
 */
const COMPONENT_DEFAULT_PARAMS: CreateFlowViewParamsInput = {
  ...DEFAULT_PARAMS,
  android: {
    enableSafeArea: false,
  },
};

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
  /**
   * Called when the flow view reports an error.
   *
   * @remarks
   * On iOS also called when the flow configuration fails to load into the
   * view: below iOS 16 with `platformNotSupported` (4001), or with the code
   * and message of the error `createFlowView` would fail with (its `detail`
   * follows the event format). The view then stays empty and the return value
   * is ignored.
   */
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

/**
 * Imperative handle of {@link AdaptyFlowView}.
 * @public
 */
export interface AdaptyFlowViewRef {
  /**
   * Sends a message from the app to the script of this flow (`applicationMsg`).
   *
   * @remarks
   * Addressed to the view configuration of the last committed render, fixed at
   * call time. Send from `onAppeared` or later when the script must handle it:
   * before the native view registered the call rejects.
   *
   * Resolves when native accepted the message, not when the script handled it.
   *
   * @throws {AdaptyError} if native rejects the call (e.g. the native view
   * is not registered yet)
   * @throws {Error} `'View reference not found'` (a plain `Error`, without a
   * bridge call) after the component unmounted
   */
  sendAppMessage(payload: AdaptyFlowMessage): Promise<void>;
}

const NativeAdaptyFlowView = shouldEnableMock()
  ? AdaptyFlowViewMock
  : AdaptyFlowViewHost;

const AdaptyFlowViewComponent = (
  {
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
  }: AdaptyFlowViewProps,
  ref: React.ForwardedRef<AdaptyFlowViewRef>,
) => {
  const reactId = useId();

  // Value-stable key: avoids re-encoding when params is an inline object (wrong usage).
  const paramsKey = JSON.stringify(params ?? {});

  const flowJson = useMemo(() => {
    const encodedFlow = coderFactory.createFlowCoder().encode(flow);
    const paramsWithDefaults = {
      ...COMPONENT_DEFAULT_PARAMS,
      ...params,
    };
    const encodedParams = coderFactory
      .createUiCreateFlowViewParamsCoder()
      .encode(paramsWithDefaults);
    return JSON.stringify({ flow: encodedFlow, ...encodedParams });
    // params is tracked by value via paramsKey
  }, [flow, paramsKey]);

  // A new configuration gets a new id: native viewId and host key. Updated
  // during render (not via a ref), so an uncommitted render can't shift seq
  const [configuration, setConfiguration] = useState(() => ({
    key: flowJson,
    seq: 0,
  }));
  let seq = configuration.seq;
  if (configuration.key !== flowJson) {
    seq = configuration.seq + 1;
    setConfiguration({ key: flowJson, seq });
  }
  const viewId = `${flow.id}_${reactId}:${seq}`;

  const committedIdRef = useFlowEventSubscription(
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
    viewId,
  );

  // Stable handle; the target id is read at call time
  useImperativeHandle(
    ref,
    () => ({
      sendAppMessage: payload =>
        sendAppMessageRequest(committedIdRef.current, payload),
    }),
    [],
  );

  return (
    <NativeAdaptyFlowView
      {...rest}
      key={viewId}
      viewId={viewId}
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
 * To learn which localization the view was actually rendered with, read
 * `view.locale` in `onAppeared`. It is the localization the view was actually
 * built with, which may differ from the one requested through `params.locale`
 * if it is not available in the flow:
 *
 * ```tsx
 * <AdaptyFlowView
 *   flow={flow}
 *   params={{ locale: 'es' }}
 *   onAppeared={view => setUiLocale(view.locale)}
 * />
 * ```
 *
 * Pass a ref to send messages to the flow script, see {@link AdaptyFlowViewRef}.
 *
 * A change of `flow` or `params` (compared by encoded value) is a new view
 * configuration: the native view is remounted with a new view id.
 *
 * @see {@link AdaptyFlowViewProps} for available props
 * @public
 */
export const AdaptyFlowView = memo(forwardRef(AdaptyFlowViewComponent));

AdaptyFlowView.displayName = 'AdaptyFlowView';
