import { extractModule } from '../utils';
import { AdaptyUser, User } from './user';

export class Adapty {
  private _module = extractModule();

  public user: User;

  constructor() {
    this.user = new User(this._module);
  }

  /**
   * Updates
   *
   * @throws AdaptyError
   */
  public async updateAttribution(
    attribution: Partial<any>,
    source: 'adjust' | 'appsflyer' | 'branch' | 'custom',
    networkUserId?: string,
  ): Promise<void> {
    console.log(attribution, networkUserId, source);
  }

  /**
   * Updates user Adapty profile
   *
   * @throws AdaptyError
   */
  public async updateProfile(
    profileUpdates: Partial<AdaptyUser>,
  ): Promise<void> {
    console.log(profileUpdates);
  }

  /**
   *
   */
  public async showPaywall() {}

  public async makePurchase() {}

  public async restorePurchases() {}
}
