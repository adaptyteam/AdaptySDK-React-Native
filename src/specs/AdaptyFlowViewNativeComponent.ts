import type { HostComponent, ViewProps } from 'react-native';
// RN 0.75 has no root export of this; fine, since codegen matches the call by name and specs never run
import { codegenNativeComponent } from 'react-native';

// Codegen and autolinking input only; the runtime registers the view config in src/ui/native-components.ts
export interface NativeProps extends ViewProps {
  viewId: string;
  flowJson: string;
}

export default codegenNativeComponent<NativeProps>(
  'AdaptyFlowView',
) as HostComponent<NativeProps>;
