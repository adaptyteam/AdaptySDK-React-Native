import type { AdaptyFlowMessage } from '@adapty/core';
import { LogContext } from '@/logger';
import { $bridge } from '@/bridge';
import { Req } from '@/types/schema';
import { generateId } from '@/utils';

/**
 * Throws the error for a view-addressed call that has no native view id.
 * @internal
 */
export function errNoViewReference(): never {
  throw new Error('View reference not found');
}

/**
 * Sends `adapty_ui_send_app_message` to the flow view `id` (modal controller
 * or embedded view). Rejects without a bridge call when `id` is `null`.
 * @internal
 */
export async function sendAppMessageRequest(
  id: string | null,
  payload: AdaptyFlowMessage,
): Promise<void> {
  const ctx = new LogContext();

  const messageId = generateId();
  const log = ctx.call({ methodName: 'sendAppMessage' });
  log.start(() => ({ _id: id, messageId }));

  if (id === null) {
    log.failed(() => ({ error: 'no id' }));
    throw errNoViewReference();
  }

  const methodKey = 'adapty_ui_send_app_message';
  const body = JSON.stringify({
    method: methodKey,
    id,
    message_id: messageId,
    payload,
  } satisfies Req['AdaptyUISendAppMessage.Request']);

  try {
    // Bridge returns raw `true` for Void, do not leak it
    const result = await $bridge.request(methodKey, body, 'Void', ctx);
    log.success(() => ({ result }));
  } catch (error) {
    // Same as FlowViewController.handle: a handled error is logged as success
    log.success(() => ({ error }));
    throw error;
  }
}
