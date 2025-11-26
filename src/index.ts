import { Adapty } from './adapty-handler';

export * from './types/error';
export * from './types/index';
export * from './types/inputs';
export { AdaptyError } from './adapty-error';
export * from './utils/env-detection';
export * from './mock/types';

export const adapty = new Adapty();
export * from './ui';
