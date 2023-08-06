import { NativeModules } from 'react-native';

import { parse } from '@/coders';
import {
  MethodName,
  ParamMap,
  MODULE_NAME,
  HANDLER_NAME,
} from '@/types/bridge';
import type { LogContext } from '@/logger';

// Just a type defenition for bridge handle function
const call = NativeModules[MODULE_NAME][HANDLER_NAME] as (
  methodName: MethodName,
  params: ParamMap,
) => Promise<string>;

/**
 * Interface for calling bridge methods.
 * All Adapty methods should be called via this function
 */
export async function handle<T>(
  methodName: MethodName,
  params: ParamMap,
  ctx?: LogContext,
): Promise<T> {
  const log = ctx?.bridge({ methodName: `handle/${methodName}` });
  log?.start({ methodName, params });

  try {
    const response = await call(methodName, params);
    const result = parse<T>(response, ctx);

    log?.success({ response });
    return result;
  } catch (error) {
    log?.success({ error });

    if (typeof error !== 'object' || error === null) {
      throw new Error('Unknown error: ' + error);
    }

    const errorObj = error as Record<string, any>;
    if (!errorObj.hasOwnProperty('message') || !errorObj['message']) {
      throw new Error(
        'Error does not have expected messsage property: ' + errorObj,
      );
    }
    const encodedMsg = errorObj['message'];

    const adaptyError = parse(encodedMsg);
    throw adaptyError;
  }
}
