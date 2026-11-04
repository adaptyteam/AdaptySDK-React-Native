import {
  AdaptyError,
  ErrorCodeName,
  getErrorCode,
  getErrorCodeName,
  isKnownErrorCode,
} from '@/index';
import type { ErrorCode, KnownErrorCode } from '@/index';

describe('public error code exports', () => {
  it('exposes the named codes and helpers', () => {
    const known: KnownErrorCode = ErrorCodeName.billingPlanUnavailable;

    expect(known).toBe(1060);
    expect(getErrorCode('billingPlanUnavailable')).toBe(1060);
    expect(getErrorCodeName(1060)).toBe('billingPlanUnavailable');
    expect(isKnownErrorCode(1060)).toBe(true);
  });

  it('accepts a code unknown to this SDK version', () => {
    // A newer native SDK may send a code core doesn't know yet.
    const code: ErrorCode = 7777;
    const error = new AdaptyError({ adaptyCode: code, message: 'New error' });

    expect(error.adaptyCode === 7777).toBe(true);
    expect(error.codeName).toBeUndefined();
    expect(isKnownErrorCode(error.adaptyCode)).toBe(false);
  });
});
