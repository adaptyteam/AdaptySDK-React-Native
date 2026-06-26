import { useEffect, useMemo, useRef } from 'react';
import { createFlowEventHandlers } from './create-flow-event-handlers';
import { DEFAULT_FLOW_EVENT_HANDLERS, FlowEventHandlers } from './types';

/**
 * Subscribes to native flow events for `viewId` once per view, reading the
 * latest handlers via a ref so callback identity changes don't churn the
 * native listeners. Re-subscribes only when `viewId` changes. Omitted handlers
 * fall back to {@link DEFAULT_FLOW_EVENT_HANDLERS}.
 *
 * @internal
 */
export function useFlowEventSubscription(
  handlers: Partial<FlowEventHandlers>,
  viewId: string,
): void {
  // Latest-ref: refreshed each render so wrappers read current callbacks
  // without re-subscribing (native events only fire post-commit).
  const handlersRef = useRef<Partial<FlowEventHandlers>>(handlers);
  handlersRef.current = handlers;

  // Built once (stable identity) so the effect never re-subscribes on callback
  // changes; each wrapper reads the freshest handler from the ref, else the
  // default. (DEFAULT has 21 keys; onAndroidSystemBack/onDisappeared aren't
  // props, so their wrappers always use the default.)
  const stableHandlers = useMemo<Partial<FlowEventHandlers>>(() => {
    const wrappers: Record<string, (...args: unknown[]) => unknown> = {};

    (
      Object.keys(DEFAULT_FLOW_EVENT_HANDLERS) as (keyof FlowEventHandlers)[]
    ).forEach(key => {
      wrappers[key] = (...args: unknown[]): unknown => {
        const handler =
          handlersRef.current[key] ?? DEFAULT_FLOW_EVENT_HANDLERS[key];
        return (handler as (...handlerArgs: unknown[]) => unknown)(...args);
      };
    });

    return wrappers as unknown as Partial<FlowEventHandlers>;
  }, []);

  useEffect(
    () => createFlowEventHandlers(stableHandlers, viewId),
    [viewId, stableHandlers],
  );
}
