import { $bridge } from '@/bridge';
import { OnboardingStateUpdatedAction } from '@/ui/types';
import { AdaptyNativeErrorCoder } from '@/coders/adapty-native-error';
import { AdaptyUiOnboardingStateParamsCoder } from '@/coders/adapty-ui-onboarding-state-params';

/**
 * Emits mock onboarding close event for testing
 */
export function emitOnboardingCloseEvent(
  viewId: string,
  actionId: string,
  meta: {
    onboarding_id: string;
    screen_cid: string;
    screen_index: number;
    total_screens: number;
  },
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
    id: 'onboarding_on_close_action',
    view: { id: viewId },
    action_id: actionId,
    meta: {
      onboarding_id: meta.onboarding_id,
      screen_cid: meta.screen_cid,
      screen_index: meta.screen_index,
      total_screens: meta.total_screens,
    },
  };

  // Native events are emitted as JSON strings
  emitter.emit('onboarding_on_close_action', JSON.stringify(payload));
}

/**
 * Emits mock onboarding analytics event for testing
 */
export function emitOnboardingAnalyticsEvent(
  viewId: string,
  event: {
    name: string;
    element_id?: string;
    reply?: string;
  },
  meta: {
    onboarding_id: string;
    screen_cid: string;
    screen_index: number;
    total_screens: number;
  },
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
    id: 'onboarding_on_analytics_action',
    view: { id: viewId },
    event: {
      name: event.name,
    },
    meta: {
      onboarding_id: meta.onboarding_id,
      screen_cid: meta.screen_cid,
      screen_index: meta.screen_index,
      total_screens: meta.total_screens,
    },
  };

  if (event.element_id !== undefined) {
    payload['event']['element_id'] = event.element_id;
  }

  if (event.reply !== undefined) {
    payload['event']['reply'] = event.reply;
  }

  emitter.emit('onboarding_on_analytics_action', JSON.stringify(payload));
}

/**
 * Emits mock onboarding state updated event for testing
 */
export function emitOnboardingStateUpdatedEvent(
  viewId: string,
  action: OnboardingStateUpdatedAction,
  meta: {
    onboarding_id: string;
    screen_cid: string;
    screen_index: number;
    total_screens: number;
  },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  // Encode action to native format (snake_case) manually
  const paramCoder = new AdaptyUiOnboardingStateParamsCoder();
  let encodedAction: Record<string, any> = {
    element_id: action.elementId,
    element_type: action.elementType,
  };

  switch (action.elementType) {
    case 'select':
      encodedAction['value'] = paramCoder.encode(action.value);
      break;
    case 'multi_select':
      encodedAction['value'] = action.value.map(v => paramCoder.encode(v));
      break;
    case 'input':
    case 'date_picker':
      encodedAction['value'] = action.value;
      break;
  }

  const payload = {
    id: 'onboarding_on_state_updated_action',
    view: { id: viewId },
    action: encodedAction,
    meta: {
      onboarding_id: meta.onboarding_id,
      screen_cid: meta.screen_cid,
      screen_index: meta.screen_index,
      total_screens: meta.total_screens,
    },
  };

  emitter.emit('onboarding_on_state_updated_action', JSON.stringify(payload));
}

/**
 * Emits mock onboarding finished loading event for testing
 */
export function emitOnboardingFinishedLoadingEvent(
  viewId: string,
  meta: {
    onboarding_id: string;
    screen_cid: string;
    screen_index: number;
    total_screens: number;
  },
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
    id: 'onboarding_did_finish_loading',
    view: { id: viewId },
    meta: {
      onboarding_id: meta.onboarding_id,
      screen_cid: meta.screen_cid,
      screen_index: meta.screen_index,
      total_screens: meta.total_screens,
    },
  };

  emitter.emit('onboarding_did_finish_loading', JSON.stringify(payload));
}

/**
 * Emits mock onboarding paywall action event for testing
 */
export function emitOnboardingPaywallEvent(
  viewId: string,
  actionId: string,
  meta: {
    onboarding_id: string;
    screen_cid: string;
    screen_index: number;
    total_screens: number;
  },
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
    id: 'onboarding_on_paywall_action',
    view: { id: viewId },
    action_id: actionId,
    meta: {
      onboarding_id: meta.onboarding_id,
      screen_cid: meta.screen_cid,
      screen_index: meta.screen_index,
      total_screens: meta.total_screens,
    },
  };

  emitter.emit('onboarding_on_paywall_action', JSON.stringify(payload));
}

/**
 * Emits mock onboarding custom action event for testing
 */
export function emitOnboardingCustomEvent(
  viewId: string,
  actionId: string,
  meta: {
    onboarding_id: string;
    screen_cid: string;
    screen_index: number;
    total_screens: number;
  },
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
    id: 'onboarding_on_custom_action',
    view: { id: viewId },
    action_id: actionId,
    meta: {
      onboarding_id: meta.onboarding_id,
      screen_cid: meta.screen_cid,
      screen_index: meta.screen_index,
      total_screens: meta.total_screens,
    },
  };

  emitter.emit('onboarding_on_custom_action', JSON.stringify(payload));
}

/**
 * Emits mock onboarding error event for testing
 */
export function emitOnboardingErrorEvent(
  viewId: string,
  error: {
    adaptyCode: number;
    message: string;
    detail?: string;
  },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error('Mock emitter not available. Ensure mock mode is enabled.');
  }

  const errorCoder = new AdaptyNativeErrorCoder();
  const encodedError = errorCoder.encode({
    adaptyCode: error.adaptyCode,
    message: error.message,
    detail: error.detail,
  } as any);

  const payload = {
    id: 'onboarding_did_fail_with_error',
    view: { id: viewId },
    error: encodedError,
  };

  emitter.emit('onboarding_did_fail_with_error', JSON.stringify(payload));
}
