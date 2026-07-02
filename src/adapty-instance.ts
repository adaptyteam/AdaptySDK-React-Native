import { Adapty } from './adapty-handler';

/**
 * The shared Adapty SDK singleton.
 *
 * @remarks
 * Lives in its own module (rather than `index.ts`) so internal modules — e.g.
 * the default flow event handlers in `ui/types.ts` — can reference the
 * singleton without creating a circular dependency on the public barrel.
 *
 * @public
 */
export const adapty = new Adapty();
