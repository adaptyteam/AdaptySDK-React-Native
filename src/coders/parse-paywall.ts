import { parsePaywallEvent as _parsePaywallEvent } from '@adapty/core';
import type { LogContext } from '../logger';
import type { ParsedPaywallEvent } from '@/types/paywall-events';
import { coderFactory } from './factory';

// Re-export types for convenience
export {
  PaywallEventId,
  type PaywallEventIdType,
  type PaywallEventView,
  type PaywallDidAppearEvent,
  type PaywallDidDisappearEvent,
  type PaywallDidPerformActionEvent,
  type PaywallDidSelectProductEvent,
  type PaywallDidStartPurchaseEvent,
  type PaywallDidFinishPurchaseEvent,
  type PaywallDidFailPurchaseEvent,
  type PaywallDidStartRestoreEvent,
  type PaywallDidFinishRestoreEvent,
  type PaywallDidFailRestoreEvent,
  type PaywallDidFailRenderingEvent,
  type PaywallDidFailLoadingProductsEvent,
  type PaywallDidFinishWebPaymentNavigationEvent,
  type ParsedPaywallEvent,
} from '@/types/paywall-events';

export const parsePaywallEvent = (
  input: string,
  ctx?: LogContext,
): ParsedPaywallEvent | null =>
  _parsePaywallEvent(coderFactory, input, ctx);
