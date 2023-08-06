import { AdaptyProfileParameters } from '../types';
import { Coder } from './coder';
import { Properties } from './types';

type Model = AdaptyProfileParameters;
type Serializable = Record<string, any>;

export class AdaptyProfileParametersCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    firstName: {
      key: 'first_name',
      required: false,
      type: 'string',
    },
    lastName: {
      key: 'last_name',
      required: false,
      type: 'string',
    },
    gender: {
      key: 'gender',
      required: false,
      type: 'string',
    },
    birthday: {
      key: 'birthday',
      required: false,
      type: 'string',
    },
    email: {
      key: 'email',
      required: false,
      type: 'string',
    },
    phoneNumber: {
      key: 'phone_number',
      required: false,
      type: 'string',
    },
    facebookAnonymousId: {
      key: 'facebook_anonymous_id',
      required: false,
      type: 'string',
    },
    amplitudeUserId: {
      key: 'amplitude_user_id',
      required: false,
      type: 'string',
    },
    amplitudeDeviceId: {
      key: 'amplitude_device_id',
      required: false,
      type: 'string',
    },
    mixpanelUserId: {
      key: 'mixpanel_user_id',
      required: false,
      type: 'string',
    },
    appmetricaProfileId: {
      key: 'appmetrica_profile_id',
      required: false,
      type: 'string',
    },
    appmetricaDeviceId: {
      key: 'appmetrica_device_id',
      required: false,
      type: 'string',
    },
    oneSignalPlayerId: {
      key: 'one_signal_player_id',
      required: false,
      type: 'string',
    },
    pushwooshHWID: {
      key: 'pushwoosh_hwid',
      required: false,
      type: 'string',
    },
    firebaseAppInstanceId: {
      key: 'firebase_app_instance_id',
      required: false,
      type: 'string',
    },
    airbridgeDeviceId: {
      key: 'airbridge_device_id',
      required: false,
      type: 'string',
    },
    storeCountry: {
      key: 'store_country',
      required: false,
      type: 'string',
    },
    appTrackingTransparencyStatus: {
      key: 'att_status',
      required: false,
      type: 'string',
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
