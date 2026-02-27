import { parsePaywallEvent as _parsePaywallEvent } from '@adapty/core';
import type { LogContext } from '../logger';
import type { ParsedPaywallEvent } from '@/types/paywall-events';
import { coderFactory } from './factory';

export const parsePaywallEvent = (
  input: string,
  ctx?: LogContext,
): ParsedPaywallEvent | null => _parsePaywallEvent(coderFactory, input, ctx);
