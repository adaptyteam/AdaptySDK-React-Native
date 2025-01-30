import type { Def } from '@/types/schema';
import type { Properties } from './types';
import type { AdaptyProfileParameters } from '@/types';
import { SimpleCoder } from './coder';

type Model = AdaptyProfileParameters;
type Serializable = Def['AdaptyProfileParameters'];

export class AdaptyProfileParametersCoder extends SimpleCoder<
  Model,
  Serializable
> {
  protected properties: Properties<Model, Serializable> = {
    firstName: { key: 'first_name', required: false, type: 'string' },
    lastName: { key: 'last_name', required: false, type: 'string' },
    gender: { key: 'gender', required: false, type: 'string' },
    birthday: { key: 'birthday', required: false, type: 'string' },
    email: { key: 'email', required: false, type: 'string' },
    phoneNumber: { key: 'phone_number', required: false, type: 'string' },
    appTrackingTransparencyStatus: {
      key: 'att_status',
      required: false,
      type: 'number',
    },
    codableCustomAttributes: {
      key: 'custom_attributes',
      required: false,
      type: 'object',
    },
    analyticsDisabled: {
      key: 'analytics_disabled',
      required: false,
      type: 'boolean',
    },
  };
}
