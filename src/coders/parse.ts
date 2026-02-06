import { AdaptyError } from '@/adapty-error';
import { LogContext } from '../logger';
import type { Converter, ErrorConverter } from '@adapty/core';
import { coderFactory } from './factory';

const AdaptyTypes = [
  'AdaptyError',
  'AdaptyProfile',
  'AdaptyPurchaseResult',
  'AdaptyPaywall',
  'AdaptyPaywallProduct',
  'AdaptyOnboarding',
  'AdaptyRemoteConfig',
  'AdaptyPaywallBuilder',
  'AdaptyInstallationStatus',
  'AdaptyInstallationDetails',
  'AdaptyUiView',
  'AdaptyUiDialogActionType',
  'AdaptyUiOnboardingMeta',
  'AdaptyUiOnboardingStateParams',
  'AdaptyUiOnboardingStateUpdatedAction',
  'Array<AdaptyPaywallProduct>',
  'BridgeError',
  'String',
  'Boolean',
  'Void',
] as const;

export type AdaptyType = (typeof AdaptyTypes)[number];

interface AdaptyResult<T> {
  success?: T;
  error?: AdaptyResultError;
}

interface AdaptyResultError {
  adaptyCode: number;
  message: string;
  detail?: string;
}

export function parseMethodResult<T>(
  input: string,
  resultType: AdaptyType,
  ctx?: LogContext,
): T {
  const log = ctx?.decode({ methodName: 'parseMethodResult' });
  log?.start({ input });

  let obj: AdaptyResult<unknown>;

  // Attempt to parse the input into a JSON object
  try {
    obj = JSON.parse(input);
  } catch (error) {
    const adaptyError = AdaptyError.failedToDecode(
      `Failed to decode native response. JSON.parse raised an error: ${
        (error as Error)?.message || ''
      }`,
    );

    log?.failed(adaptyError.message);
    throw adaptyError;
  }

  if (obj.hasOwnProperty('success')) {
    if (
      [
        'String',
        'Boolean',
        'Void',
        'AdaptyUiView',
        'AdaptyUiDialogActionType',
      ].includes(resultType)
    ) {
      return obj.success as T;
    }

    const coder = getCoder(resultType, ctx);
    return coder?.decode(obj.success);
  } else if (obj.hasOwnProperty('error')) {
    const coder = getCoder('AdaptyError', ctx);
    const errorData = coder?.decode(obj.error);
    throw (coder as ErrorConverter<any>).getError(errorData);
  } else {
    const adaptyError = AdaptyError.failedToDecode(
      `Failed to decode native response. Response does not have expected "success" or "error" property`,
    );
    log?.failed(adaptyError.message);
    throw adaptyError;
  }
}

export function parseCommonEvent(
  event: string,
  input: string,
  ctx?: LogContext,
) {
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(input);
  } catch (error) {
    throw AdaptyError.failedToDecode(
      `Failed to decode event: ${(error as Error)?.message}`,
    );
  }
  switch (event) {
    case 'did_load_latest_profile':
      return getCoder('AdaptyProfile', ctx)?.decode(obj['profile']);
    case 'on_installation_details_success':
      return getCoder('AdaptyInstallationDetails', ctx)?.decode(obj['details']);
    case 'on_installation_details_fail':
      return getCoder('AdaptyError', ctx)?.decode(obj['error']);
    default:
      return null;
  }
}

function getCoder(
  type: AdaptyType,
  ctx?: LogContext,
): Converter<any, any> | ErrorConverter<any> | null {
  ctx?.stack;

  switch (type as AdaptyType) {
    case 'AdaptyError':
      return coderFactory.createNativeErrorCoder();
    case 'AdaptyProfile':
      return coderFactory.createProfileCoder();
    case 'AdaptyPaywall':
      return coderFactory.createPaywallCoder();
    case 'AdaptyPaywallProduct':
      return coderFactory.createPaywallProductCoder();
    case 'AdaptyRemoteConfig':
      return coderFactory.createRemoteConfigCoder();
    case 'AdaptyPaywallBuilder':
      return coderFactory.createPaywallBuilderCoder();
    case 'AdaptyOnboarding':
      return coderFactory.createOnboardingCoder();
    case 'AdaptyPurchaseResult':
      return coderFactory.createPurchaseResultCoder();
    case 'AdaptyInstallationStatus':
      return coderFactory.createInstallationStatusCoder();
    case 'AdaptyInstallationDetails':
      return coderFactory.createInstallationDetailsCoder();
    case 'AdaptyUiOnboardingMeta':
      return coderFactory.createUiOnboardingMetaCoder();
    case 'AdaptyUiOnboardingStateParams':
      return coderFactory.createUiOnboardingStateParamsCoder();
    case 'AdaptyUiOnboardingStateUpdatedAction':
      return coderFactory.createUiOnboardingStateUpdatedActionCoder();
    case 'BridgeError':
      return coderFactory.createBridgeErrorCoder();
    case 'Array<AdaptyPaywallProduct>':
      return coderFactory.createPaywallProductArrayCoder();
    case 'String':
      return null;
  }
  // @ts-ignore
  throw AdaptyError.failedToDecode(
    `Failed to decode native response. Response has unexpected "type" property: ${type}`,
  );
}
