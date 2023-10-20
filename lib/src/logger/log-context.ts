import { Log } from './log';
import { LogScope } from './log-scope';

export interface ScopeArgs {
  methodName: string;
}

// Scope of a single stack trace record
type Scope = 'EVENT' | 'CALL' | 'ENCODE' | 'BRIDGE' | 'DECODE';

// Displays an interface for a single stack trace record
interface Trace {
  action: Scope;
  fn: string;
  payload: Record<string, any>;
  error?: boolean;
  done?: boolean;
}

// LogContext instance is a logger context for a single call to a native SDK method
// It accumulates logs for each step of the call
export class LogContext {
  public stack: Trace[] = [];

  private createScope(step: Scope, args: ScopeArgs, message: string): LogScope {
    return new LogScope({
      ...args,
      onStart: payload => {
        this.stack.push({ action: step, fn: args.methodName, payload });

        Log.verbose(args.methodName, `${message}...`, payload);
      },
      onSuccess: payload => {
        this.stack.push({
          action: step,
          fn: args.methodName,
          payload,
          done: true,
        });

        Log.verbose(args.methodName, `${message}: OK`, payload);
      },
      onFailed: payload => {
        this.stack.push({
          action: step,
          fn: args.methodName,
          payload,
          error: true,
        });

        payload['__stack__'] = this.stack;
        Log.error(args.methodName, `${message}: FAILED`, payload);
      },
      onWait: payload => {
        this.stack.push({ action: step, fn: args.methodName, payload });
        Log.verbose(args.methodName, `<HOLD> ${message}`, payload);
      },
      onWaitComplete: payload => {
        this.stack.push({ action: step, fn: args.methodName, payload });
        Log.verbose(args.methodName, `<UNLOCKED> ${message}`, payload);
      },
    });
  }

  // Creates a scope for a event listener
  public event(method: ScopeArgs): LogScope {
    return this.createScope(
      'EVENT',
      method,
      `Receiving event "${method.methodName}"`,
    );
  }
  // Create a scope for a public call
  public call(args: ScopeArgs): LogScope {
    return this.createScope('CALL', args, 'Calling method');
  }
  // Creates a scope for encoding an object
  public encode(args: ScopeArgs): LogScope {
    return this.createScope('ENCODE', args, 'Encoding object');
  }
  // Creates a scope for calling a bridge function
  public bridge(args: ScopeArgs): LogScope {
    return this.createScope('BRIDGE', args, 'Calling bridge function');
  }
  // Creates a scope for decoding a string
  public decode(args: ScopeArgs): LogScope {
    return this.createScope('DECODE', args, 'Decoding string');
  }
}
