import {
  parseMethodResult as _parseMethodResult,
  parseCommonEvent as _parseCommonEvent,
  type AdaptyType,
} from '@adapty/core';
import type { LogContext } from '../logger';
import { coderFactory } from './factory';

export type { AdaptyType };

export const parseMethodResult = <T>(
  input: string,
  resultType: AdaptyType,
  ctx?: LogContext,
): T => _parseMethodResult<T>(coderFactory, input, resultType, ctx);

export const parseCommonEvent = (
  event: string,
  input: string,
  ctx?: LogContext,
) => _parseCommonEvent(coderFactory, event, input, ctx);
