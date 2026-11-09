import type { HostComponent, ViewProps } from 'react-native';
// RN 0.75 has no root export of codegenNativeComponent
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// Codegen and autolinking input only; the runtime registers the view config in src/ui/native-components.ts
export interface NativeProps extends ViewProps {
  viewId: string;
  onboardingJson: string;
}

export default codegenNativeComponent<NativeProps>(
  'AdaptyOnboardingView',
) as HostComponent<NativeProps>;
