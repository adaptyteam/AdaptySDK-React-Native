import { ErrorCode } from './types/error';
export interface AdaptyErrorInput {
    adaptyCode: ErrorCode;
    message: string;
    detail?: string | undefined;
}
export declare class AdaptyError extends Error {
    static prefix: string;
    static middleware?: (error: AdaptyError) => void;
    adaptyCode: ErrorCode;
    localizedDescription: string;
    detail: string | undefined;
    constructor(input: AdaptyErrorInput);
    static set onError(callback: (error: AdaptyError) => void);
    static failedToDecodeNativeError(message: string, error: unknown): AdaptyError;
    static failedToEncode(message: string): AdaptyError;
    static failedToDecode(message: string): AdaptyError;
    private static getMessage;
}
//# sourceMappingURL=adapty-error.d.ts.map