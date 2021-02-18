import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext } from './types';

/**
 *
 */
export interface AdaptyUser {
  /**
   * Adapty UserID for admin panel
   *
   * The most common usecases are after registration,
   * when a user switches from being an anonymous user
   * to an authenticated user with some ID
   *
   * @example "122", "1a262ce2"
   */
  customerUserId: string;
  /**
   * User's first name
   * @example "John"
   */
  firstName: string;
  /**
   * User's last name
   * @example "Doe"
   */
  lastName: string;
  /**
   * User email, can hold any string
   * @example "client@adapty.io"
   */
  email: string;
  /**
   * User phone number, can hold any string
   * @example "+10000000000"
   */
  phoneNumber: string;
  /**
   * User sex, default types are "male" & "female", "other" though
   * you can hold any value
   * @example "male"
   */
  gender: 'male' | 'female' | 'other';
  /**
   * User birthday
   * @example "2020-02-17"
   */
  birthday: Date; // TO ISO
  /**
   * IDFA (The Identifier for Advertisers)
   * @example "EEEEEEEE-AAAA-BBBB-CCCC-DDDDDDDDDDDD"
   */
  idfa: string;
  /**
   * Facebook UserID
   * @example "00000000000000"
   */
  facebookUserId: string;
  /**
   * Facebook Anonymous ID
   */
  facebookAnonymousId: string;
  /**
   * Amplitude UserID
   * @example "00000000000000"
   */
  amplitudeUserId: string;
  /**
   * Mixpanel UserID
   * @example "00000000000000"
   */
  mixpanelUserId: string;
  /**
   * AppMetrica ProfileID
   * @example "00000000000000"
   */
  appmetricaProfileId: string;
  /**
   * AppMetrica DeviceID
   * @example "00000000000000"
   */
  appmetricaDeviceId: string;

  customAttributes: Record<string, string | number | boolean>;

  attStatus: 0 | 1 | 2 | 3;
}

export class User {
  private _ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this._ctx = context;
  }

  /**
   * Use identify to set userID to a current session
   *
   * @returns Promised
   * @throws AdaptyError
   */
  public async identify(customerUserId: string): Promise<void> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const result = await this._ctx.module.identify(customerUserId);
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   * Updates any available fields to a current user
   * @returns Promised
   * @throws AdaptyError
   */
  public async updateProfile(
    updatedFields: Partial<AdaptyUser>,
  ): Promise<void> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      if (updatedFields.hasOwnProperty('birthday')) {
        updatedFields.birthday = updatedFields.birthday?.toISOString() as any;
      }

      const result = await this._ctx.module.updateProfile(updatedFields);
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }

  /**
   * Drops a user connected to the session
   *
   * @throws AdaptyError
   */
  public async logout(): Promise<void> {
    isSdkAuthorized(this._ctx.isActivated);

    try {
      const result = await this._ctx.module.logout();
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
