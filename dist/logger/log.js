"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const tslib_1 = require("tslib");
const inputs_1 = require("../types/inputs");
const version_1 = tslib_1.__importDefault(require("../version"));
class Log {
    // Formats a message for logging
    static formatMessage(message, funcName) {
        const now = new Date().toISOString();
        const version = version_1.default;
        return `[${now}] [adapty@${version}] "${funcName}": ${message}`;
    }
    // Gets the appropriate logger for a log level
    static getLogger(logLevel) {
        switch (logLevel) {
            /* eslint-disable no-console */
            case inputs_1.LogLevel.ERROR:
                return console.error;
            case inputs_1.LogLevel.WARN:
                return console.warn;
            case inputs_1.LogLevel.VERBOSE:
                return console.debug;
            case inputs_1.LogLevel.INFO:
                return console.info;
            default:
                return console.log;
            /* eslint-enable no-console */
        }
    }
    /**
     * Gets the appropriate log level integer for a log level.
     * @internal
     */
    static getLogLevelInt(logLevel) {
        switch (logLevel) {
            case inputs_1.LogLevel.ERROR:
                return 0;
            case inputs_1.LogLevel.WARN:
                return 1;
            case inputs_1.LogLevel.INFO:
                return 2;
            case inputs_1.LogLevel.VERBOSE:
                return 3;
        }
    }
    /**
     * Logs a message to the console if the log level is appropriate.
     * @internal
     */
    static log(logLevel, funcName, message, params) {
        if (!Log.logLevel) {
            return;
        }
        const currentLevel = Log.getLogLevelInt(Log.logLevel);
        const messageLevel = Log.getLogLevelInt(logLevel);
        if (messageLevel <= currentLevel) {
            let output = Log.formatMessage(message, funcName);
            const logger = Log.getLogger(logLevel);
            logger(output, params);
        }
    }
    static info(funcName, message, params) {
        this.log(inputs_1.LogLevel.INFO, funcName, message, params);
    }
    static warn(funcName, message, params) {
        this.log(inputs_1.LogLevel.WARN, funcName, message, params);
    }
    static error(funcName, message, params) {
        this.log(inputs_1.LogLevel.ERROR, funcName, message, params);
    }
    static verbose(funcName, message, params) {
        this.log(inputs_1.LogLevel.VERBOSE, funcName, message, params);
    }
}
exports.Log = Log;
Log.logLevel = null;
//# sourceMappingURL=log.js.map