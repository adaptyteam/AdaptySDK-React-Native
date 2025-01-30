// import SDK type to link to methods in docs.
// import { AdaptyError } from '../sdk2/error';

export const ErrorCode = Object.freeze({
  /**
   * System StoreKit codes
   */
  0: 'unknown',
  /**
   * Client is not allowed to make a request, etc.
   */
  1: 'clientInvalid',
  /**
   * Invalid purchase identifier, etc.
   */
  3: 'paymentInvalid',
  /**
   * This device is not allowed to make the payment.
   */
  4: 'paymentNotAllowed',
  /**
   * Product is not available in the current storefront.
   */
  5: 'storeProductNotAvailable',

  /**
   * User has not allowed access to cloud service information.
   */
  6: 'cloudServicePermissionDenied',

  /**
   * The device could not connect to the network.
   */
  7: 'cloudServiceNetworkConnectionFailed',

  /**
   * User has revoked permission to use this cloud service.
   */
  8: 'cloudServiceRevoked',

  /**
   * The user needs to acknowledge Apple's privacy policy.
   */
  9: 'privacyAcknowledgementRequired',

  /**
   * The app is attempting to use SKPayment's requestData property,
   * but does not have the appropriate entitlement.
   */
  10: 'unauthorizedRequestData',

  /**
   * The specified subscription offer identifier is not valid.
   */
  11: 'invalidOfferIdentifier',

  /**
   * The cryptographic signature provided is not valid.
   */
  12: 'invalidSignature',

  /**
   * One or more parameters from SKPaymentDiscount is missing.
   */
  13: 'missingOfferParams',

  14: 'invalidOfferPrice',

  /**
   * Custom Android codes.
   */
  20: 'adaptyNotInitialized',
  22: 'productNotFound',
  24: 'currentSubscriptionToUpdateNotFoundInHistory',
  97: 'billingServiceTimeout',
  98: 'featureNotSupported',
  99: 'billingServiceDisconnected',
  102: 'billingServiceUnavailable',
  103: 'billingUnavailable',
  105: 'developerError',
  106: 'billingError',
  107: 'itemAlreadyOwned',
  108: 'itemNotOwned',
  112: 'billingNetworkError',

  1000: 'noProductIDsFound',
  1002: 'productRequestFailed',

  /**
   * In-App Purchases are not allowed on this device.
   */
  1003: 'cantMakePayments',
  1004: 'noPurchasesToRestore',
  1005: 'cantReadReceipt',
  1006: 'productPurchaseFailed',
  1010: 'refreshReceiptFailed',
  1011: 'receiveRestoredTransactionsFailed',

  /**
   * You need to be authenticated to perform requests.
   */
  2002: 'notActivated',
  2003: 'badRequest',
  2004: 'serverError',
  2005: 'networkFailed',
  2006: 'decodingFailed',
  2009: 'encodingFailed',

  3000: 'analyticsDisabled',
  /**
   * Wrong parameter was passed.
   */
  3001: 'wrongParam',
  /**
   * It is not possible to call `.activate` method more than once.
   */
  3005: 'activateOnceError',
  /**
   * The user profile was changed during the operation.
   */
  3006: 'profileWasChanged',
  3007: 'unsupportedData',
  3100: 'persistingDataError',
  3101: 'fetchTimeoutError',
  9000: 'operationInterrupted',
});
export type ErrorCode = keyof typeof ErrorCode;

export function getErrorCode(
  error: (typeof ErrorCode)[ErrorCode],
): ErrorCode | undefined {
  const errorCode = Object.keys(ErrorCode).find(keyStr => {
    const key = Number(keyStr) as ErrorCode;
    return ErrorCode[key] === error;
  });

  if (!errorCode) {
    return undefined;
  }

  return Number(errorCode) as ErrorCode;
}

export function getErrorPrompt(code: ErrorCode): (typeof ErrorCode)[ErrorCode] {
  const prompt = ErrorCode[code];

  if (!prompt) {
    return `Unknown code: ${code}` as (typeof ErrorCode)[ErrorCode];
  }

  return prompt;
}
