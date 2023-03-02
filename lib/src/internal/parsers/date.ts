import dayjs from 'dayjs';

import { Parser, ParserOptions } from './parser';

export class DateParser extends Parser<Date> {
  constructor(interfaceName: string) {
    super(interfaceName);
  }

  parseMaybe(
    value: string | undefined,
    options: ParserOptions,
  ): Date | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    let pureValue = value;
    if (!value.endsWith('Z')) {
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
      if (value.endsWith('.000000+0000')) {
        pureValue = value.replace('+0000', 'Z').replace('.000000', '.000');
      }
    }

    const parsedValue = dayjs(pureValue);
    if (!parsedValue.isValid()) {
      throw this.errCustom(
        options.keyName,
        `Failed to parse date: ${pureValue}`,
      );
    }

    return parsedValue.toDate();
  }
}
