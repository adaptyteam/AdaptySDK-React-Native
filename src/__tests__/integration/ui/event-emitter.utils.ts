import { $bridge } from '@/bridge';

/**
 * Emits mock onboarding close event for testing
 */
export function emitOnboardingCloseEvent(
  viewId: string,
  actionId: string,
  meta: {
    onboardingId: string;
    screenClientId: string;
    screenIndex: number;
    totalScreens: number;
  },
): void {
  const bridge = $bridge.testBridge;

  if (!bridge) {
    throw new Error('Bridge not initialized');
  }

  const emitter = (bridge as any).testEmitter;

  if (!emitter) {
    throw new Error(
      'Mock emitter not available. Ensure mock mode is enabled.',
    );
  }

  const payload = {
    id: 'onboarding_on_close_action',
    view: { id: viewId },
    action_id: actionId,
    meta: {
      onboarding_id: meta.onboardingId,
      screen_cid: meta.screenClientId,
      screen_index: meta.screenIndex,
      total_screens: meta.totalScreens,
    },
  };

  // Native events are emitted as JSON strings
  emitter.emit('onboarding_on_close_action', JSON.stringify(payload));
}

