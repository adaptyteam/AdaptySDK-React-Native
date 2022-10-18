import { attemptToDecodeError, isSdkAuthorized } from './error';
import { AdaptyContext, AdaptyProfile } from './types';

export class Profile {
  private ctx: AdaptyContext;
  constructor(context: AdaptyContext) {
    this.ctx = context;
  }

  /**
   * Use identify to set userID to a current session
   *
   * @returns Promised
   * @throws AdaptyError
   */
  public async identify(customerUserId: string): Promise<void> {
    isSdkAuthorized(this.ctx.isActivated);

    try {
      const result = await this.ctx.module.identify(customerUserId);
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
  public async update(updatedFields: Partial<AdaptyProfile>): Promise<void> {
    isSdkAuthorized(this.ctx.isActivated);

    try {
      if (updatedFields.hasOwnProperty('birthday')) {
        updatedFields.birthday = updatedFields.birthday?.toISOString() as any;
      }

      const result = await this.ctx.module.updateProfile(updatedFields);
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
    isSdkAuthorized(this.ctx.isActivated);

    try {
      const result = await this.ctx.module.logout();
      return result;
    } catch (error) {
      throw attemptToDecodeError(error);
    }
  }
}
