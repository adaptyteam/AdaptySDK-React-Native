import * as Input from '@/types/inputs';
import type { Def } from '@/types/schema';
import { Platform } from 'react-native';
import { AdaptyUiMediaCacheCoder } from '@/coders/adapty-ui-media-cache';
import version from '@/version';

type Model = Input.ActivateParamsInput;
type Serializable = Def['AdaptyConfiguration'];

export class AdaptyConfigurationCoder {
  encode(apiKey: string, params: Model): Serializable {
    const config: Serializable = {
      api_key: apiKey,
      cross_platform_sdk_name: 'react-native',
      cross_platform_sdk_version: version,
    };

    if (params.customerUserId) {
      config['customer_user_id'] = params.customerUserId;
    }

    config['observer_mode'] = params.observerMode ?? false;
    config['ip_address_collection_disabled'] =
      params.ipAddressCollectionDisabled ?? false;

    if (params.logLevel) {
      config['log_level'] = params.logLevel;
    }

    config['server_cluster'] = params.serverCluster ?? 'default';

    if (params.backendProxyHost) {
      config['backend_proxy_host'] = params.backendProxyHost;
    }

    if (params.backendProxyPort) {
      config['backend_proxy_port'] = params.backendProxyPort;
    }

    config['activate_ui'] = params.activateUi ?? true;

    const mediaCacheCoder = new AdaptyUiMediaCacheCoder();
    config['media_cache'] = mediaCacheCoder.encode(
      params.mediaCache ?? {
        memoryStorageTotalCostLimit: 100 * 1024 * 1024,
        memoryStorageCountLimit: 2147483647,
        diskStorageSizeLimit: 100 * 1024 * 1024,
      },
    );

    if (Platform.OS === 'ios') {
      config['apple_idfa_collection_disabled'] =
        params.ios?.idfaCollectionDisabled ?? false;
      if (params.ios?.appAccountToken) {
        config['customer_identity_parameters'] = {
          app_account_token: params.ios.appAccountToken,
        };
      }
    }

    if (Platform.OS === 'android') {
      config['google_adid_collection_disabled'] =
        params.android?.adIdCollectionDisabled ?? false;
      config['google_enable_pending_prepaid_plans'] =
        params.android?.pendingPrepaidPlansEnabled ?? false;
      config['google_local_access_level_allowed'] =
        params.android?.localAccessLevelAllowed ?? false;
      if (params.android?.obfuscatedAccountId) {
        config['customer_identity_parameters'] = {
          obfuscated_account_id: params.android.obfuscatedAccountId,
        };
      }
    }

    return config;
  }
}
