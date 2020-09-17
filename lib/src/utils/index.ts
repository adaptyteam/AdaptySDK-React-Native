import { NativeModules } from 'react-native';

export interface AdaptyModule {
  identify: (uId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (fields: Object) => Promise<void>;
}

export function extractModule(): AdaptyModule {
  return NativeModules.RNAdapty;
}
