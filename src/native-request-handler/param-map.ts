import type { Serializable } from '@/types/bridge';

export class ParamMap<K extends string> extends Map<K, Serializable> {
  constructor(iterable?: Iterable<readonly [K, Serializable]>) {
    super(iterable);
  }

  encode(): Record<K, Serializable> {
    const result: Partial<Record<K, Serializable>> = {};

    this.forEach((value, key) => {
      result[key] = value;
    });

    return result as Record<K, Serializable>;
  }
}
