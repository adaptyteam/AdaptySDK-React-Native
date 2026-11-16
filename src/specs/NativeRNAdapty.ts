import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// Codegen spec of the RNAdapty native module. The wire is JSON strings:
// args is { args: '<json>' }, the promise resolves with a JSON string
export interface Spec extends TurboModule {
  handle(method: string, args: Object): Promise<string>;
  // NativeEventEmitter contract; events are emitted through RCTDeviceEventEmitter
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.get<Spec>('RNAdapty');
