import { parseFlowEvent as _parseFlowEvent } from '@adapty/core';
import type { LogContext } from '../logger';
import type { ParsedFlowEvent } from '@/types/flow-events';
import { coderFactory } from './factory';

export const parseFlowEvent = (
  input: string,
  ctx?: LogContext,
): ParsedFlowEvent | null => _parseFlowEvent(coderFactory, input, ctx);
