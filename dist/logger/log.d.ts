import { LogLevel } from '../types/inputs';
export declare class Log {
    static logLevel: LogLevel | null;
    private static formatMessage;
    private static getLogger;
    static info(funcName: string, message: string, params?: Record<string, any>): void;
    static warn(funcName: string, message: string, params?: Record<string, any>): void;
    static error(funcName: string, message: string, params?: Record<string, any>): void;
    static verbose(funcName: string, message: string, params?: Record<string, any>): void;
}
//# sourceMappingURL=log.d.ts.map