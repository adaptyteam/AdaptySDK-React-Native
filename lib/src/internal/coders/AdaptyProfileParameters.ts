import { LogContext } from '../../logger';
import type { AdaptyProfileParameters } from '../../types';

import { Coder } from './coder';

type Type = AdaptyProfileParameters;

export class AdaptyProfileParametersCoder extends Coder<Type> {
  constructor(data: Type) {
    super(data);
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyProfileParametersCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      const error = this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });

      log?.failed({ error });
      throw error;
    }

    const firstName = data['first_name'] as Type['firstName'];
    if (firstName && typeof firstName !== 'string') {
      const error = this.errType({
        name: 'firstName',
        expected: 'string',
        current: typeof firstName,
      });

      log?.failed({ error });
      throw error;
    }

    const lastName = data['last_name'] as Type['lastName'];
    if (lastName && typeof lastName !== 'string') {
      const error = this.errType({
        name: 'lastName',
        expected: 'string',
        current: typeof lastName,
      });

      log?.failed({ error });
      throw error;
    }

    const gender = data['gender'] as Type['gender'];
    if (gender && typeof gender !== 'string') {
      const error = this.errType({
        name: 'gender',
        expected: 'string',
        current: typeof gender,
      });

      log?.failed({ error });
      throw error;
    }

    const birthday = data['birthday'] as Type['birthday'];
    if (birthday && typeof birthday !== 'string') {
      const error = this.errType({
        name: 'birthday',
        expected: 'string',
        current: typeof birthday,
      });

      log?.failed({ error });
      throw error;
    }

    const email = data['email'] as Type['email'];
    if (email && typeof email !== 'string') {
      const error = this.errType({
        name: 'email',
        expected: 'string',
        current: typeof email,
      });

      log?.failed({ error });
      throw error;
    }

    const phoneNumber = data['phone_number'] as Type['phoneNumber'];
    if (phoneNumber && typeof phoneNumber !== 'string') {
      const error = this.errType({
        name: 'phoneNumber',
        expected: 'string',
        current: typeof phoneNumber,
      });

      log?.failed({ error });
      throw error;
    }

    const facebookAnonymousId = data[
      'facebook_anonymous_id'
    ] as Type['facebookAnonymousId'];
    if (facebookAnonymousId && typeof facebookAnonymousId !== 'string') {
      const error = this.errType({
        name: 'facebookAnonymousId',
        expected: 'string',
        current: typeof facebookAnonymousId,
      });

      log?.failed({ error });
      throw error;
    }

    const amplitudeUserId = data[
      'amplitude_user_id'
    ] as Type['amplitudeUserId'];
    if (amplitudeUserId && typeof amplitudeUserId !== 'string') {
      const error = this.errType({
        name: 'amplitudeUserId',
        expected: 'string',
        current: typeof amplitudeUserId,
      });

      log?.failed({ error });
      throw error;
    }

    const amplitudeDeviceId = data[
      'amplitude_device_id'
    ] as Type['amplitudeDeviceId'];
    if (amplitudeDeviceId && typeof amplitudeDeviceId !== 'string') {
      const error = this.errType({
        name: 'amplitudeDeviceId',
        expected: 'string',
        current: typeof amplitudeDeviceId,
      });

      log?.failed({ error });
      throw error;
    }

    const mixpanelUserId = data['mixpanel_user_id'] as Type['mixpanelUserId'];
    if (mixpanelUserId && typeof mixpanelUserId !== 'string') {
      const error = this.errType({
        name: 'mixpanelUserId',
        expected: 'string',
        current: typeof mixpanelUserId,
      });

      log?.failed({ error });
      throw error;
    }

    const appmetricaProfileId = data[
      'appmetrica_profile_id'
    ] as Type['appmetricaProfileId'];
    if (appmetricaProfileId && typeof appmetricaProfileId !== 'string') {
      const error = this.errType({
        name: 'appmetricaProfileId',
        expected: 'string',
        current: typeof appmetricaProfileId,
      });

      log?.failed({ error });
      throw error;
    }

    const appmetricaDeviceId = data[
      'appmetrica_device_id'
    ] as Type['appmetricaDeviceId'];
    if (appmetricaDeviceId && typeof appmetricaDeviceId !== 'string') {
      const error = this.errType({
        name: 'appmetricaDeviceId',
        expected: 'string',
        current: typeof appmetricaDeviceId,
      });

      log?.failed({ error });
      throw error;
    }

    const storeCountry = data['store_country'] as Type['storeCountry'];
    if (storeCountry && typeof storeCountry !== 'string') {
      const error = this.errType({
        name: 'storeCountry',
        expected: 'string',
        current: typeof storeCountry,
      });

      log?.failed({ error });
      throw error;
    }

    const appTrackingTransparencyStatus = data[
      'att_status'
    ] as Type['appTrackingTransparencyStatus'];
    if (
      appTrackingTransparencyStatus &&
      typeof appTrackingTransparencyStatus !== 'string'
    ) {
      const error = this.errType({
        name: 'appTrackingTransparencyStatus',
        expected: 'string',
        current: typeof appTrackingTransparencyStatus,
      });

      log?.failed({ error });
      throw error;
    }

    const codableCustomAttributes = data[
      'custom_attributes'
    ] as Type['codableCustomAttributes'];
    if (
      codableCustomAttributes &&
      typeof codableCustomAttributes !== 'object'
    ) {
      const error = this.errType({
        name: 'codableCustomAttributes',
        expected: 'object',
        current: typeof codableCustomAttributes,
      });

      log?.failed({ error });
      throw error;
    }

    const analyticsDisabled = data[
      'analytics_disabled'
    ] as Type['analyticsDisabled'];
    if (
      (analyticsDisabled !== undefined || analyticsDisabled !== null) &&
      typeof analyticsDisabled !== 'boolean'
    ) {
      const error = this.errType({
        name: 'analyticsDisabled',
        expected: 'boolean',
        current: typeof analyticsDisabled,
      });

      log?.failed({ error });
      throw error;
    }

    const oneSignalPlayerId = data[
      'onesignal_player_id'
    ] as Type['oneSignalPlayerId'];
    if (oneSignalPlayerId && typeof oneSignalPlayerId !== 'string') {
      const error = this.errType({
        name: 'oneSignalPlayerId',
        expected: 'string',
        current: typeof oneSignalPlayerId,
      });

      log?.failed({ error });
      throw error;
    }

    const pushwooshHWID = data['pushwoosh_hwid'] as Type['pushwooshHWID'];
    if (pushwooshHWID && typeof pushwooshHWID !== 'string') {
      const error = this.errType({
        name: 'pushwooshHWID',
        expected: 'string',
        current: typeof pushwooshHWID,
      });

      log?.failed({ error });
      throw error;
    }

    const firebaseAppInstanceId = data[
      'firebase_app_instance_id'
    ] as Type['firebaseAppInstanceId'];
    if (firebaseAppInstanceId && typeof firebaseAppInstanceId !== 'string') {
      const error = this.errType({
        name: 'firebaseAppInstanceId',
        expected: 'string',
        current: typeof firebaseAppInstanceId,
      });

      log?.failed({ error });
      throw error;
    }

    const airbridgeDeviceId = data[
      'airbridge_device_id'
    ] as Type['airbridgeDeviceId'];
    if (airbridgeDeviceId && typeof airbridgeDeviceId !== 'string') {
      const error = this.errType({
        name: 'airbridgeDeviceId',
        expected: 'string',
        current: typeof airbridgeDeviceId,
      });

      log?.failed({ error });
      throw error;
    }

    const result: Required<Type> = {
      firstName: firstName!,
      lastName: lastName!,
      gender: gender!,
      birthday: birthday!,
      email: email!,
      phoneNumber: phoneNumber!,
      facebookAnonymousId: facebookAnonymousId!,
      amplitudeUserId: amplitudeUserId!,
      amplitudeDeviceId: amplitudeDeviceId!,
      mixpanelUserId: mixpanelUserId!,
      appmetricaProfileId: appmetricaProfileId!,
      appmetricaDeviceId: appmetricaDeviceId!,
      storeCountry: storeCountry!,
      appTrackingTransparencyStatus: appTrackingTransparencyStatus!,
      codableCustomAttributes: codableCustomAttributes!,
      analyticsDisabled: analyticsDisabled!,
      oneSignalPlayerId: oneSignalPlayerId!,
      pushwooshHWID: pushwooshHWID!,
      firebaseAppInstanceId: firebaseAppInstanceId!,
      airbridgeDeviceId: airbridgeDeviceId!,
    } as any;

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    log?.success(result);
    return new AdaptyProfileParametersCoder(result);
  }

  public encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });
    const d = this.data;
    log?.start(d);

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
      airbridge_device_id: d.airbridgeDeviceId,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    log?.success({ json: result });
    return result;
  }
}
