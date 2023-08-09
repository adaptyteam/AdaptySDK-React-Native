import { AdaptyError } from '@/adapty-error';
import type { Converter } from './types';

/**
 * Format:    yyyy-MM-dd'T'HH:mm:ss.SSSZ
 * OpenAPI:   Output.Date
 */
export class DateCoder implements Converter<Date, string> {
  decode(input: string): Date {
    let pureValue = input;

    if (!input.endsWith('Z')) {
      // React Native seems to have an inconsistent behaviour
      // with dates with timezone offset
      // It is not handled with custom libs like dayjs
      // So we just remove the timezone offset if possible

      // Android SDK returns the following format,
      // that resulted in an invalid date for some customers
      // `2023-02-24T07:16:28.000000+0000`
      // solution is:
      // 1. Replace "+0000" with "Z"
      // 2. Replace microsecs with 0 millisecs

      // with the timezone offset removed
      const dateParts = input.split(/[-T:.Z]/);
      const date = new Date(
        Date.UTC(
          parseInt(dateParts[0] ?? '0', 10),
          parseInt(dateParts[1] ?? '0', 10) - 1,
          parseInt(dateParts[2] ?? '0', 10),
          parseInt(dateParts[3] ?? '0', 10),
          parseInt(dateParts[4] ?? '0', 10),
          parseInt(dateParts[5] ?? '0', 10),
        ),
      );
      pureValue = date.toISOString();
    }

    const parsedValue = Date.parse(pureValue);
    if (isNaN(parsedValue)) {
      throw AdaptyError.failedToDecode(
        `Failed to decode a date string into JS Date. String value: ${pureValue}`,
      );
    }

    return new Date(parsedValue);
  }

  encode(value: Date): string {
    return value.toISOString();
  }
}
