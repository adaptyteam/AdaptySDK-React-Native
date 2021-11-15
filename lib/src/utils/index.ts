import { NativeModules } from 'react-native';

export interface AdaptyDefaultOptions {
  forceUpdate?: boolean;
}
export interface AdaptyModule {
  presentCodeRedemptionSheet: () => void;

  setFallbackPaywalls: (paywalls: string) => Promise<void>;
  identify: (uId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: Object) => Promise<void>;
  logShowPaywall: (variationId: string) => Promise<void>;
  getAPNSToken: () => Promise<string>;
  setAPNSToken: (token: string) => Promise<void>;
  // JSON: AdaptyPurchaserInfo
  getPurchaseInfo: (options?: AdaptyDefaultOptions) => Promise<string>;
  // JSON: { receipt: string; purchaserInfo?: AdaptyPurchaserInfo }
  restorePurchases: () => Promise<string>;
  // JSON: { receipt: string; product?: string; purchaserInfo?: string; }
  makePurchase: (
    product: string,
    variationId: string | undefined,
    param?: string | Record<string, any>,
  ) => Promise<string>;
  // JSON: AdaptyPromo
  getPromo: () => Promise<string>;
  // JSON: { paywalls: string; product: string }
  getPaywalls: (options?: AdaptyDefaultOptions) => Promise<string>;
  setExternalAnalyticsEnabled: (isEnabled: boolean) => Promise<void>;
  setVariationID: (variationId: string, transactionId: string) => Promise<void>;
  activate: (
    sdkKey: string,
    userId: string | any,
    observerMode: boolean,
    logLevel: string,
  ) => Promise<void>;

  updateAttribution: (
    object: Object,
    source: 'Branch' | 'AppsFlyer' | 'Adjust' | 'Custom' | 'AppleSearchAds',
    networkUserId: string,
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
