// RN's own codegen output imports this module, but RN ships no types for it.
declare module 'react-native/Libraries/NativeComponent/NativeComponentRegistry' {
  import type { HostComponent } from 'react-native';

  export function get<Config extends object>(
    name: string,
    viewConfigProvider: () => {
      uiViewClassName: string;
      validAttributes: Record<string, true>;
    },
  ): HostComponent<Config>;
}
