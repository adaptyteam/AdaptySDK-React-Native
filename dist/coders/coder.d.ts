import { Converter, Properties, StrType } from './types';
export declare abstract class Coder<Model extends Record<string, any>, CodableModel extends Partial<Model>, Serializable extends Record<string, any> = Record<string, any>> implements Converter<CodableModel, Serializable> {
    protected abstract properties: Properties<CodableModel, Serializable>;
    encode(data: CodableModel): Serializable;
    decode(data: Serializable): CodableModel;
    protected isType(value: unknown, type: StrType<any>): boolean;
    private getNestedValue;
    private assignNestedValue;
    private encodeWithProperties;
    private decodeWithProperties;
}
export declare abstract class SimpleCoder<Model extends Record<string, any>, Serializable extends Record<string, any> = Record<string, any>> extends Coder<Model, Model, Serializable> {
}
//# sourceMappingURL=coder.d.ts.map