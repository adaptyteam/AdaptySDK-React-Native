import type { Converter } from './types';
export declare class HashmapCoder<T extends Converter<any, any>> implements Converter<Record<string, any>, Record<string, any>> {
    private coder;
    constructor(coder: T | null);
    decode(input: Record<string, any>): Record<string, any>;
    encode(value: Record<string, any>): Record<string, unknown>;
}
//# sourceMappingURL=hashmap.d.ts.map