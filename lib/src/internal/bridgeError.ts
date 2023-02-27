import { Log } from '../sdk/logger';
import { ErrorCode } from '../types/error';

export class BridgeError extends Error {
  public adaptyCode: keyof typeof ErrorCode;
  public description: string;
  public detail: string;

  constructor(data: Record<string, any>) {
    Log.verbose('BridgeError', `Creating new BridgeError.`, { args: data });

    const adaptyError = (data ?? {})['message'];
    if (!adaptyError) {
      Log.warn(
        'BridgeError',
        `Failed to construct a valid BridgeError. Data does not contain a message.`,
        { args: data },
      );

      super('Unknown error');
      this.adaptyCode = 0;
      this.description = `Unknown error. JSON: ${JSON.stringify(data)}`;
      this.detail = '';
      return;
    }

    try {
      const errNative = JSON.parse(adaptyError);
      const adaptyCode = errNative['adapty_code'];
      const detail = errNative['detail'];
      const message = errNative['message'];

      super(message || detail || adaptyCode);

      this.adaptyCode = adaptyCode;
      this.description = message;
      this.detail = detail;
    } catch (serializationError) {
      // Failed to parse the error message. Should not occur.

      Log.error(
        'BridgeError',
        `Failed to construct a valid BridgeError. Message.`,
        { args: data, error: serializationError },
      );

      const adaptyCode = 0;
      const detail = '';
      const message = `Unknown error. Failed to parse native error message. JSON: ${JSON.stringify(
        data,
      )}. Serialization error: ${JSON.stringify(serializationError)}`;

      super(message || detail);

      this.adaptyCode = adaptyCode;
      this.description = message;
      this.detail = detail;
    }
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
