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
      log?.failed('Error parsing input: invalid type');

      throw new Error('Invalid input: must be a string or object');
    }
  } catch (error) {
    log?.failed('Error parsing input' + error);

    throw new Error('Error parsing input: ' + error);
  }

  // Compare JSON to AdaptyResult
  if (!obj.hasOwnProperty('type')) {
    throw new Error('Invalid input: missing "type" property');
  }
  if (!obj.hasOwnProperty('data')) {
    throw new Error('Invalid input: missing "data" property');
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
  throw new Error('Unexpected type');
}
