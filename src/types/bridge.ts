import type { EmitterSubscription } from 'react-native';
import type { AdaptyProfile, AdaptyInstallationDetails } from '@/types';
import type { AdaptyError } from '@/adapty-error';
import type { UserEventName } from '@adapty/core';

export { MethodNames } from '@adapty/core';

export type {
  MethodName,
  Serializable,
  AdaptyNativeError,
  AdaptyBridgeError,
  UserEventName,
} from '@adapty/core';

export type AddListenerGeneric<E extends UserEventName, Data> = (
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
