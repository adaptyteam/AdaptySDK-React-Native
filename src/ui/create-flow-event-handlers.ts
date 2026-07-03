import { FlowViewEmitter } from './flow-view-emitter';
import { DEFAULT_FLOW_EVENT_HANDLERS, FlowEventHandlers } from './types';

/**
 * Creates and configures event handlers for a flow view without using the controller class.
 * Returns a function that unsubscribes all listeners.
 * @private
 */
export function createFlowEventHandlers(
  eventHandlers: Partial<FlowEventHandlers>,
  viewId: string,
  onRequestClose?: () => Promise<void>,
): () => void {
  const finalEventHandlers: Partial<FlowEventHandlers> = {
    ...DEFAULT_FLOW_EVENT_HANDLERS,
    ...eventHandlers,
  };

  const requestClose: () => Promise<void> = onRequestClose ?? (async () => {});
  const viewEmitter = new FlowViewEmitter(viewId);

  Object.keys(finalEventHandlers).forEach(eventStr => {
    const event = eventStr as keyof FlowEventHandlers;
    if (!finalEventHandlers.hasOwnProperty(event)) {
      return;
    }
    const handler = finalEventHandlers[
      event
    ] as FlowEventHandlers[keyof FlowEventHandlers];
    viewEmitter.addListener(event, handler, requestClose);
  });

  return () => viewEmitter.removeAllListeners();
}
