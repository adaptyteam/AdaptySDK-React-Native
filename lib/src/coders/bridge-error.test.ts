import { AdaptyBridgeError } from '@/types/bridge';
import { BridgeErrorCoder } from './bridge-error';
import { AdaptyError } from '@/adapty-error';

describe('BridgeErrorCoder', () => {
  let coder: BridgeErrorCoder;

  const input = {
    name: 'source',
    error_type: 'typeMismatch',
    type: 'JSON-encoded AdaptyAttributionSource',
  };

  beforeEach(() => {
    coder = new BridgeErrorCoder();
  });

  it('should be Error', () => {
    const data = coder.decode(input);
    const error = coder.getError(data);

    expect(error).toBeInstanceOf(Error);
  });
  it('should be AdaptyError', () => {
    const data = coder.decode(input);
    const error = coder.getError(data);

    expect(error).toBeInstanceOf(AdaptyError);
  });

  it('should encode/decode', () => {
    const result = coder.decode(input);

    expect(result).toStrictEqual({
      errorType: 'typeMismatch',
      name: 'source',
      type: 'JSON-encoded AdaptyAttributionSource',
    } satisfies AdaptyBridgeError);

    expect(coder.encode(result)).toStrictEqual(input);
  });
});
