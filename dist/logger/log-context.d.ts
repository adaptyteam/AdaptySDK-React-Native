import { LogScope } from './log-scope';
export interface ScopeArgs {
    methodName: string;
}
type Scope = 'EVENT' | 'CALL' | 'ENCODE' | 'BRIDGE' | 'DECODE';
interface Trace {
    action: Scope;
    fn: string;
    payload: Record<string, any>;
    error?: boolean;
    done?: boolean;
}
export declare class LogContext {
    stack: Trace[];
    private createScope;
    event(method: ScopeArgs): LogScope;
    call(args: ScopeArgs): LogScope;
    encode(args: ScopeArgs): LogScope;
    bridge(args: ScopeArgs): LogScope;
    decode(args: ScopeArgs): LogScope;
}
export {};
//# sourceMappingURL=log-context.d.ts.map