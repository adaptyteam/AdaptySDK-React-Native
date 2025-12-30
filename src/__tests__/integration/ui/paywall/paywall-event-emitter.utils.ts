import { $bridge } from '@/bridge';

/**
 * Paywall Event Emitters for Testing
 *
 * These functions emit mock native paywall events in the correct format (snake_case)
 * to test event handling in PaywallViewController.
 */

/**
 * Emits mock paywall product selected event for testing
 */
export function emitPaywallProductSelectedEvent(
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
    id: 'paywall_view_did_select_product',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    product_id: productId,
  };

  emitter.emit('paywall_view_did_select_product', JSON.stringify(payload));
}

/**
 * Emits mock paywall user action event for testing
 * Universal function for close/system_back/open_url/custom actions
 */
export function emitPaywallUserActionEvent(
  viewId: string,
  actionType: 'close' | 'system_back' | 'open_url' | 'custom',
  actionValue: string | undefined,
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

  const action: Record<string, any> = {
    type: actionType,
  };

  if (actionValue !== undefined) {
    action['value'] = actionValue;
  }

  const payload = {
    id: 'paywall_view_did_perform_action',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    action,
  };

  emitter.emit('paywall_view_did_perform_action', JSON.stringify(payload));
}

/**
 * Emits mock paywall purchase started event for testing
 */
export function emitPaywallPurchaseStartedEvent(
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
    id: 'paywall_view_did_start_purchase',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    product,
  };

  emitter.emit('paywall_view_did_start_purchase', JSON.stringify(payload));
}

/**
 * Emits mock paywall purchase completed event for testing
 */
export function emitPaywallPurchaseCompletedEvent(
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
    id: 'paywall_view_did_finish_purchase',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    purchased_result: purchasedResult,
    product,
  };

  emitter.emit('paywall_view_did_finish_purchase', JSON.stringify(payload));
}

/**
 * Emits mock paywall purchase failed event for testing
 */
export function emitPaywallPurchaseFailedEvent(
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
    id: 'paywall_view_did_fail_purchase',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
    product,
  };

  emitter.emit('paywall_view_did_fail_purchase', JSON.stringify(payload));
}

/**
 * Emits mock paywall restore started event for testing
 */
export function emitPaywallRestoreStartedEvent(
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
    id: 'paywall_view_did_start_restore',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  emitter.emit('paywall_view_did_start_restore', JSON.stringify(payload));
}

/**
 * Emits mock paywall restore completed event for testing
 */
export function emitPaywallRestoreCompletedEvent(
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
    id: 'paywall_view_did_finish_restore',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    profile,
  };

  emitter.emit('paywall_view_did_finish_restore', JSON.stringify(payload));
}

/**
 * Emits mock paywall restore failed event for testing
 */
export function emitPaywallRestoreFailedEvent(
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
    id: 'paywall_view_did_fail_restore',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
  };

  emitter.emit('paywall_view_did_fail_restore', JSON.stringify(payload));
}

/**
 * Emits mock paywall view appeared event for testing
 */
export function emitPaywallViewAppearedEvent(
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
    id: 'paywall_view_did_appear',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  emitter.emit('paywall_view_did_appear', JSON.stringify(payload));
}

/**
 * Emits mock paywall view disappeared event for testing
 */
export function emitPaywallViewDisappearedEvent(
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
    id: 'paywall_view_did_disappear',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
  };

  emitter.emit('paywall_view_did_disappear', JSON.stringify(payload));
}

/**
 * Emits mock paywall web payment navigation finished event for testing
 */
export function emitPaywallWebPaymentNavigationFinishedEvent(
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
    id: 'paywall_view_did_finish_web_payment_navigation',
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
    'paywall_view_did_finish_web_payment_navigation',
    JSON.stringify(payload),
  );
}

/**
 * Emits mock paywall rendering failed event for testing
 */
export function emitPaywallRenderingFailedEvent(
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
    id: 'paywall_view_did_fail_rendering',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
  };

  emitter.emit('paywall_view_did_fail_rendering', JSON.stringify(payload));
}

/**
 * Emits mock paywall loading products failed event for testing
 */
export function emitPaywallLoadingProductsFailedEvent(
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
    id: 'paywall_view_did_fail_loading_products',
    view: {
      id: viewId,
      placement_id: view.placement_id,
      variation_id: view.variation_id,
    },
    error,
  };

  emitter.emit(
    'paywall_view_did_fail_loading_products',
    JSON.stringify(payload),
  );
}
