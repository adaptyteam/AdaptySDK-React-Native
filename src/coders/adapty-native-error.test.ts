import { AdaptyNativeErrorCoder } from './adapty-native-error';
import { AdaptyError } from '@/adapty-error';
import type { AdaptyNativeError } from '@/types/bridge';
import type { Def } from '@/types/schema';

type Model = AdaptyNativeError;
const mocks: Def['AdaptyError'][] = [
  {
    adapty_code: 400,
    message: 'The provided input is invalid.',
    detail: 'Input XYZ is missing.',
  },
  {
    adapty_code: 401,
    message: 'User is not authorized.',
    detail: 'Missing or invalid token.',
  },
  { adapty_code: 500, message: 'Internal server error.' },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    adaptyCode: mock.adapty_code,
    message: mock.message,
    ...(mock.detail && { detail: mock.detail }),
  };
}

describe('AdaptyNativeErrorCoder', () => {
  let coder: AdaptyNativeErrorCoder;

  beforeEach(() => {
    coder = new AdaptyNativeErrorCoder();
  });

  // Important for analytics systems, etc.
  it.each(mocks)('should be Error', mock => {
    const decoded = coder.decode(mock);
    const error = coder.getError(decoded);

    expect(error).toBeInstanceOf(Error);
  });

  it.each(mocks)('should be AdaptyError', mock => {
    const decoded = coder.decode(mock);
    const error = coder.getError(decoded);

    expect(error).toBeInstanceOf(AdaptyError);
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock);

    expect(decoded).toEqual(toModel(mock));
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toEqual(mock);
  });
});
