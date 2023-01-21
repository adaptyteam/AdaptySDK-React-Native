import type { AdaptyProfileParameters } from '../../types';

import { Coder } from './coder';

type Type = AdaptyProfileParameters;

export class AdaptyProfileParametersCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  static override tryDecode(json_obj: unknown): AdaptyProfileParametersCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || data === null) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    // const firstName = data['first_name'] as Type['firstName'];
    // if (firstName && typeof firstName !== 'string') {
    //   throw this.errType({
    //     name: 'firstName',
    //     expected: 'string',
    //     current: typeof firstName,
    //   });
    // }

    // const lastName = data['last_name'] as Type['lastName'];
    // if (lastName && typeof lastName !== 'string') {
    //   throw this.errType({
    //     name: 'lastName',
    //     expected: 'string',
    //     current: typeof lastName,
    //   });
    // }

    // const gender = data['gender'] as Type['gender'];
    // if (gender && typeof gender !== 'string') {
    //   throw this.errType({
    //     name: 'gender',
    //     expected: 'string',
    //     current: typeof gender,
    //   });
    // }

    // const birthday = data['birthday'] as Type['birthday'];
    // if (birthday && typeof birthday !== 'string') {
    //   throw this.errType({
    //     name: 'birthday',
    //     expected: 'string',
    //     current: typeof birthday,
    //   });
    // }

    // const email = data['email'] as Type['email'];
    // if (email && typeof email !== 'string') {
    //   throw this.errType({
    //     name: 'email',
    //     expected: 'string',
    //     current: typeof email,
    //   });
    // }

    // const phoneNumber = data['phone_number'] as Type['phoneNumber'];
    // if (phoneNumber && typeof phoneNumber !== 'string') {
    //   throw this.errType({
    //     name: 'phoneNumber',
    //     expected: 'string',
    //     current: typeof phoneNumber,
    //   });
    // }

    // const facebookAnonymousId = data[
    //   'facebook_anonymous_id'
    // ] as Type['facebookAnonymousId'];
    // if (facebookAnonymousId && typeof facebookAnonymousId !== 'string') {
    //   throw this.errType({
    //     name: 'facebookAnonymousId',
    //     expected: 'string',
    //     current: typeof facebookAnonymousId,
    //   });
    // }

    // const amplitudeUserId = data[
    //   'amplitude_user_id'
    // ] as Type['amplitudeUserId'];
    // if (amplitudeUserId && typeof amplitudeUserId !== 'string') {
    //   throw this.errType({
    //     name: 'amplitudeUserId',
    //     expected: 'string',
    //     current: typeof amplitudeUserId,
    //   });
    // }

    // const amplitudeDeviceId = data[
    //   'amplitude_device_id'
    // ] as Type['amplitudeDeviceId'];
    // if (amplitudeDeviceId && typeof amplitudeDeviceId !== 'string') {
    //   throw this.errType({
    //     name: 'amplitudeDeviceId',
    //     expected: 'string',
    //     current: typeof amplitudeDeviceId,
    //   });
    // }

    // const mixpanelUserId = data['mixpanel_user_id'] as Type['mixpanelUserId'];
    // if (mixpanelUserId && typeof mixpanelUserId !== 'string') {
    //   throw this.errType({
    //     name: 'mixpanelUserId',
    //     expected: 'string',
    //     current: typeof mixpanelUserId,
    //   });
    // }

    // const appmetricaProfileId = data[
    //   'appmetrica_profile_id'
    // ] as Type['appmetricaProfileId'];
    // if (appmetricaProfileId && typeof appmetricaProfileId !== 'string') {
    //   throw this.errType({
    //     name: 'appmetricaProfileId',
    //     expected: 'string',
    //     current: typeof appmetricaProfileId,
    //   });
    // }

    // const appmetricaDeviceId = data[
    //   'appmetrica_device_id'
    // ] as Type['appmetricaDeviceId'];
    // if (appmetricaDeviceId && typeof appmetricaDeviceId !== 'string') {
    //   throw this.errType({
    //     name: 'appmetricaDeviceId',
    //     expected: 'string',
    //     current: typeof appmetricaDeviceId,
    //   });
    // }

    // const storeCountry = data['store_country'] as Type['storeCountry'];
    // if (storeCountry && typeof storeCountry !== 'string') {
    //   throw this.errType({
    //     name: 'storeCountry',
    //     expected: 'string',
    //     current: typeof storeCountry,
    //   });
    // }

    // const appTrackingTransparencyStatus = data[
    //   'att_status'
    // ] as Type['appTrackingTransparencyStatus'];
    // if (
    //   appTrackingTransparencyStatus &&
    //   typeof appTrackingTransparencyStatus !== 'string'
    // ) {
    //   throw this.errType({
    //     name: 'appTrackingTransparencyStatus',
    //     expected: 'string',
    //     current: typeof appTrackingTransparencyStatus,
    //   });
    // }

    // const codableCustomAttributes = data[
    //   'custom_attributes'
    // ] as Type['codableCustomAttributes'];
    // if (
    //   codableCustomAttributes &&
    //   typeof codableCustomAttributes !== 'object'
    // ) {
    //   throw this.errType({
    //     name: 'codableCustomAttributes',
    //     expected: 'object',
    //     current: typeof codableCustomAttributes,
    //   });
    // }

    // const analyticsDisabled = data[
    //   'analytics_disabled'
    // ] as Type['analyticsDisabled'];
    // if (
    //   (analyticsDisabled !== undefined || analyticsDisabled !== null) &&
    //   typeof analyticsDisabled !== 'boolean'
    // ) {
    //   throw this.errType({
    //     name: 'analyticsDisabled',
    //     expected: 'boolean',
    //     current: typeof analyticsDisabled,
    //   });
    // }

    // const oneSignalPlayerId = data[
    //   'onesignal_player_id'
    // ] as Type['oneSignalPlayerId'];
    // if (oneSignalPlayerId && typeof oneSignalPlayerId !== 'string') {
    //   throw this.errType({
    //     name: 'oneSignalPlayerId',
    //     expected: 'string',
    //     current: typeof oneSignalPlayerId,
    //   });
    // }

    // const pushwooshHWID = data['pushwoosh_hwid'] as Type['pushwooshHWID'];
    // if (pushwooshHWID && typeof pushwooshHWID !== 'string') {
    //   throw this.errType({
    //     name: 'pushwooshHWID',
    //     expected: 'string',
    //     current: typeof pushwooshHWID,
    //   });
    // }

    // const firebaseAppInstanceId = data[
    //   'firebase_app_instance_id'
    // ] as Type['firebaseAppInstanceId'];
    // if (firebaseAppInstanceId && typeof firebaseAppInstanceId !== 'string') {
    //   throw this.errType({
    //     name: 'firebaseAppInstanceId',
    //     expected: 'string',
    //     current: typeof firebaseAppInstanceId,
    //   });
    // }

    const result: Required<Type> = {
      // firstName: firstName!,
      // lastName: lastName!,
      // gender: gender!,
      // birthday: birthday!,
      // email: email!,
      // phoneNumber: phoneNumber!,
      // facebookAnonymousId: facebookAnonymousId!,
      // amplitudeUserId: amplitudeUserId!,
      // amplitudeDeviceId: amplitudeDeviceId!,
      // mixpanelUserId: mixpanelUserId!,
      // appmetricaProfileId: appmetricaProfileId!,
      // appmetricaDeviceId: appmetricaDeviceId!,
      // storeCountry: storeCountry!,
      // appTrackingTransparencyStatus: appTrackingTransparencyStatus!,
      // codableCustomAttributes: codableCustomAttributes!,
      // analyticsDisabled: analyticsDisabled!,
      // oneSignalPlayerId: oneSignalPlayerId!,
      // pushwooshHWID: pushwooshHWID!,
      // firebaseAppInstanceId: firebaseAppInstanceId!,
    } as any;

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return new AdaptyProfileParametersCoder(result);
  }

  public encode(): Record<string, any> {
    const d = this.data;

    const result = {
      first_name: d.firstName,
      last_name: d.lastName,
      gender: d.gender,
      birthday: d.birthday,
      email: d.email,
      phone_number: d.phoneNumber,
      facebook_anonymous_id: d.facebookAnonymousId,
      amplitude_user_id: d.amplitudeUserId,
      amplitude_device_id: d.amplitudeDeviceId,
      mixpanel_user_id: d.mixpanelUserId,
      appmetrica_profile_id: d.appmetricaProfileId,
      appmetrica_device_id: d.appmetricaDeviceId,
      store_country: d.storeCountry,
      att_status: d.appTrackingTransparencyStatus,
      custom_attributes: d.codableCustomAttributes,
      analytics_disabled: d.analyticsDisabled,
      one_signal_player_id: d.oneSignalPlayerId,
      pushwoosh_hwid: d.pushwooshHWID,
      firebase_app_instance_id: d.firebaseAppInstanceId,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    return result;
  }
}
