import { AdaptyBridgeError } from '@/types/bridge';
import { Coder } from './coder';
import { Properties } from './types';

type Model = AdaptyBridgeError;
type Serializable = Record<string, any>;

export class BridgeErrorCoder extends Coder<Model, Serializable> {
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
      required: true,
      type: 'string',
    },
  };
}
