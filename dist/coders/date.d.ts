import type { Converter } from './types';
/**
 * Format:    yyyy-MM-dd'T'HH:mm:ss.SSSZ
 * OpenAPI:   Output.Date
 */
export declare class DateCoder implements Converter<Date, string> {
    decode(input: string): Date;
    encode(value: Date): string;
}
//# sourceMappingURL=date.d.ts.map