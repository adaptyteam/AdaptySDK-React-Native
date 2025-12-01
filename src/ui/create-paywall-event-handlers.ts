import { ViewEmitter } from './view-emitter';
import { DEFAULT_EVENT_HANDLERS, EventHandlers } from './types';

/**
 * Creates and configures event handlers for a paywall view without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
export function createPaywallEventHandlers(
  eventHandlers: Partial<EventHandlers>,
  viewId: string,
  onRequestClose?: () => Promise<void>,
): () => void {
  const finalEventHandlers: Partial<EventHandlers> = {
    ...DEFAULT_EVENT_HANDLERS,
    ...eventHandlers,
  };

  const requestClose: () => Promise<void> = onRequestClose ?? (async () => {});
  const viewEmitter = new ViewEmitter(viewId);

  Object.keys(finalEventHandlers).forEach(eventStr => {
    const event = eventStr as keyof EventHandlers;
    if (!finalEventHandlers.hasOwnProperty(event)) {
      return;
    }
    const handler = finalEventHandlers[
      event
    ] as EventHandlers[keyof EventHandlers];
    viewEmitter.addListener(event, handler, requestClose);
  });

  return () => viewEmitter.removeAllListeners();
}
