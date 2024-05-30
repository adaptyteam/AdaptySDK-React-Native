import { SimpleCoder } from './coder';
import { Converter } from './types';

// Coder for Array<T>
export class ArrayCoder<
  Model extends Record<string, any>,
  ModelCoder extends SimpleCoder<Model, any>,
> implements Converter<any[], any[]>
{
  private coder: ModelCoder;

  constructor(coder: new () => ModelCoder) {
    this.coder = new coder();
  }

  decode(input: any[]): Model[] {
    const result: Model[] = [];

    input.forEach(value => {
      result.push(this.coder.decode(value));
    });

    return result;
  }

  encode(value: Model[]): any[] {
    const result: any[] = [];
    value.forEach(model => {
      result.push(this.coder.encode(model));
    });

    return result;
  }
}
