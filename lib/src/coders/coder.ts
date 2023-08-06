import { Converter, Properties, StrType } from './types';

export abstract class Coder<
  Model extends Record<string, any>,
  Serializable extends Record<string, any> = Record<string, any>,
> implements Converter<Model, Serializable>
{
  protected abstract properties: Properties<Model, Serializable>;

  encode(data: Model): Serializable {
    return this.encodeWithProperties(data, this.properties);
  }
  // From vendor_product_id to productId
  decode(data: Serializable): Model {
    return this.decodeWithProperties(data, this.properties);
  }

  protected isType(value: unknown, type: StrType<any>): boolean {
    switch (type) {
      case 'string':
      case 'boolean':
      case 'number':
        return typeof value === type;
      case 'object':
        return value !== null && typeof value === 'object';
      case 'array':
        return Array.isArray(value);
    }
  }

  private getNestedValue(obj: Record<string, any>, key: string): any {
    const keys = key.split('.');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!;

      if (current[key] !== undefined) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  private assignNestedValue<T extends Record<string, any>>(
    obj: T,
    key: string,
    value: any,
  ): T {
    const keys = String(key).split('.');
    let currentObj: Partial<T> = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i] as keyof Partial<T>;

      if (currentObj[key] === undefined) {
        currentObj[key] = {} as any;
      }

      currentObj = currentObj[key] as any;
    }

    currentObj[keys[keys.length - 1] as keyof Partial<T>] = value;
    return obj;
  }

  private encodeWithProperties<Model extends Record<string, any>, Serializable>(
    data: Model,
    properties: Properties<Model, Serializable>,
  ): Serializable {
    const result: Partial<Serializable> = {};

    for (const key in data) {
      if (key === 'ios' || key === 'android') {
        // Read properties from ios/android platform keys and flatten them
        const platformResult = this.encodeWithProperties(
          data[key],
          (properties as Record<string, any>)[key],
        ) as any;

        Object.assign(result, platformResult);
        continue;
      }

      const property = properties[key as string];
      if (!property) {
        throw new Error('dad');
      }
      const converter = property.converter;

      this.assignNestedValue(
        result,
        property.key as string,
        converter ? converter.encode(data[key]) : data[key as keyof Model],
      );
    }

    return result as Serializable;
  }

  private decodeWithProperties<Serializable, Model extends Record<string, any>>(
    data: Serializable,
    properties: Properties<Model, Serializable>,
  ): Model {
    const result: Partial<Model> = {};

    for (const key in properties) {
      if (key === 'android' || key === 'ios') {
        // Add ios/android property and fill platform data there
        result[key as unknown as keyof typeof result] =
          this.decodeWithProperties(
            data,
            (properties as Record<string, any>)[key],
          ) as any;
        continue;
      }

      const property = properties[key];
      if (!property) {
        throw new Error('dad');
      }

      const value = this.getNestedValue(
        data as Record<string, any>,
        property.key as string,
      );

      if (property.required && value === undefined) {
        throw new Error(`Missing required property: ${key}`);
      }

      // If value is undefined and property is not required, continue
      if (value === undefined) continue;

      if (!this.isType(value, property.type)) {
        throw new Error(
          `Type mismatch for property ${key}: expected ${
            property.type
          }, got ${typeof value}`,
        );
      }

      // If a converter is provided, use it to convert the value
      result[key as keyof Model] = property.converter
        ? property.converter.decode(value)
        : (value as any);
    }

    return result as Model;
  }
}
