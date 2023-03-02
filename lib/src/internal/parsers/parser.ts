import { BridgeError } from '../bridgeError';

export interface ParserOptions {
  /**
   * The name of the field that is being parsed.
   * Used for error messages.
   */
  keyName: string;
}

export abstract class Parser<T> {
  /**
   * The name of the interface that is being parsed.
   * Used for error messages.
   */
  public interfaceName: string = '';

  constructor(interfaceName: string) {
    this.interfaceName = interfaceName;
  }

  /**
   * Deserializes a value from a string to a specific type | undefined.
   *
   * @param value serialized value as string
   * @param options
   */
  abstract parseMaybe(
    value: string | undefined,
    options: ParserOptions,
  ): T | undefined;

  parse(value: string, options: ParserOptions): T {
    if (value === undefined || value === null) {
      throw this.errRequiredFieldMissing(options.keyName);
    }

    const result = this.parseMaybe(value, options);

    if (result === undefined || result === null) {
      throw this.errRequiredResultIsFalsy(value);
    }

    return result;
  }

  protected errRequiredFieldMissing(keyName: string): BridgeError {
    const msg = `Failed to deserialize "${this.interfaceName}" interface. Required field "${keyName}" is nullable.`;

    return new BridgeError('decodingFailed', msg);
  }

  protected errRequiredResultIsFalsy(keyName: string): BridgeError {
    const msg = `Failed to deserialize "${this.interfaceName}" interface. Required field "${keyName}" resulted in a nullable value.`;

    return new BridgeError('decodingFailed', msg);
  }

  protected errParsedTypeMismatch(params: {
    keyName: string;
    expectedType: string;
    realType: string;
  }): BridgeError {
    const msg = `Failed to deserialize "${this.interfaceName}" interface. Field "${params.keyName}" resulted in type "${params.realType}", but expected type: "${params.realType}".`;

    return new BridgeError('decodingFailed', msg);
  }

  protected errCustom(keyName: string, msg: string): BridgeError {
    return new BridgeError(
      'decodingFailed',
      `Failed to deserialize "${this.interfaceName}" interface with field "${keyName}". ${msg}`,
    );
  }
}
