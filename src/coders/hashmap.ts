import type { Converter } from './types';

// Coder for Record<string, T>
export class HashmapCoder<T extends Converter<any, any>>
  implements Converter<Record<string, any>, Record<string, any>>
{
  private coder: T | null;

  constructor(coder: T | null) {
    this.coder = coder;
  }

  decode(input: Record<string, any>): Record<string, any> {
    const result: Record<string, T> = {};

    Object.keys(input).forEach(key => {
      const property = input[key as string];

      result[key] = this.coder?.decode(property) ?? property;
    });

    return result;
  }

  encode(value: Record<string, any>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.keys(value).forEach(key => {
      const property = value[key as string];
      result[key] = this.coder?.encode(property) ?? property;
    });

    return result;
  }
}
