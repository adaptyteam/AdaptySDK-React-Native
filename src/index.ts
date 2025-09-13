import { Adapty } from './adapty-handler';

export * from './types/error';
export * from './types/index';
export * from './types/inputs';
export { AdaptyError } from './adapty-error';
export { AdaptyPaywallView } from './ui';

export const adapty = new Adapty();
export * from './ui';
// console.warn(
//   "'react-native-adapty' title was deprecated. Please, modify it to '@adapty/react-native-sdk' to see updates.",
// );
