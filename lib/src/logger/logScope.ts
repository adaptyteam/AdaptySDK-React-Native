import { ScopeArgs } from './logContext';

type LogArgs<T> = T;
type LogCallback = (args: LogArgs<any>) => void;

interface LogScopeConstructor extends ScopeArgs {
  onStart: LogCallback;
  onSuccess: LogCallback;
  onFailed: LogCallback;
}

export class LogScope {
  public methodName: string;
  private onStart: LogCallback;
  private onSuccess: LogCallback;
  private onFailed: LogCallback;

  constructor(args: LogScopeConstructor) {
    this.methodName = args.methodName;
    this.onStart = args.onStart;
    this.onSuccess = args.onSuccess;
    this.onFailed = args.onFailed;
  }

  public start<T>(args: LogArgs<T>) {
    this.onStart(args);
  }
  public success<T>(args?: LogArgs<T>) {
    this.onSuccess(args);
  }
  public failed<T>(args: LogArgs<T>) {
    this.onFailed(args);
  }
}
