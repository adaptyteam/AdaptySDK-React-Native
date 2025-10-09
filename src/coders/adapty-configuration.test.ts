import { AdaptyConfigurationCoder } from '@/coders/adapty-configuration';
import { LogLevel } from '@/types/inputs';
import version from '@/version';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('AdaptyConfigurationCoder', () => {
  const coder = new AdaptyConfigurationCoder();
  const apiKey = 'test-api-key';

  it('should encode minimal configuration', () => {
    const params = {};
    const result = coder.encode(apiKey, params);

    expect(result).toMatchObject({
      api_key: apiKey,
      cross_platform_sdk_name: 'react-native',
      cross_platform_sdk_version: version,
      observer_mode: false,
      ip_address_collection_disabled: false,
      server_cluster: 'default',
      activate_ui: true,
      media_cache: {
        memory_storage_total_cost_limit: 100 * 1024 * 1024,
        memory_storage_count_limit: 2147483647,
        disk_storage_size_limit: 100 * 1024 * 1024,
      },
    });
  });

  it('should encode full configuration with all parameters on ios', () => {
    const params = {
      customerUserId: 'user123',
      observerMode: true,
      ipAddressCollectionDisabled: true,
      logLevel: LogLevel.VERBOSE,
      serverCluster: 'eu' as const,
      backendBaseUrl: 'https://api.example.com',
      backendFallbackBaseUrl: 'https://fallback.example.com',
      backendConfigsBaseUrl: 'https://configs.example.com',
      backendUABaseUrl: 'https://ua.example.com',
      backendProxyHost: 'proxy.example.com',
      backendProxyPort: 8080,
      activateUi: false,
      mediaCache: {
        memoryStorageTotalCostLimit: 50 * 1024 * 1024,
        memoryStorageCountLimit: 1000,
        diskStorageSizeLimit: 200 * 1024 * 1024,
      },
      ios: {
        idfaCollectionDisabled: true,
        appAccountToken: 'token123',
      },
      android: {
        adIdCollectionDisabled: true,
        obfuscatedAccountId: 'id123',
      },
    };

    const result = coder.encode(apiKey, params);

    expect(result).toMatchObject({
      api_key: apiKey,
      cross_platform_sdk_name: 'react-native',
      cross_platform_sdk_version: version,
      customer_user_id: 'user123',
      customer_identity_parameters: {
        app_account_token: 'token123',
      },
      observer_mode: true,
      ip_address_collection_disabled: true,
      log_level: 'verbose',
      server_cluster: 'eu',
      backend_base_url: 'https://api.example.com',
      backend_fallback_base_url: 'https://fallback.example.com',
      backend_configs_base_url: 'https://configs.example.com',
      backend_ua_base_url: 'https://ua.example.com',
      backend_proxy_host: 'proxy.example.com',
      backend_proxy_port: 8080,
      activate_ui: false,
      media_cache: {
        memory_storage_total_cost_limit: 50 * 1024 * 1024,
        memory_storage_count_limit: 1000,
        disk_storage_size_limit: 200 * 1024 * 1024,
      },
    });
  });

  it('should encode full configuration with all parameters on android', () => {
    const originalPlatform = require('react-native').Platform;
    require('react-native').Platform = { OS: 'android' };
    const params = {
      customerUserId: 'user123',
      observerMode: true,
      ipAddressCollectionDisabled: true,
      logLevel: LogLevel.VERBOSE,
      serverCluster: 'eu' as const,
      backendBaseUrl: 'https://api.example.com',
      backendFallbackBaseUrl: 'https://fallback.example.com',
      backendConfigsBaseUrl: 'https://configs.example.com',
      backendUABaseUrl: 'https://ua.example.com',
      backendProxyHost: 'proxy.example.com',
      backendProxyPort: 8080,
      activateUi: false,
      mediaCache: {
        memoryStorageTotalCostLimit: 50 * 1024 * 1024,
        memoryStorageCountLimit: 1000,
        diskStorageSizeLimit: 200 * 1024 * 1024,
      },
      ios: {
        idfaCollectionDisabled: true,
        appAccountToken: 'token123',
      },
      android: {
        adIdCollectionDisabled: true,
        obfuscatedAccountId: 'id123',
      },
    };

    const result = coder.encode(apiKey, params);

    expect(result).toMatchObject({
      api_key: apiKey,
      cross_platform_sdk_name: 'react-native',
      cross_platform_sdk_version: version,
      customer_user_id: 'user123',
      customer_identity_parameters: {
        obfuscated_account_id: 'id123',
      },
      observer_mode: true,
      ip_address_collection_disabled: true,
      log_level: 'verbose',
      server_cluster: 'eu',
      backend_base_url: 'https://api.example.com',
      backend_fallback_base_url: 'https://fallback.example.com',
      backend_configs_base_url: 'https://configs.example.com',
      backend_ua_base_url: 'https://ua.example.com',
      backend_proxy_host: 'proxy.example.com',
      backend_proxy_port: 8080,
      activate_ui: false,
      media_cache: {
        memory_storage_total_cost_limit: 50 * 1024 * 1024,
        memory_storage_count_limit: 1000,
        disk_storage_size_limit: 200 * 1024 * 1024,
      },
    });

    require('react-native').Platform = originalPlatform;
  });

  it('should handle partial parameters', () => {
    const params = {
      customerUserId: 'user456',
      logLevel: LogLevel.WARN,
      serverCluster: 'cn' as const,
      backendBaseUrl: 'https://custom.api.com',
      ios: {
        idfaCollectionDisabled: false,
      },
    };

    const result = coder.encode(apiKey, params);

    expect(result).toMatchObject({
      api_key: apiKey,
      cross_platform_sdk_name: 'react-native',
      cross_platform_sdk_version: version,
      customer_user_id: 'user456',
      observer_mode: false,
      ip_address_collection_disabled: false,
      log_level: 'warn',
      server_cluster: 'cn',
      backend_base_url: 'https://custom.api.com',
      activate_ui: true,
      media_cache: {
        memory_storage_total_cost_limit: 100 * 1024 * 1024,
        memory_storage_count_limit: 2147483647,
        disk_storage_size_limit: 100 * 1024 * 1024,
      },
    });
  });

  it('should handle undefined logLevel', () => {
    const params = {};
    const result = coder.encode(apiKey, params);

    expect(result.media_cache).toEqual({
      memory_storage_total_cost_limit: 100 * 1024 * 1024,
      memory_storage_count_limit: 2147483647,
      disk_storage_size_limit: 100 * 1024 * 1024,
    });
    expect(result.log_level).toBeUndefined();
  });

  it('should prefer params media cache over default', () => {
    const params = {
      mediaCache: {
        memoryStorageTotalCostLimit: 25 * 1024 * 1024,
        memoryStorageCountLimit: 500,
        diskStorageSizeLimit: 75 * 1024 * 1024,
      },
    };

    const result = coder.encode(apiKey, params);

    expect(result.media_cache).toEqual({
      memory_storage_total_cost_limit: 25 * 1024 * 1024,
      memory_storage_count_limit: 500,
      disk_storage_size_limit: 75 * 1024 * 1024,
    });
  });
});
