import { Coder } from './coder';
import { AdaptyError } from '@/adapty-error';
import type { AdaptyNativeError } from '@/types/bridge';
import type { ErrorConverter } from './error-coder';
import type { Properties } from './types';

type Model = AdaptyNativeError;
type Serializable = Record<string, any>;

export class AdaptyNativeErrorCoder
  extends Coder<Model, Serializable>
  implements ErrorConverter<Model>
{
  public type: 'error' = 'error';

  protected properties: Properties<Model, Serializable> = {
    adaptyCode: {
      key: 'adapty_code',
      required: true,
      type: 'number',
    },
    message: {
      key: 'message',
      required: true,
      type: 'string',
    },
  };

  public getError(data: Model): AdaptyError {
    return new AdaptyError({
      adaptyCode: data.adaptyCode,
      message: data.message,
    });
  }
}
