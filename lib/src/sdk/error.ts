import { BridgeError } from '../internal/bridgeError';
import { ErrorCode } from '../types/error';

export interface ErrorInput {
  adaptyCode: ErrorCode;
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

  public adaptyCode: ErrorCode;
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

  public static notInitializedError(): AdaptyError {
    return new AdaptyError({
      adaptyCode: 'notActivated',
      localizedDescription: 'Adapty SDK is not initialized.',
      logFmt: `#${2002} (${ErrorCode[2002]}): Adapty SDK is not initialized.`,
    });
  }

  public static tryWrap(error: unknown): AdaptyError {
    const nativeErr = BridgeError.nativeErr(error as any);

    const code = Object.keys(ErrorCode).find(keyStr => {
      const key = Number(keyStr) as keyof typeof ErrorCode;
      return nativeErr.adaptyCode === ErrorCode[key];
    });

    return new AdaptyError({
      adaptyCode: nativeErr.adaptyCode,
      localizedDescription: nativeErr.description,
      logFmt: `#${code} (${nativeErr.adaptyCode}): ${nativeErr.description}`,
    });
  }

  public static deserializationError(methodName: string): AdaptyError {
    return new AdaptyError({
      adaptyCode: 'decodingFailed',
      localizedDescription: `Failed to run '${methodName}' method.`,
    });
  }
}
