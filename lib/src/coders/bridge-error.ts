import { AdaptyBridgeError } from '@/types/bridge';
import { SimpleCoder } from './coder';
import { Properties } from './types';
import { ErrorConverter } from './error-coder';
import { AdaptyError } from '@/adapty-error';

type Model = AdaptyBridgeError;
type Serializable = Record<string, any>;

export class BridgeErrorCoder
  extends SimpleCoder<Model, Serializable>
  implements ErrorConverter<Model>
{
  public type: 'error' = 'error';

  protected properties: Properties<Model, Serializable> = {
    errorType: {
      key: 'error_type',
      required: true,
      type: 'string',
    },
    name: {
      key: 'name',
      required: false,
      type: 'string',
    },
    type: {
      key: 'type',
      required: false,
      type: 'string',
    },
    underlyingError: {
      key: 'parent_error',
      required: false,
      type: 'string',
    },
    description: {
      key: 'description',
      required: false,
      type: 'string',
    },
  };

  public getError(data: Model): AdaptyError {
    switch (data.errorType) {
      case 'missingRequiredArgument':
        return new AdaptyError({
          adaptyCode: 3001,
          message: `Required parameter "${data.name} was not passed to a native module"`,
        });
      case 'typeMismatch':
        return new AdaptyError({
          adaptyCode: 3001,
          message: `Passed parameter "${data.name}" has invalid type. Expected type: ${data.type}"`,
        });
      case 'encodingFailed':
        return new AdaptyError({
          adaptyCode: 2009,
          message: `Bridge layer failed to encode response. Bridge error: ${JSON.stringify(
            data.underlyingError ?? {},
          )}"`,
        });
      case 'wrongParam':
      case 'WRONG_PARAMETER':
        return new AdaptyError({
          adaptyCode: 3001,
          message:
            data.name ??
            `Wrong parameter. Bridge error: ${JSON.stringify(
              data.underlyingError ?? {},
            )}"`,
        });
      case 'methodNotImplemented':
        return new AdaptyError({
          adaptyCode: 2003,
          message: 'Requested bridge handle not found',
        });
      case 'unsupportedIosVersion':
        return new AdaptyError({
          adaptyCode: 2003,
          message: 'Unsupported iOS version',
        });
      case 'unexpectedError':
      default:
        return new AdaptyError({
          adaptyCode: 0,
          message: `Unexpected error occurred: ${JSON.stringify(
            data.underlyingError ?? {},
          )}`,
        });
    }
  }
}
