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

      // with the timezone offset removed
      const dateParts = value.split(/[-T:.Z]/);
      const date = new Date(
        Date.UTC(
          parseInt(dateParts[0], 10),
          parseInt(dateParts[1], 10) - 1,
          parseInt(dateParts[2], 10),
          parseInt(dateParts[3], 10),
          parseInt(dateParts[4], 10),
          parseInt(dateParts[5], 10),
        ),
      );
      pureValue = date.toISOString();
    }

    const parsedValue = Date.parse(pureValue);
    if (isNaN(parsedValue)) {
      throw this.errCustom(
        options.keyName,
        `Failed to parse date: ${pureValue}`,
      );
    }

    return new Date(parsedValue);
  }
}
