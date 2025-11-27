"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogScope = void 0;
class LogScope {
    constructor(args) {
        this.methodName = args.methodName;
        this.onStart = args.onStart;
        this.onSuccess = args.onSuccess;
        this.onFailed = args.onFailed;
        this.onWait = args.onWait;
        this.onWaitComplete = args.onWaitComplete;
    }
    start(args) {
        this.onStart(args);
    }
    wait(args) {
        this.onWait(args);
    }
    waitComplete(args) {
        this.onWaitComplete(args);
    }
    success(args) {
        this.onSuccess(args);
    }
    failed(args) {
        this.onFailed(args);
    }
}
exports.LogScope = LogScope;
//# sourceMappingURL=log-scope.js.map