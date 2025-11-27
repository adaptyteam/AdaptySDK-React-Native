import { AdaptyIdentifyParamsCoder } from '@/coders/adapty-identify-params';

describe('AdaptyIdentifyParamsCoder', () => {
  const coder = new AdaptyIdentifyParamsCoder();

  it('should return undefined for empty params', () => {
    const result = coder.encode({});
    expect(result).toBeUndefined();
  });

  it('should return undefined for undefined params', () => {
    const result = coder.encode(undefined);
    expect(result).toBeUndefined();
  });

  it('should encode iOS app account token on iOS platform', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'ios' };

    const params = {
      ios: {
        appAccountToken: 'ios-token-123',
      },
    };

    const result = coder.encode(params);
    expect(result).toEqual({
      app_account_token: 'ios-token-123',
    });

    require('react-native').Platform = originalPlatform;
  });

  it('should encode Android obfuscated account ID on Android platform', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'android' };

    const params = {
      android: {
        obfuscatedAccountId: 'android-id-456',
      },
    };

    const result = coder.encode(params);
    expect(result).toEqual({
      obfuscated_account_id: 'android-id-456',
    });

    require('react-native').Platform = originalPlatform;
  });

  it('should only encode iOS parameters when on iOS platform', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'ios' };

    const params = {
      ios: {
        appAccountToken: 'ios-token-123',
      },
      android: {
        obfuscatedAccountId: 'android-id-456',
      },
    };

    const result = coder.encode(params);
    expect(result).toEqual({
      app_account_token: 'ios-token-123',
    });

    require('react-native').Platform = originalPlatform;
  });

  it('should only encode Android parameters when on Android platform', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'android' };

    const params = {
      ios: {
        appAccountToken: 'ios-token-123',
      },
      android: {
        obfuscatedAccountId: 'android-id-456',
      },
    };

    const result = coder.encode(params);
    expect(result).toEqual({
      obfuscated_account_id: 'android-id-456',
    });

    require('react-native').Platform = originalPlatform;
  });

  it('should ignore iOS parameters on Android platform', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'android' };

    const params = {
      ios: {
        appAccountToken: 'ios-token-123',
      },
    };

    const result = coder.encode(params);
    expect(result).toBeUndefined();

    require('react-native').Platform = originalPlatform;
  });

  it('should ignore Android parameters on iOS platform', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'ios' };

    const params = {
      android: {
        obfuscatedAccountId: 'android-id-456',
      },
    };

    const result = coder.encode(params);
    expect(result).toBeUndefined();

    require('react-native').Platform = originalPlatform;
  });

  it('should handle empty platform objects', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'ios' };

    const params = {
      ios: {},
      android: {},
    };

    const result = coder.encode(params);
    expect(result).toBeUndefined();

    require('react-native').Platform = originalPlatform;
  });
});
