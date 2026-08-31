import type { EmitterSubscription } from 'react-native';
import type { AdaptyProfile, AdaptyInstallationDetails } from '@/types';
import type { AdaptyError } from '@/adapty-error';
import type { GlobalEventName } from '@adapty/core';

export { MethodNames } from '@adapty/core';

export type {
  MethodName,
  Serializable,
  AdaptyNativeError,
  AdaptyBridgeError,
  GlobalEventName,
} from '@adapty/core';

export type AddListenerGeneric<E extends GlobalEventName, Data> = (
  event: E,
  callback: (data: Data) => void | Promise<void>,
) => EmitterSubscription;

export type AddListenerFn =
  | AddListenerGeneric<'onLatestProfileLoad', AdaptyProfile>
  | AddListenerGeneric<
      'onInstallationDetailsSuccess',
      AdaptyInstallationDetails
    >
  | AddListenerGeneric<'onInstallationDetailsFail', AdaptyError>;
