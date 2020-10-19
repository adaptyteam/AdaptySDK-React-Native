import { NativeModules } from 'react-native';

export interface AdaptyModule {
  identify: (uId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: Object) => Promise<void>;

  restorePurchases: () => Promise<void>;
  getPurchaseInfo: () => Promise<string>;
  makePurchase: (product: string) => Promise<Object>;
  validateReceipt: (receipt: string) => Promise<any>;
  getPromo: () => Promise<any>;
  getPaywalls: () => Promise<{ paywalls: string; product: string }>;

  activate: (
    sdkKey: string,
    userId: string | any,
    observerMode: boolean,
    logLevel: 'errors' | 'verbose' | 'none',
  ) => Promise<void>;

  updateAttribution: (
    object: Object,
    source: 'Branch' | 'AppsFlyer' | 'Adjust' | 'Custom',
  ) => Promise<void>;
}

export function extractModule(): AdaptyModule {
  return NativeModules.RNAdapty;
}

export function snakeToCamel<T>(target: any): T {
  if (Array.isArray(target)) {
    return target.map(element => {
      if (typeof element === 'string') {
        return element;
      }

      return snakeToCamel(element);
    }) as any;
  }

  if (typeof target === 'object') {
    const obj: any = {};

    for (const key in target) {
      if (!target.hasOwnProperty(key)) {
        continue;
      }
      if (typeof target[key] === 'object') {
        obj[snakeToCamel<string>(key)] = snakeToCamel(target[key]);
      } else {
        obj[snakeToCamel<string>(key)] = target[key];
      }
    }

    return obj;
  }

  if (typeof target === 'string') {
    return target.replace(/(\_\w)/g, function (m: string) {
      return m[1].toUpperCase();
    }) as any;
  }

  return target;
}
