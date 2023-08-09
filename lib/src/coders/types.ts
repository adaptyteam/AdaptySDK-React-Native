export type StrType<T> = T extends string
  ? 'string'
  : T extends Date
  ? 'string' // endoded JSON
  : T extends boolean
  ? 'boolean'
  : T extends number
  ? 'number'
  : T extends any[]
  ? 'array'
  : 'object';

export interface Converter<Model = unknown, Serialized = any> {
  type?: 'data' | 'error'; // identify error converters via type
  decode: (input: Serialized) => Model;
  encode: (value: Model) => Serialized;
}

// nests object keys like "obj.obj2.value"
// type NestedKeys<T> = {
//   [K in keyof T]: T[K] extends object ? `${K}.${NestedKeys<T[K]>}` | K : K;
// }[keyof T];

export interface PropertyMeta<
  Model = unknown,
  Key extends string | number | symbol = string,
> {
  converter?: Converter<NonNullable<Model>>;
  key: Key;
  required: undefined extends Model ? false : true;
  type: StrType<Model>;
}

// Trust me
export type Properties<
  Model extends Record<string, any>,
  SerializableData = Record<string, unknown>,
> = {
  [K in keyof Omit<Required<Model>, 'ios' | 'android'>]: PropertyMeta<
    Model[K],
    keyof SerializableData
  >;
} & ('ios' extends keyof Model
  ? {
      ios: {
        [K in keyof Required<Required<Model>['ios']>]: PropertyMeta<
          Required<Model>['ios'][K],
          keyof SerializableData
        >;
      };
    }
  : {}) &
  ('android' extends keyof Model
    ? {
        android: {
          [K in keyof Required<Required<Model>['android']>]: PropertyMeta<
            Required<Model>['android'][K],
            keyof SerializableData
          >;
        };
      }
    : {});
