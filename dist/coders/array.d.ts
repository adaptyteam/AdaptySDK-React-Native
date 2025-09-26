import { SimpleCoder } from './coder';
import { Converter } from './types';
export declare class ArrayCoder<Model extends Record<string, any>, ModelCoder extends SimpleCoder<Model, any>> implements Converter<any[], any[]> {
    private coder;
    constructor(coder: new () => ModelCoder);
    decode(input: any[]): Model[];
    encode(value: Model[]): any[];
}
//# sourceMappingURL=array.d.ts.map