import { AdaptyError } from '@/adapty-error';
import { LogContext } from '../logger';
import { AdaptyNativeErrorCoder } from './adapty-native-error';
import { AdaptyPaywallCoder } from './adapty-paywall';
import { AdaptyPaywallProductCoder } from './adapty-paywall-product';
import { AdaptyProfileCoder } from './adapty-profile';
import { ArrayCoder } from './array';
import { BridgeErrorCoder } from './bridge-error';
import { ErrorConverter } from './error-coder';
import type { Converter } from './types';
import { AdaptyRemoteConfigCoder } from './adapty-remote-config';
import { AdaptyPaywallBuilderCoder } from './adapty-paywall-builder';
import { AdaptyPurchaseResultCoder } from '@/coders/adapty-purchase-result';
import { AdaptyOnboardingCoder } from '@/coders/adapty-onboarding';
import { AdaptyUiOnboardingMetaCoder } from '@/coders/adapty-ui-onboarding-meta';
import { AdaptyUiOnboardingStateParamsCoder } from '@/coders/adapty-ui-onboarding-state-params';
import { AdaptyUiOnboardingStateUpdatedActionCoder } from '@/coders/adapty-ui-onboarding-state-updated-action';

const AdaptyTypes = [
  'AdaptyError',
  'AdaptyProfile',
  'AdaptyPurchaseResult',
  'AdaptyPaywall',
  'AdaptyPaywallProduct',
  'AdaptyOnboarding',
  'AdaptyRemoteConfig',
  'AdaptyPaywallBuilder',
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
    default:
      return null;
  }
}

export function parsePaywallEvent(
  input: string,
  ctx?: LogContext,
): Record<string, any> {
  const log = ctx?.decode({ methodName: 'parsePaywallEvent' });
  log?.start({ input });

  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(input);
  } catch (error) {
    throw AdaptyError.failedToDecode(
      `Failed to decode event: ${(error as Error)?.message}`,
    );
  }

  const result: Record<string, any> = {};

  if (obj.hasOwnProperty('id')) {
    result['id'] = obj['id'];
  }
  if (obj.hasOwnProperty('profile')) {
    result['profile'] = getCoder('AdaptyProfile', ctx)?.decode(obj['profile']);
  }
  if (obj.hasOwnProperty('product')) {
    result['product'] = getCoder('AdaptyPaywallProduct', ctx)?.decode(
      obj['product'],
    );
  }
  if (obj.hasOwnProperty('error')) {
    result['error'] = getCoder('AdaptyError', ctx)?.decode(obj['error']);
  }
  if (obj.hasOwnProperty('action')) {
    result['action'] = obj['action'];
  }
  if (obj.hasOwnProperty('view')) {
    result['view'] = obj['view'];
  }
  if (obj.hasOwnProperty('product_id')) {
    result['product_id'] = obj['product_id'];
  }
  if (obj.hasOwnProperty('purchased_result')) {
    result['purchased_result'] = getCoder('AdaptyPurchaseResult', ctx)?.decode(
      obj['purchased_result'],
    );
  }

  return result;
}

function getCoder(
  type: AdaptyType,
  ctx?: LogContext,
): Converter<any, any> | ErrorConverter<any> | null {
  ctx?.stack;

  switch (type as AdaptyType) {
    case 'AdaptyError':
      return new AdaptyNativeErrorCoder();
    case 'AdaptyProfile':
      return new AdaptyProfileCoder();
    case 'AdaptyPaywall':
      return new AdaptyPaywallCoder();
    case 'AdaptyPaywallProduct':
      return new AdaptyPaywallProductCoder();
    case 'AdaptyRemoteConfig':
      return new AdaptyRemoteConfigCoder();
    case 'AdaptyPaywallBuilder':
      return new AdaptyPaywallBuilderCoder();
    case 'AdaptyOnboarding':
      return new AdaptyOnboardingCoder();
    case 'AdaptyPurchaseResult':
      return new AdaptyPurchaseResultCoder();
    case 'AdaptyUiOnboardingMeta':
      return new AdaptyUiOnboardingMetaCoder();
    case 'AdaptyUiOnboardingStateParams':
      return new AdaptyUiOnboardingStateParamsCoder();
    case 'AdaptyUiOnboardingStateUpdatedAction':
      return new AdaptyUiOnboardingStateUpdatedActionCoder();
    case 'BridgeError':
      return new BridgeErrorCoder();
    case 'Array<AdaptyPaywallProduct>':
      return new ArrayCoder(AdaptyPaywallProductCoder as any);
    case 'String':
      return null;
  }
  // @ts-ignore
  throw AdaptyError.failedToDecode(
    `Failed to decode native response. Response has unexpected "type" property: ${type}`,
  );
}
