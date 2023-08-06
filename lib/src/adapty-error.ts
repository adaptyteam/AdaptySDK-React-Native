export interface AdaptyErrorInput {
  adaptyCode: number;
  message: string;
  jsError?: Error;
}

export class AdaptyError extends Error {
  public adaptyCode: number;

  constructor(input: AdaptyErrorInput) {
    super(input.message);
    this.adaptyCode = input.adaptyCode;
    this.message = input.message;
  }

  static failedToDecodeNativeError(
    message: string,
    error: unknown,
  ): AdaptyError {
    return new AdaptyError({
      adaptyCode: -1, // TODO
      message: message,
      jsError: error as Error,
    });
  }

  static failedToEncode(message: string): AdaptyError {
    return new AdaptyError({
      adaptyCode: -1, // TODO
      message: message,
    });
  }

  static failedToDecode(message: string): AdaptyError {
    return new AdaptyError({
      adaptyCode: -1, // TODO
      message: message,
    });
  }
}
