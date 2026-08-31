import { EmitterSubscription } from 'react-native';
import type { GlobalEventIdType, GlobalEventName } from '@adapty/core';
import { $bridge } from '@/bridge';
import { Log } from '@/logger';

/**
 * A handler an app registers for a global SDK event.
 *
 * @internal
 */
export type BridgeEventHandler<Payload> = (
  payload: Payload,
) => void | Promise<void>;

/**
 * AdaptyBridgeEventEmitter manages handlers for one global bridge event.
 * Handlers are additive - every registered handler receives every payload.
 *
 * @remarks
 * Event emitter wraps the bridge subscription
 * and provides several modifications:
 * - The SDK owns the only subscription, so the event keeps arriving from native
 * - App handlers are local entries, each independently removable
 * - The handler set is snapshotted before dispatch, so a mid-emit subscribe or
 *   unsubscribe only takes effect from the next event
 * - An optional default listener runs when the app registered no handler
 * - Handler failures are logged rather than aborting the dispatch
 *
 * Only the promoted-purchase event uses this today. The other three global
 * events still return the raw bridge subscription from `Adapty.addEventListener`, so
 * `removeAllListeners()` ends them permanently. Moving them here would make them
 * restorable, which is an improvement but a behaviour change, so it belongs in
 * its own change rather than in the refactor that created this class.
 *
 * @internal
 */
export class AdaptyBridgeEventEmitter<Payload> {
  private eventId: GlobalEventIdType;
  private logScope: GlobalEventName;
  private defaultListener?: (payload: Payload) => Promise<unknown> | void;
  private eventListener: EmitterSubscription | null = null;
  private handlers: Set<{ handler: BridgeEventHandler<Payload> }> = new Set();

  /**
   * @param eventId - wire id to subscribe to.
   * @param logScope - the public handler name this event surfaces as. Used for
   * log scoping, deliberately separate from `eventId`: a developer greps for the
   * name they wrote, not the wire id.
   * @param defaultListener - runs when no handler is registered. Optional
   * because most global events are pure notifications with nothing to do in that
   * case. Do your own failure logging inside it - the catch here is only a
   * generic backstop, and only the caller knows what failing means.
   */
  constructor(
    eventId: GlobalEventIdType,
    logScope: GlobalEventName,
    defaultListener?: (payload: Payload) => Promise<unknown> | void,
  ) {
    this.eventId = eventId;
    this.logScope = logScope;
    this.defaultListener = defaultListener;
  }

  /**
   * Subscribes to the native event, once, with this emitter's default listener standing
   * in until the app registers a handler of its own - hence `WithDefault`.
   *
   * What it ultimately drives is React Native's own `startObserving`: both
   * native bridges drop events while JS holds no listener (iOS
   * `guard hasListeners`, Android `if (listenerCount > 0)`), so the SDK must
   * hold one from activation onward or the event is lost rather than queued.
   *
   * Idempotent, so callers may call it on every activation attempt without
   * risking a second live subscription - two would dispatch every event twice.
   * The guard is a plain null check, deliberately not a liveness check:
   * resubscribing would mean remove-then-add, and on Android `removeListeners`
   * decrements the listener count and tears down a profile listener when it
   * reaches zero, without restoring it.
   */
  public addNativeEventListenerWithDefault(): void {
    if (this.eventListener) {
      return;
    }

    this.eventListener = $bridge.addEventListener(
      this.eventId,
      this.createEventHandler(),
    );
  }

  /**
   * Adds an app event handler and returns a subscription that removes just that
   * registration.
   *
   * A fresh wrapper object per call, so registering the same function twice
   * yields two independently removable entries - and a repeated `remove()` is a
   * no-op by set identity rather than by a counter that could drift.
   */
  public addListener(
    handler: BridgeEventHandler<Payload>,
  ): EmitterSubscription {
    const entry = { handler };
    this.handlers.add(entry);

    return {
      remove: () => {
        this.handlers.delete(entry);
      },
    } as EmitterSubscription;
  }

  /**
   * Forgets every app handler and restores this emitter's own subscription.
   *
   * **Call this only immediately after a bridge-wide teardown** - that is,
   * `$bridge.removeAllEventListeners()`, which already removed this subscription
   * along with everything else. Nothing else would put it back: `activate()`
   * runs once per process. Called standalone it would leave the previous live
   * subscription in place and add a second, dispatching every event twice.
   *
   * Deliberately not named `removeAllListeners()` like `FlowViewEmitter`'s:
   * after that one nothing is subscribed, after this one something is.
   *
   * Re-subscribes only if it had been observing. An emitter that never observed
   * must not start here, because `$bridge`'s getters lazily create a bridge, so
   * subscribing as a side effect of a teardown call would install a listener on
   * a bridge that the teardown call itself just lazily created.
   */
  public restoreAfterBridgeTeardown(): void {
    const wasObserving = this.eventListener !== null;

    this.handlers.clear();
    this.eventListener = null;

    if (wasObserving) {
      this.addNativeEventListenerWithDefault();
    }
  }

  private createEventHandler() {
    return (payload: Payload) => {
      // Snapshot before dispatch: a handler that registers or removes another
      // handler mid-emit must not change who receives THIS payload.
      const handlers = Array.from(this.handlers);

      if (handlers.length > 0) {
        handlers.forEach(({ handler }) =>
          this.invoke(handler, payload, 'Handler'),
        );
        return;
      }

      if (this.defaultListener) {
        this.invoke(this.defaultListener, payload, 'DefaultListener');
      }
    };
  }

  /**
   * Both failure shapes have to be caught and neither catches the other:
   * `Promise.resolve().catch()` handles a rejecting async callee, while the
   * try/catch handles a plain one that throws synchronously - `callee(payload)`
   * is evaluated as an argument, so a sync throw escapes before `.catch()` is
   * ever attached. Either one escaping would abort dispatch to the handlers
   * after it in the snapshot, because the dispatch loop in `createEventHandler`
   * does not guard its own iteration.
   */
  private invoke(
    callee: (payload: Payload) => Promise<unknown> | void,
    payload: Payload,
    kind: 'Handler' | 'DefaultListener',
  ): void {
    try {
      void Promise.resolve(callee(payload)).catch(error =>
        Log.warn(this.logScope, () => `${kind} threw: ${error}`),
      );
    } catch (error) {
      Log.warn(this.logScope, () => `${kind} threw: ${error}`);
    }
  }
}
