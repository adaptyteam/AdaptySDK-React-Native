import { Schema } from '@/types/schema';
import { AdaptyProfileParametersCoder } from './adapty-profile-parameters';

const mocks: Schema['Input.AdaptyProfileParameters'][] = [
  {
    first_name: 'John',
    last_name: 'Doe',
    gender: 'm',
    birthday: '1990-01-01',
    email: 'john.doe@example.com',
    phone_number: '+123456789',
    facebook_anonymous_id: '1234567890',
    amplitude_user_id: 'amplitudeUserId',
    amplitude_device_id: 'amplitudeDeviceId',
    mixpanel_user_id: 'mixpanelUserId',
    appmetrica_profile_id: 'appmetricaProfileId',
    appmetrica_device_id: 'appmetricaDeviceId',
    one_signal_player_id: 'oneSignalPlayerId',
    pushwoosh_hwid: 'pushwooshHWID',
    firebase_app_instance_id: 'firebaseAppInstanceId',
    airbridge_device_id: 'airbridgeDeviceId',
    att_status: 2,
    custom_attributes: { attr1: 'value1', attr2: 'value2' },
    analytics_disabled: false,
  },
];

describe('AdaptyProfileParametersCoder', () => {
  const coder = new AdaptyProfileParametersCoder();

  it.each(mocks)('should encode/decode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toEqual(mock);
  });
});
