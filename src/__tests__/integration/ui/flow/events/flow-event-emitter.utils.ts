import { $bridge } from '@/bridge';

/**
 * Flow Event Emitters for Testing
 *
 * These functions emit mock native flow events in the correct format (snake_case)
 * to test event handling in FlowViewController.
 */

/**
 * Emits mock flow product selected event for testing
 */
export function emitFlowProductSelectedEvent(
  viewId: string,
  productId: string,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_select_product',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    product_id: productId,
  };

  emitter.emit('flow_view_did_select_product', JSON.stringify(payload));
}

/**
 * Emits mock flow user action event for testing
 * Universal function for close/system_back/open_url/custom actions
 *
 * For `open_url`, `openIn` defaults to `'browser_in_app'` (matches native default).
 */
export function emitFlowUserActionEvent(
  viewId: string,
  actionType: 'close' | 'system_back' | 'open_url' | 'custom',
  actionValue: string | undefined,
  view: { id: string; placement_id: string; variation_id: string },
  openIn: 'browser_in_app' | 'browser_out_app' = 'browser_in_app',
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const action: Record<string, any> = {
    type: actionType,
  };

  if (actionValue !== undefined) {
    action['value'] = actionValue;
  }

  if (actionType === 'open_url') {
    action['open_in'] = openIn;
  }

  const payload = {
    id: 'flow_view_did_perform_action',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    action,
  };

  emitter.emit('flow_view_did_perform_action', JSON.stringify(payload));
}

/**
 * Emits mock flow purchase started event for testing
 */
export function emitFlowPurchaseStartedEvent(
  viewId: string,
  product: Record<string, any>,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_start_purchase',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    product,
  };

  emitter.emit('flow_view_did_start_purchase', JSON.stringify(payload));
}

/**
 * Emits mock flow purchase completed event for testing
 */
export function emitFlowPurchaseCompletedEvent(
  viewId: string,
  purchasedResult: Record<string, any>,
  product: Record<string, any>,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_finish_purchase',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    purchased_result: purchasedResult,
    product,
  };

  emitter.emit('flow_view_did_finish_purchase', JSON.stringify(payload));
}

/**
 * Emits mock flow purchase failed event for testing
 */
export function emitFlowPurchaseFailedEvent(
  viewId: string,
  error: { adapty_code: number; message: string },
  product: Record<string, any>,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_fail_purchase',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
    product,
  };

  emitter.emit('flow_view_did_fail_purchase', JSON.stringify(payload));
}

/**
 * Emits mock flow restore started event for testing
 */
export function emitFlowRestoreStartedEvent(
  viewId: string,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_start_restore',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  emitter.emit('flow_view_did_start_restore', JSON.stringify(payload));
}

/**
 * Emits mock flow restore completed event for testing
 */
export function emitFlowRestoreCompletedEvent(
  viewId: string,
  profile: Record<string, any>,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_finish_restore',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    profile,
  };

  emitter.emit('flow_view_did_finish_restore', JSON.stringify(payload));
}

/**
 * Emits mock flow restore failed event for testing
 */
export function emitFlowRestoreFailedEvent(
  viewId: string,
  error: { adapty_code: number; message: string },
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_fail_restore',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
  };

  emitter.emit('flow_view_did_fail_restore', JSON.stringify(payload));
}

/**
 * Emits mock flow view appeared event for testing
 */
export function emitFlowViewAppearedEvent(
  viewId: string,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_appear',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  emitter.emit('flow_view_did_appear', JSON.stringify(payload));
}

/**
 * Emits mock flow view disappeared event for testing
 */
export function emitFlowViewDisappearedEvent(
  viewId: string,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_disappear',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  emitter.emit('flow_view_did_disappear', JSON.stringify(payload));
}

/**
 * Emits mock flow web payment navigation finished event for testing
 */
export function emitFlowWebPaymentNavigationFinishedEvent(
  viewId: string,
  product: Record<string, any> | undefined,
  error: { adapty_code: number; message: string } | undefined,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload: Record<string, any> = {
    id: 'flow_view_did_finish_web_payment_navigation',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  if (product !== undefined) {
    payload['product'] = product;
  }

  if (error !== undefined) {
    payload['error'] = error;
  }

  emitter.emit(
    'flow_view_did_finish_web_payment_navigation',
    JSON.stringify(payload),
  );
}

/**
 * Emits mock flow rendering failed event for testing
 */
export function emitFlowRenderingFailedEvent(
  viewId: string,
  error: { adapty_code: number; message: string },
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_receive_error',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
  };

  emitter.emit('flow_view_did_receive_error', JSON.stringify(payload));
}

/**
 * Emits mock flow loading products failed event for testing
 */
export function emitFlowLoadingProductsFailedEvent(
  viewId: string,
  error: { adapty_code: number; message: string },
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_fail_loading_products',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
  };

  emitter.emit('flow_view_did_fail_loading_products', JSON.stringify(payload));
}

/**
 * Emits mock flow analytic event for testing
 */
export function emitFlowAnalyticEvent(
  viewId: string,
  name: string,
  params: Record<string, unknown>,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_receive_analytic_event',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    name,
    params,
  };

  emitter.emit('flow_view_did_receive_analytic_event', JSON.stringify(payload));
}

/**
 * Emits mock flow app review request event for testing
 */
export function emitFlowAppReviewEvent(
  viewId: string,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_request_app_review',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  emitter.emit('flow_view_did_request_app_review', JSON.stringify(payload));
}

/**
 * Emits mock flow ask-permission event for testing
 */
export function emitFlowAskPermissionEvent(
  viewId: string,
  eventId: string,
  permission: string,
  customArgs: Record<string, string>,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_did_ask_permission',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    event_id: eventId,
    permission,
    custom_args: customArgs,
  };

  emitter.emit('flow_view_did_ask_permission', JSON.stringify(payload));
}

/**
 * Emits mock flow observer purchase-initiated event for testing
 */
export function emitFlowObserverPurchaseInitiatedEvent(
  viewId: string,
  eventId: string,
  product: Record<string, any>,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_observer_did_initiate_purchase',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    event_id: eventId,
    product,
  };

  emitter.emit(
    'flow_view_observer_did_initiate_purchase',
    JSON.stringify(payload),
  );
}

/**
 * Emits mock flow observer restore-initiated event for testing
 */
export function emitFlowObserverRestoreInitiatedEvent(
  viewId: string,
  eventId: string,
  view: { id: string; placement_id: string; variation_id: string },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const payload = {
    id: 'flow_view_observer_did_initiate_restore',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    event_id: eventId,
  };

  emitter.emit(
    'flow_view_observer_did_initiate_restore',
    JSON.stringify(payload),
  );
}
