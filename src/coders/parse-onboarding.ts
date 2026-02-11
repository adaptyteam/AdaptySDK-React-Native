import { parseOnboardingEvent as _parseOnboardingEvent } from '@adapty/core';
import type { LogContext } from '../logger';
import type { ParsedOnboardingEvent } from '@/types/onboarding-events';
import { coderFactory } from './factory';

export const parseOnboardingEvent = (
  input: string,
  ctx?: LogContext,
): ParsedOnboardingEvent | null =>
  _parseOnboardingEvent(coderFactory, input, ctx);
