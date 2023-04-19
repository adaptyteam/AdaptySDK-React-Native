import { LogLevel } from '../types/inputs';
import VERSION from '../version';

export class Log {
  public static logLevel: LogLevel | null = null;

  // Formats a message for logging
  private static formatMessage(message: string, funcName: string): string {
    const now = new Date().toISOString();
    const version = VERSION;

    return `[${now}] [adapty@${version}] "${funcName}": ${message}`;
  }

  // Gets the appropriate logger for a log level
  private static getLogger(
    logLevel: LogLevel,
  ): (message: string, ...optionalParams: any[]) => void {
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
      let output = Log.formatMessage(message, funcName);
      const logger = Log.getLogger(logLevel) || console.log;

      logger(output, params);
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
