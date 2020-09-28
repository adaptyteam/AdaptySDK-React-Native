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
