import { LogLevel } from '../types/inputs';

export const MSG = {
  NEW_CALL: 'Preparing to call native SDK',
  BEFORE_NATIVE_CALL: '--> Calling native SDK',
  NATIVE_SDK_REPLIED: '<-- Native SDK replied',
  NATIVE_SDK_REPLIED_WITH_ERROR: '<-- Native SDK replied with error',
  CALL_SUCCESS: '<-- SUCCESS',
};

export class Log {
  public static logLevel: LogLevel | null = null;
  public static VERSION = process?.env?.npm_package_version ?? 'UNKNOWN';

  /**
   * Formats a message for logging.
   * @internal
   */
  private static fmtMessage(
    logLevel: LogLevel,
    message: string,
    funcName: string,
  ): string {
    return `[Adapty JS v${this.VERSION}] — ${logLevel}: ${funcName}: ${message}`;
  }

  /**
   * Gets the appropriate logger for a log level.
   * @internal
   */
  private static getLogger(logLevel: LogLevel): (message: string) => void {
    switch (logLevel) {
      case LogLevel.ERROR:
        return console.error;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.VERBOSE:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      default:
        return console.log;
    }
  }

  /**
   * Gets the appropriate log level integer for a log level.
   * @internal
   */
  private static getLogLevelInt(logLevel: LogLevel): number {
    switch (logLevel) {
      case LogLevel.ERROR:
        return 0;
      case LogLevel.WARN:
        return 1;
      case LogLevel.INFO:
        return 2;
      case LogLevel.VERBOSE:
        return 3;
    }
  }

  /**
   * Logs a message to the console if the log level is appropriate.
   * @internal
   */
  public static log(
    logLevel: LogLevel,
    funcName: string,
    message: string,
    params?: Record<string, any>,
  ): void {
    if (!Log.logLevel) {
      return;
    }

    const currentLevel = Log.getLogLevelInt(Log.logLevel);
    const messageLevel = Log.getLogLevelInt(logLevel);

    if (messageLevel <= currentLevel) {
      let output = Log.fmtMessage(logLevel, message, funcName);
      const logger = Log.getLogger(logLevel) || console.log;

      if (params) {
        Object.keys(params).forEach(key => {
          let value = params[key];
          if (typeof value === 'object' && Boolean(value)) {
            value = JSON.stringify(value, null, 2);
          }
          output += `\n\t${key}=${JSON.stringify(value)}`;
        });
      }

      logger(output);
    }
  }

  public static info(
    funcName: string,
    message: string,
    params?: Record<string, any>,
  ): void {
    this.log(LogLevel.INFO, funcName, message, params);
  }

  public static warn(
    funcName: string,
    message: string,
    params?: Record<string, any>,
  ): void {
    this.log(LogLevel.WARN, funcName, message, params);
  }

  public static error(
    funcName: string,
    message: string,
    params?: Record<string, any>,
  ): void {
    this.log(LogLevel.ERROR, funcName, message, params);
  }

  public static verbose(
    funcName: string,
    message: string,
    params?: Record<string, any>,
  ): void {
    this.log(LogLevel.VERBOSE, funcName, message, params);
  }
}
