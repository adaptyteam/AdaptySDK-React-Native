import {
  RefObject,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { createFlowEventHandlers } from './create-flow-event-handlers';
import { DEFAULT_FLOW_EVENT_HANDLERS, FlowEventHandlers } from './types';

/**
 * Subscribes to native flow events for `viewId` once per view, reading the
 * handlers of the last commit so callback identity changes don't churn the
 * native listeners. Re-subscribes only when `viewId` changes. Omitted handlers
 * fall back to {@link DEFAULT_FLOW_EVENT_HANDLERS}.
 *
 * Subscribes in the layout phase, before native setup, so early native events
 * are not lost.
 *
 * Returns the id of the last committed render (`null` after unmount or while
 * hidden by `<Activity>`). On updates of a visible view it is published before
 * the commit's layout effects; on first mount and on `<Activity>` show, in this
 * hook's own layout effect.
 *
 * @internal
 */
export function useFlowEventSubscription(
  handlers: Partial<FlowEventHandlers>,
  viewId: string,
): RefObject<string | null> {
  const handlersRef = useRef<Partial<FlowEventHandlers> | null>(null);
  const committedIdRef = useRef<string | null>(null);
  // Latest committed values, kept while hidden to restore on <Activity> show
  const latestRef = useRef({ handlers, viewId });
  const visibleRef = useRef(false);
  // Updates of a visible view: published at commit (never from a render that
  // may not commit) before any layout effect, so earlier siblings see the new id
  useInsertionEffect(() => {
    latestRef.current = { handlers, viewId };
    if (!visibleRef.current) return;
    handlersRef.current = handlers;
    committedIdRef.current = viewId;
  });
  // Insertion effects don't re-run on <Activity> show: restore here; clear only
  // on unmount or hide, a per-commit cleanup would null them mid-commit
  useLayoutEffect(() => {
    visibleRef.current = true;
    handlersRef.current = latestRef.current.handlers;
    committedIdRef.current = latestRef.current.viewId;
    return () => {
      visibleRef.current = false;
      handlersRef.current = null;
      committedIdRef.current = null;
    };
  }, []);

  // Built once (stable identity) so the effect never re-subscribes on callback
  // changes; each wrapper reads the committed handler from the ref, else the
  // default. (DEFAULT has 21 keys; onAndroidSystemBack/onDisappeared aren't
  // props, so their wrappers always use the default.)
  const stableHandlers = useMemo<Partial<FlowEventHandlers>>(() => {
    const wrappers: Record<string, (...args: unknown[]) => unknown> = {};

    (
      Object.keys(DEFAULT_FLOW_EVENT_HANDLERS) as (keyof FlowEventHandlers)[]
    ).forEach(key => {
      wrappers[key] = (...args: unknown[]): unknown => {
        const handler =
          handlersRef.current?.[key] ?? DEFAULT_FLOW_EVENT_HANDLERS[key];
        return (handler as (...handlerArgs: unknown[]) => unknown)(...args);
      };
    });

    return wrappers as unknown as Partial<FlowEventHandlers>;
  }, []);

  useLayoutEffect(
    () => createFlowEventHandlers(stableHandlers, viewId),
    [viewId, stableHandlers],
  );

  return committedIdRef;
}
