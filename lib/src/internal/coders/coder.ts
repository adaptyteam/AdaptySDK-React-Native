import { BridgeError } from '../bridgeError';

/**
 * Type-safe JSON coder.
 * @internal
 */
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
  abstract encode(): Record<string, any>;

  public static errType(args: {
    name: string;
    expected: string;
    current: string;
  }): Error {
    return new BridgeError(
      'decodingFailed',
      `Failed to deserialize "${this.name}" interface. Expected "${args.name}" to be of type "${args.expected}", but got "${args.current}".`,
    );
  }

  public static errRequired(field: string): BridgeError {
    return new BridgeError(
      'decodingFailed',
      `Failed to deserialize "${this.name}" interface. Required field "${field}" missing.`,
    );
  }
}

export type Json = Record<string, any>;
