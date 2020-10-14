import { useEffect } from 'react';
import { adapty } from './adapty';
import { Adapty } from './sdk';
import { AdaptyError } from './sdk/error';
import { extractModule } from './utils';

interface AdaptyActivateArgs {
  /**
   * Public Adapty SDK Key.
   *
   * @description
   * It is being used to define the project
   * you are coding.
   *
   * Can be found in:
   * `App settings` -> `API Keys` -> `Public SDK key`
   * @see https://app.adapty.io/settings/general
   */
  sdkKey: string;

  /**
   * @example
   * customerUserId: AsyncStorage.get('user_id')
   *
   * @description
   * Customer User ID lets you convert
   * undefined user to identifiable in order to
   * look this user in _Adapty Profiles_
   *
   * If the user is not logged in yet or there is no
   * uID yet you can leave this field `undefined`, but always
   * consider passing the value.
   */
  customerUserId?: string;

  /**
   * @description
   * In some cases, if you have already built a
   * functioning subscription system, it may not be possible
   * or feasible to use the Adapty SDK to make purchases.
   * However, you can still use the SDK to get access to the data
   *
   * @default false
   */
  observerMode?: boolean;

  /**
   * @default "none"
   */
  logLevel?: 'verbose' | 'errors' | 'none';
}

/**
 * @deprecated
 * Consider always placing this hook
 * in a core component to be able to use
 * SDK anywhere in your application.
 *
 * This hook should be mounted before using an SDK.
 * For more information about arguments look for an @interface AdaptyActivateArgs
 */
export function useAdapty(props: AdaptyActivateArgs): void {
  useEffect(() => {
    activateAdapty(props);
  }, [props]);
}

/**
 * @description
 * This function makes it possible
 * to use Adapty SDK, consider placing it
 * inside a core `useEffect` or a core `didComponentMount`
 *
 * @example
 * useEffect(() => {
 *   activateAdapty({
 *     sdkKey: "Public_sdk_key",
 *     customerUserId: myUser.id
 *   });
 * },[myUser.id]);
 *
 * @description
 * This function should be called before using an SDK.
 * For more information about arguments look for an @interface AdaptyActivateArgs
 */
export async function activateAdapty(props: AdaptyActivateArgs): Promise<void> {
  const module = extractModule();

  const userId = props.customerUserId || null;

  const DEFAULT_LOG_LEVEL = 'none';
  const logLevel = props.logLevel || DEFAULT_LOG_LEVEL;

  const sdkKey = props.sdkKey;
  if (!sdkKey) {
    throw new AdaptyError({
      title: 'Adapty init error',
      description: "SDK Key wasn't passed",
    });
  }

  const DEFAULT_OBSERVER_MODE = false;
  const isModeObserver =
    props.observerMode !== undefined
      ? props.observerMode
      : DEFAULT_OBSERVER_MODE;

  try {
    await module.activate(sdkKey, userId, isModeObserver, logLevel);
    await Adapty.activateSdk(adapty, sdkKey);
  } catch (error) {
    throw error;
  }
}
