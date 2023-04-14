import { BridgeError } from '../internal/bridgeError';
import { ErrorCode, getErrorCode, getErrorPrompt } from '../types/error';

export interface ErrorInput {
  adaptyCode: ErrorCode;
  adaptyCodeStr: typeof ErrorCode[ErrorCode];
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
    const code = getErrorCode('notActivated');
    if (!code) {
      throw new Error('Failed to get error code for "notActivated"');
    }

    return new AdaptyError({
      adaptyCode: code,
      adaptyCodeStr: getErrorPrompt(code) ?? 'notActivated',
      localizedDescription: 'Adapty SDK is not initialized.',
      logFmt: `#${2002} (${ErrorCode[2002]}): Adapty SDK is not initialized.`,
    });
  }

  public static tryWrap(error: unknown): AdaptyError {
    try {
      const nativeErr = BridgeError.nativeErr(error as any);

      try {
        const prompt = getErrorPrompt(nativeErr.adaptyCode);
        const resultErr = new AdaptyError({
          adaptyCode: nativeErr.adaptyCode,
          adaptyCodeStr: prompt,
          localizedDescription: nativeErr.description,
          logFmt: `#${nativeErr.adaptyCode} (${prompt}): ${nativeErr.description}`,
        });
        return resultErr;
      } catch (error) {
        return AdaptyError.deserializationError('tryWrap');
      }
    } catch (error) {
      return AdaptyError.deserializationError('tryWrap');
    }
  }

  public static deserializationError(methodName: string): AdaptyError {
    const code = getErrorCode('decodingFailed');
    if (!code) {
      throw new Error('Failed to get error code for "decodingFailed"');
    }

    return new AdaptyError({
      adaptyCode: code,
      adaptyCodeStr: getErrorPrompt(code) ?? 'decodingFailed',
      localizedDescription: `Failed to run '${methodName}' method.`,
    });
  }
}
