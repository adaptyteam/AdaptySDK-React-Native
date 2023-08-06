import { AdaptyError } from '..';
import { LogContext } from '../logger';
import { AdaptyNativeErrorCoder } from './adapty-native-error';
import { AdaptyPaywallCoder } from './adapty-paywall';
import { AdaptyProductCoder } from './adapty-product';
import { AdaptyProfileCoder } from './adapty-profile';
import { ArrayCoder } from './array';
import { BridgeErrorCoder } from './bridge-error';
import { ErrorConverter } from './error-coder';
import type { Converter } from './types';

const AdaptyTypes = [
  'AdaptyError',
  'AdaptyProfile',
  'AdaptyProduct',
  'AdaptyPaywall',
  'AdaptyPaywallProduct', // handleGetPaywallProducts returns array
  'Array<AdaptyPaywallProduct>',
  '[String : AdaptyEligibility]',
  'BridgeError',
  'null',
] as const;

type AdaptyType = (typeof AdaptyTypes)[number];

interface AdaptyResult<T> {
  type: AdaptyType;
  data: T;
}

export function parse<T>(input: string | unknown, ctx?: LogContext): T {
  const log = ctx?.decode({ methodName: 'parse' });
  log?.start({ input });

  let obj: AdaptyResult<unknown>;

  // Attempt to parse the input into a JSON object
  try {
    if (typeof input === 'string') {
      obj = JSON.parse(input);
    } else if (input !== null && typeof input === 'object') {
      obj = input as AdaptyResult<unknown>;
    } else {
      const error = AdaptyError.failedToDecode(
        `Failed to decode native response, because it has unexpected type. Expected: JSON string or object. Received: ${typeof input}`,
      );

      log?.failed(error.message);
      throw error;
    }
  } catch (error) {
    const adaptyError = AdaptyError.failedToDecode(
      `Failed to decode native response. JSON.parse raised an error: ${
        (error as Error)?.message || ''
      }`,
    );

    log?.failed(adaptyError.message);
    throw adaptyError;
  }

  // Compare JSON to AdaptyResult
  if (!obj.hasOwnProperty('type')) {
    const adaptyError = AdaptyError.failedToDecode(
      `Failed to decode native response. Response does not have expected "type" property`,
    );

    log?.failed(adaptyError.message);
    throw adaptyError;
  }
  if (!obj.hasOwnProperty('data')) {
    const adaptyError = AdaptyError.failedToDecode(
      `Failed to decode native response. Response does not have expected "data" property`,
    );

    log?.failed(adaptyError.message);
    throw adaptyError;
  }

  const coder = getCoder(obj.type, ctx);
  if (coder?.type !== 'error') {
    return coder?.decode(obj.data);
  }

  const errorData = coder?.decode(obj.data);
  return (coder as ErrorConverter<any>).getError(errorData) as T;
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
    case 'AdaptyProduct':
      return new AdaptyProductCoder();
    case 'AdaptyPaywallProduct':
      return new AdaptyPaywallCoder();
    case 'BridgeError':
      return new BridgeErrorCoder();
    case 'Array<AdaptyPaywallProduct>':
      return new ArrayCoder(AdaptyProductCoder as any);
    case '[String : AdaptyEligibility]':
      return null;
    case 'null':
      return null;
  }
  // @ts-ignore
  throw AdaptyError.failedToDecode(
    `Failed to decode native response. Response has unexpected "type" property: ${type}`,
  );
}
