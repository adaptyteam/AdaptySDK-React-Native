import { AdaptyError } from '../adapty-error';
import { Converter } from './types';

export interface ErrorConverter<Model extends Record<string, any>>
  extends Converter<Model, any> {
  type: 'error';
  getError: (data: Model) => AdaptyError;
}
