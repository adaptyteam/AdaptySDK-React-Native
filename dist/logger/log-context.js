"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogContext = void 0;
const log_1 = require("./log");
const log_scope_1 = require("./log-scope");
// LogContext instance is a logger context for a single call to a native SDK method
// It accumulates logs for each step of the call
class LogContext {
    constructor() {
        this.stack = [];
    }
    createScope(step, args, message) {
        return new log_scope_1.LogScope(Object.assign(Object.assign({}, args), { onStart: payload => {
                this.stack.push({ action: step, fn: args.methodName, payload });
                log_1.Log.verbose(args.methodName, `${message}...`, payload);
            }, onSuccess: payload => {
                this.stack.push({
                    action: step,
                    fn: args.methodName,
                    payload,
                    done: true,
                });
                log_1.Log.verbose(args.methodName, `${message}: OK`, payload);
            }, onFailed: payload => {
                this.stack.push({
                    action: step,
                    fn: args.methodName,
                    payload,
                    error: true,
                });
                payload['__stack__'] = this.stack;
                log_1.Log.error(args.methodName, `${message}: FAILED`, payload);
            }, onWait: payload => {
                this.stack.push({ action: step, fn: args.methodName, payload });
                log_1.Log.verbose(args.methodName, `<HOLD> ${message}`, payload);
            }, onWaitComplete: payload => {
                this.stack.push({ action: step, fn: args.methodName, payload });
                log_1.Log.verbose(args.methodName, `<UNLOCKED> ${message}`, payload);
            } }));
    }
    // Creates a scope for a event listener
    event(method) {
        return this.createScope('EVENT', method, `Receiving event "${method.methodName}"`);
    }
    // Create a scope for a public call
    call(args) {
        return this.createScope('CALL', args, 'Calling method');
    }
    // Creates a scope for encoding an object
    encode(args) {
        return this.createScope('ENCODE', args, 'Encoding object');
    }
    // Creates a scope for calling a bridge function
    bridge(args) {
        return this.createScope('BRIDGE', args, 'Calling bridge function');
    }
    // Creates a scope for decoding a string
    decode(args) {
        return this.createScope('DECODE', args, 'Decoding string');
    }
}
exports.LogContext = LogContext;
//# sourceMappingURL=log-context.js.map