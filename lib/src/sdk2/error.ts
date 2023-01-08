import { BridgeError } from '../internal/bridgeError';
import { ErrorCode } from '../types/error';

interface ErrorInput {
  adaptyCode: keyof typeof ErrorCode;
  logFmt?: string;
  localizedDescription: string | undefined;
}

/**
 * AdaptyError
 */
export class AdaptyError extends Error {
  /**
   * Prefix for error messages.
   * Change this to add a prefix to all Adapty messages.
   *
   * @public
   */
  public static prefix = '';

  public adaptyCode: keyof typeof ErrorCode;
  public localizedDescription: string;

  static middleware?: (error: AdaptyError) => void;

  constructor({ adaptyCode, localizedDescription, logFmt }: ErrorInput) {
    let message =
      AdaptyError.prefix +
      (AdaptyError.prefix ? ' ' : '') +
      (logFmt || localizedDescription || 'Unknown Adapty Error');
    super(message);

    this.adaptyCode = adaptyCode;
    this.localizedDescription = localizedDescription || 'Unknown Adapty Error';

    if (AdaptyError.middleware) {
      AdaptyError.middleware(this);
    }
  }

  public static set onError(callback: (error: AdaptyError) => void) {
    AdaptyError.middleware = callback;
  }

  public static tryWrap(error: unknown): AdaptyError {
    const nativeError = new BridgeError(error as any);

    return new AdaptyError({
      adaptyCode: nativeError.adaptyCode,
      localizedDescription: nativeError.description,
      logFmt: `#${nativeError.adaptyCode} (${
        ErrorCode[nativeError.adaptyCode]
      }): ${nativeError.description}`,
      // code: 0,
    });
  }

  public static deserializationError(methodName: string): AdaptyError {
    return new AdaptyError({
      adaptyCode: 2006,
      localizedDescription: `Failed to run '${methodName}' method.`,
    });
  }
}
