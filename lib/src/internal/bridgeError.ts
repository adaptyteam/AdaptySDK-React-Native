import { Log } from '../sdk/logger';
import { ErrorCode } from '../types/error';

const RN_ERROR_KEY = 'message';
const ERROR_CODE_KEY = 'adapty_code';
const ERROR_DETAIL_KEY = 'detail';
const ERROR_MESSAGE_KEY = 'message';

export class BridgeError extends Error {
  public adaptyCode: ErrorCode;
  public description: string;
  public detail: string;

  static nativeErr(data: Record<string, any>): BridgeError {
    Log.verbose(
      'BridgeError.nativeErr',
      `Creating new BridgeError from native error...`,
      { args: data },
    );

    /**
     * Native errors are typically serialized as objects
     * with one meaningful key — `message`
     *
     * Inside it there is a serialized object with
     * `adapty_code`, `message` and `detail` keys.
     */
    const adaptyError = (data ?? {})[RN_ERROR_KEY];
    if (!adaptyError) {
      Log.warn(
        'BridgeError.decodeNativeError',
        `Failed to construct a valid BridgeError. Data does not contain a message.`,
        { args: data },
      );

      return new BridgeError(
        'unknown',
        `Unknown error. JSON: ${JSON.stringify(data)}`,
      );
    }

    try {
      const errNative = JSON.parse(adaptyError);
      const errCode = errNative[ERROR_CODE_KEY];
      const message = errNative[ERROR_MESSAGE_KEY];
      const detail = errNative[ERROR_DETAIL_KEY];

      return new BridgeError(errCode, message, detail);
    } catch {
      // Failed to parse the error message. Should not occur.
      Log.error(
        'BridgeError.nativeErr',
        'Failed to deserialize a native error message',
        { args: data },
      );

      return new BridgeError(
        'unknown',
        'Failed to deserialize a native error message',
        'Check the logs for more details',
      );
    }
  }

  constructor(errCode: ErrorCode, message: string, detail = '') {
    Log.verbose('BridgeError', `Raised new BridgeError`, {
      adapty_code: errCode,
      message,
      detail,
    });

    super(message || detail || errCode);

    this.adaptyCode = errCode;
    this.description = message;
    this.detail = detail;
  }
}
