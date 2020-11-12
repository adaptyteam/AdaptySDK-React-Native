import { NativeModules } from 'react-native';

export interface AdaptyDefaultOptions {
  cached?: boolean;
}
export interface AdaptyModule {
  identify: (uId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: Object) => Promise<void>;

  restorePurchases: () => Promise<{ receipt: string; purchaserInfo?: string }>;
  getPurchaseInfo: (options?: AdaptyDefaultOptions) => Promise<string>;
  makePurchase: (
    product: string,
    options?: AdaptyDefaultOptions,
  ) => Promise<{
    receipt: string;
    product?: string;
    purchaserInfo?: string;
  }>;
  validateReceipt: (
    productId: string,
    receipt?: string,
  ) => Promise<{ purchaserInfo: string }>;
  getPromo: () => Promise<any>;
  getPaywalls: (
    options?: AdaptyDefaultOptions,
  ) => Promise<{ paywalls: string; product: string }>;

  activate: (
    sdkKey: string,
    userId: string | any,
    observerMode: boolean,
    logLevel: 'errors' | 'verbose' | 'none',
  ) => Promise<void>;

  updateAttribution: (
    object: Object,
    source: 'Branch' | 'AppsFlyer' | 'Adjust' | 'Custom' | 'AppleSearchAds',
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
