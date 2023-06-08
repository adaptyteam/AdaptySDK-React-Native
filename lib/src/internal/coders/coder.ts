import { getErrorCode } from '../../docs';
import { LogContext } from '../../logger';
import { BridgeError } from '../bridgeError';

export abstract class Coder<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  public toObject() {
    return this.data;
  }

  public static tryDecode(data: unknown): Coder<any> {
    return data as any;
  }
  abstract encode(ctx?: LogContext): Record<string, any>;

  public static errType(args: {
    name: string;
    expected: string;
    current: string;
  }): Error {
    const code = getErrorCode('decodingFailed');
    if (!code) {
      throw new Error('Failed to get error code for "decodingFailed"');
    }

    return new BridgeError(
      code,
      `Failed to deserialize "${this.name}" interface. Expected "${args.name}" to be of type "${args.expected}", but got "${args.current}".`,
    );
  }

  public static errRequired(field: string): BridgeError {
    const code = getErrorCode('decodingFailed');
    if (!code) {
      throw new Error('Failed to get error code for "decodingFailed"');
    }

    return new BridgeError(
      code,
      `Failed to deserialize "${this.name}" interface. Required field "${field}" missing.`,
    );
  }
}

export type Json = Record<string, any>;
