import { AdaptyProfileParametersCoder } from './adapty-profile-parameters';

describe('AdaptyProfileParametersCoder', () => {
  const coder = new AdaptyProfileParametersCoder();
  const testObject: Record<string, any> = {
    first_name: 'John',
    last_name: 'Doe',
    gender: 'male',
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
    store_country: 'US',
    att_status: 'granted',
    custom_attributes: { attr1: 'value1', attr2: 'value2' },
    analytics_disabled: false,
  };

  it('should encode/decode', () => {
    const decoded = coder.decode(testObject);
    const encoded = coder.encode(decoded);
    expect(encoded).toEqual(testObject);
  });
});
