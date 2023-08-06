import { AdaptyNativeError } from '@/types/bridge';
import { AdaptyNativeErrorCoder } from './adapty-native-error';

const input = {
  type: 'AdaptyError',
  data: {
    adapty_code: 0,
    message: 'Product purchase failed',
    // detail:
    //   'StoreKitManagerError.productPurchaseFailed([2.6.2]: Adapty/SKQueueManager+MakePurchase.swift#50, Error Domain=SKErrorDomain Code=0 "An unknown error occurred" UserInfo={NSLocalizedDescription=An unknown error occurred, NSUnderlyingError=0x600001816010 {Error Domain=ASDErrorDomain Code=500 "Unhandled exception" UserInfo={NSUnderlyingError=0x600001890420 {Error Domain=AMSErrorDomain Code=100 "Authentication Failed" UserInfo={NSMultipleUnderlyingErrorsKey=(\n    "Error Domain=AMSErrorDomain Code=2 \\"An unknown error occurred. Please try again.\\" UserInfo={NSLocalizedDescription=An unknown error occurred. Please try again.}",\n    "Error Domain=com.apple.accounts Code=4 \\"No auth plugin to verify credentials for accounts of type com.apple.account.iTunesStore.sandbox\\" UserInfo={NSLocalizedDescription=No auth plugin to verify credentials for accounts of type com.apple.account.iTunesStore.sandbox}"\n), NSLocalizedDescription=Authentication Failed, NSLocalizedFailureReason=The authentication failed.}}, NSLocalizedDescription=Unhandled exception, NSLocalizedFailureReason=An unknown error occurred}}})',
  },
};

describe('AdaptyError', () => {
  let coder: AdaptyNativeErrorCoder;

  beforeEach(() => {
    coder = new AdaptyNativeErrorCoder();
  });

  it('should encode/decode', () => {
    const result = coder.decode(input.data);

    expect(result).toEqual({
      adaptyCode: 0,
      message: 'Product purchase failed',
    } satisfies AdaptyNativeError);
  });
});
