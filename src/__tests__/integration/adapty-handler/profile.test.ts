import { Adapty } from '@/adapty-handler';
import { createAdaptyInstance, cleanupAdapty } from './setup.utils';

describe('Adapty - Profile', () => {
  let adapty: Adapty;

  beforeEach(async () => {
    adapty = await createAdaptyInstance();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
  });

  describe('Profile update behavior', () => {
    it('should return only customAttributes in profile', async () => {
      // According to Adapty documentation, getProfile() only returns customAttributes.
      // Other fields (firstName, lastName, email, phoneNumber) are sent to server
      // for CRM/segmentation but not returned in profile.

      const profileParams = {
        email: 'bug3test@example.com',
        phoneNumber: '+9876543210',
        firstName: 'Jane',
        lastName: 'Smith',
        codableCustomAttributes: {
          membership: 'gold',
          testing: 'bug3',
        },
      };

      // Update profile through the full flow
      await adapty.updateProfile(profileParams);

      // Get profile to verify correct update
      const profile = await adapty.getProfile();

      // Verify that personal fields are not returned
      expect((profile as any).email).toBeUndefined();
      expect((profile as any).phoneNumber).toBeUndefined();
      expect((profile as any).phone_number).toBeUndefined();
      expect((profile as any).firstName).toBeUndefined();
      expect((profile as any).first_name).toBeUndefined();
      expect((profile as any).lastName).toBeUndefined();
      expect((profile as any).last_name).toBeUndefined();

      // Only customAttributes are stored and returned
      expect(profile.customAttributes).toBeDefined();
      expect(profile.customAttributes).toEqual({
        membership: 'gold',
        testing: 'bug3',
      });
    });
  });
});


