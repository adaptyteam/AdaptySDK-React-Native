import { BridgeError } from '../bridgeError';

// const PROPERTY_MAP = 'staticPropertyMap';

// interface DecodableArgs {
//   name?: string;
//   typeCheck?: 'string' | 'number' | 'boolean' | 'array';
//   required?: boolean;
// }

// type DecodablePropertyMap = {
//   [readKey: string]: DecodableArgs & { writeKey: string };
// };

/**
 * Type-safe JSON coder.
 * @internal
 */
export abstract class Coder<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  public toObject() {
    return this.data;
  }

  public static tryDecode(data: unknown): Coder<any> {
    return data as any;
  }
  abstract encode(): Record<string, any>;

  public static errType(args: {
    name: string;
    expected: string;
    current: string;
  }): Error {
    return BridgeError.decodeFailed(
      `${this.name} failed type check. Expected '${args.name}' to be of type '${args.expected}', but got '${args.current}'.`,
    );
  }

  public static errRequired(field: string): BridgeError {
    return BridgeError.decodeFailed(
      `${this.name} failed type check. Required field '${field}' missing.`,
    );
  }
}

/**
 * Decorator for properties that should be included in the object returned by `toObject()`.
 *
 * @remarks
 * Assigns a static map of JSON keys to their property names.
 * If a key is not present in the map, it will not be included in the object.
 *
 * @example
 * ### JSON
 * ```json
 * { "full_name": "John Doe" }
 * ```
 * ### propertyMap
 * ```ts
 * { "full_name": "fullName" }
 * ```
 * ### toObject()
 * ```ts
 * { "fullName": "John Doe" }
 * ```
 *
 * @internal
 */
// export const decodable =
//   (args: DecodableArgs = {}) =>
//   (target: Decoder<any>, writeKey: string) => {
//     if (!(target.constructor as any)[PROPERTY_MAP]) {
//       Object.defineProperty(target.constructor, PROPERTY_MAP, {
//         value: {},
//         configurable: true,
//         writable: true,
//       });
//     }

//     const propertyMap = (target.constructor as any)[
//       PROPERTY_MAP
//     ] as DecodablePropertyMap;

//     const jsonKey = args.name ?? writeKey;
//     // do not reassign if the key is already present
//     if (propertyMap[jsonKey]) {
//       return;
//     }

//     propertyMap[jsonKey] = { ...args, writeKey };
//   };

export type Json = Record<string, any>;
