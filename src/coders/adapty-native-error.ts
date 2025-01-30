import type { AdaptyNativeError } from '@/types/bridge';
import type { ErrorConverter } from './error-coder';
import type { Properties } from './types';
import type { Def } from '@/types/schema';
import { SimpleCoder } from './coder';
import { AdaptyError } from '@/adapty-error';

type Model = AdaptyNativeError;
type Serializable = Def['AdaptyError'];

export class AdaptyNativeErrorCoder
  extends SimpleCoder<Model, Serializable>
  implements ErrorConverter<Model>
{
  public type: 'error' = 'error';

  protected properties: Properties<Model, Serializable> = {
    adaptyCode: { key: 'adapty_code', required: true, type: 'number' },
    message: { key: 'message', required: true, type: 'string' },
    detail: { key: 'detail', required: false, type: 'string' },
  };

  public getError(data: Model): AdaptyError {
    return new AdaptyError({
      adaptyCode: data.adaptyCode as any,
      message: data.message,
      detail: data.detail,
    });
  }
}
