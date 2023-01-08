import { ErrorCode } from '../types/error';

export class BridgeError extends Error {
  public adaptyCode: keyof typeof ErrorCode;
  public description: string;
  public detail: string;

  constructor(data: Record<string, any>) {
    const errNative = JSON.parse(data['message']);
    const adaptyCode = errNative['adapty_code'];
    const detail = errNative['detail'];
    const message = errNative['message'];

    super(message || detail || adaptyCode);

    this.adaptyCode = adaptyCode;
    this.description = message;
    this.detail = detail;
  }

  static decodeFailed(message: string): BridgeError {
    return new BridgeError({
      message: JSON.stringify({
        adapty_code: ErrorCode[2006],
        message,
      }),
    });
  }
}
