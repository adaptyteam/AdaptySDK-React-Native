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
export declare class LogScope {
    methodName: string;
    private onStart;
    private onSuccess;
    private onFailed;
    private onWait;
    private onWaitComplete;
    constructor(args: LogScopeConstructor);
    start<T>(args: LogArgs<T>): void;
    wait<T>(args?: LogArgs<T>): void;
    waitComplete<T>(args?: LogArgs<T>): void;
    success<T>(args?: LogArgs<T>): void;
    failed<T>(args: LogArgs<T>): void;
}
export {};
//# sourceMappingURL=log-scope.d.ts.map