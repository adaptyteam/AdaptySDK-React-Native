import { Converter } from './types';
type Model = any;
type Serialized = string;
export declare class JSONCoder implements Converter<Model, Serialized> {
    decode(input: Serialized): Model;
    encode(value: Model): Serialized;
}
export {};
//# sourceMappingURL=json.d.ts.map