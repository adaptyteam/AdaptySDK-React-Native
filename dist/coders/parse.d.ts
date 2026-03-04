import { type AdaptyType } from '@adapty/core';
import type { LogContext } from '../logger';
export type { AdaptyType };
export declare const parseMethodResult: <T>(input: string, resultType: AdaptyType, ctx?: LogContext) => T;
export declare const parseCommonEvent: (event: string, input: string, ctx?: LogContext) => any;
//# sourceMappingURL=parse.d.ts.map