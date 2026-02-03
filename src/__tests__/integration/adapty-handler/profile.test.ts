/**
 * Profile Integration Tests
 *
 * Tests profile management operations:
 * - GetProfile request format and response parsing
 * - UpdateProfile request encoding (camelCase → snake_case)
 * - Verify only customAttributes returned in profile
 */

import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  expectNativeCall,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PROFILE_RESPONSE_WITH_CUSTOM_ATTRS,
  UPDATE_PROFILE_RESPONSE_SUCCESS,
  UPDATE_PROFILE_RESPONSE_ERROR,
} from './bridge-samples';

describe('Adapty - Profile', () => {
  let nativeMock: MockNativeModule;
  let adapty: Adapty;

  beforeEach(() => {
    // Create native module mock with responses for activate, get_profile, update_profile
    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_profile: GET_PROFILE_RESPONSE_WITH_CUSTOM_ATTRS,
      update_profile: UPDATE_PROFILE_RESPONSE_SUCCESS,
    });

    // Create SDK instance
    adapty = new Adapty();
  });

  afterEach(() => {
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('Profile update and retrieval', () => {
    it('should send UpdateProfile in snake_case and return only customAttributes', async () => {
      // Activate SDK
      await adapty.activate('test_api_key');

      // Update profile with camelCase fields
      await adapty.updateProfile({
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        firstName: 'John',
        lastName: 'Doe',
        codableCustomAttributes: {
          membership: 'premium',
          level: 42,
        },
      });

      // Verify UpdateProfile request sent in snake_case
      const updateRequest = extractNativeRequest<
        components['requests']['UpdateProfile.Request']
      >(nativeMock, 1); // Call index 1 (after activate)

      expect(updateRequest.method).toBe('update_profile');
      expect(updateRequest.params).toMatchObject({
        email: 'test@example.com',
        phone_number: '+1234567890', // snake_case conversion
        first_name: 'John', // snake_case conversion
        last_name: 'Doe', // snake_case conversion
        custom_attributes: {
          membership: 'premium',
          level: 42,
        },
      });

      // Get profile to verify response parsing
      const profile = await adapty.getProfile();

      // Verify GetProfile request
      expectNativeCall(
        nativeMock,
        'get_profile',
        { method: 'get_profile' },
        2, // Call index 2 (after activate and update_profile)
      );

      // Verify that personal fields are NOT returned in profile
      expect((profile as any).email).toBeUndefined();
      expect((profile as any).phoneNumber).toBeUndefined();
      expect((profile as any).phone_number).toBeUndefined();
      expect((profile as any).firstName).toBeUndefined();
      expect((profile as any).first_name).toBeUndefined();
      expect((profile as any).lastName).toBeUndefined();
      expect((profile as any).last_name).toBeUndefined();

      // Only customAttributes are returned
      expect(profile.customAttributes).toBeDefined();
      expect(profile.customAttributes).toEqual({
        user_level: 42,
        referral_code: 'FRIEND2024',
      });
    });
  });

  describe('Error handling', () => {
    it('should parse AdaptyError from UpdateProfile.Response', async () => {
      // Reset bridge and create new mock with error response for update_profile
      resetBridge();
      nativeMock = createNativeModuleMock({
        activate: ACTIVATE_RESPONSE_SUCCESS,
        update_profile: UPDATE_PROFILE_RESPONSE_ERROR,
      });

      // Create new Adapty instance and activate SDK
      adapty = new Adapty();
      await adapty.activate('test_api_key');

      // Execute: update profile should throw AdaptyError with adaptyCode
      await expect(
        adapty.updateProfile({ email: 'test@example.com' }),
      ).rejects.toMatchObject({
        adaptyCode: 2, // camelCase in JS (from native adapty_code)
      });
    });
  });
});
