import { ScopeArgs } from './log-context';

type LogArgs<T> = T;
type LogCallback = (args: LogArgs<any>) => void;

interface LogScopeConstructor extends ScopeArgs {
  onStart: LogCallback;
  onSuccess: LogCallback;
  onFailed: LogCallback;
  onWait: LogCallback;
  onWaitComplete: LogCallback;
}

export class LogScope {
  public methodName: string;
  private onStart: LogCallback;
  private onSuccess: LogCallback;
  private onFailed: LogCallback;
  private onWait: LogCallback;
  private onWaitComplete: LogCallback;

  constructor(args: LogScopeConstructor) {
    this.methodName = args.methodName;
    this.onStart = args.onStart;
    this.onSuccess = args.onSuccess;
    this.onFailed = args.onFailed;
    this.onWait = args.onWait;
    this.onWaitComplete = args.onWaitComplete;
  }

  public start<T>(args: LogArgs<T>) {
    this.onStart(args);
  }
  public wait<T>(args?: LogArgs<T>) {
    this.onWait(args);
  }
  public waitComplete<T>(args?: LogArgs<T>) {
    this.onWaitComplete(args);
  }
  public success<T>(args?: LogArgs<T>) {
    this.onSuccess(args);
  }
  public failed<T>(args: LogArgs<T>) {
    this.onFailed(args);
  }
}
