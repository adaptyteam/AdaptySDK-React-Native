import { ErrorCode } from '@/types/error';

export interface AdaptyErrorInput {
  adaptyCode: ErrorCode;
  message: string;
  jsError?: Error;
}

export class AdaptyError extends Error {
  // Custom prefix to be shown before log message
  public static prefix = '';

  // For example `2` for cancelled payment
  public adaptyCode: ErrorCode;
  // Message that is safe to show to a user
  public localizedDescription: string;
  static middleware?: (error: AdaptyError) => void;

  constructor(input: AdaptyErrorInput) {
    super(AdaptyError.getMessage(input));

    this.adaptyCode = input.adaptyCode;
    this.localizedDescription = input.message;

    if (AdaptyError.middleware) {
      AdaptyError.middleware(this);
    }
  }

  public static set onError(callback: (error: AdaptyError) => void) {
    AdaptyError.middleware = callback;
  }

  public static failedToDecodeNativeError(
    message: string,
    error: unknown,
  ): AdaptyError {
    return new AdaptyError({
      adaptyCode: 0,
      message: message,
      jsError: error as Error,
    });
  }

  public static failedToEncode(message: string): AdaptyError {
    return new AdaptyError({
      adaptyCode: 2009,
      message: message,
    });
  }

  public static failedToDecode(message: string): AdaptyError {
    return new AdaptyError({
      adaptyCode: 2006,
      message: message,
    });
  }

  private static getMessage(input: AdaptyErrorInput): string {
    const code = input.adaptyCode;
    const codeText = ErrorCode[code];

    let message = `#${code} (${codeText}): ${input.message}`;

    if (AdaptyError.prefix) {
      message = `${AdaptyError.prefix} ${message}`;
    }

    return message;
  }
}
