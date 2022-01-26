export type AdaptyErrorCode =
  | 'sdkNotActive'
  | 'none'
  // StoreKit codes
  | 'unknown'
  | 'clientInvalid' // client is not allowed to issue the request, etc.
  | 'paymentCancelled' // user cancelled the request, etc.
  | 'paymentInvalid' // purchase identifier was invalid, etc.
  | 'paymentNotAllowed' // this device is not allowed to make the payment
  | 'storeProductNotAvailable' // Product is not available in the current storefront
  | 'cloudServicePermissionDenied' // user has not allowed access to cloud service information
  | 'cloudServiceNetworkConnectionFailed' // the device could not connect to the nework
  | 'cloudServiceRevoked' // user has revoked permission to use this cloud service
  | 'privacyAcknowledgementRequired' // The user needs to acknowledge Apple's privacy policy
  | 'unauthorizedRequestData' // The app is attempting to use SKPayment's requestData property, but does not have the appropriate entitlement
  | 'invalidOfferIdentifier' // The specified subscription offer identifier is not valid
  | 'invalidSignature' // The cryptographic signature provided is not valid
  | 'missingOfferParams' // One or more parameters from SKPaymentDiscount is missing
  | 'invalidOfferPrice'
  // Custom StoreKit codes
  | 'noProductIDsFound' // No In-App Purchase product identifiers were found
  | 'noProductsFound' // No In-App Purchases were found
  | 'productRequestFailed' // Unable to fetch available In-App Purchase products at the moment
  | 'cantMakePayments' // In-App Purchases are not allowed on this device
  | 'noPurchasesToRestore' // No purchases to restore
  | 'cantReadReceipt' // Can't find a valid receipt
  | 'productPurchaseFailed' // Product purchase failed
  | 'missingOfferSigningParams' // Missing offer signing required params
  | 'fallbackPaywallsNotRequired' // Fallback paywalls are not required
  // Custom network codes
  | 'emptyResponse' //Response is empty
  | 'emptyData' // Request data is empty
  | 'authenticationError' // You need to be authenticated first
  | 'badRequest' // Bad request
  | 'outdated' // The url you requested is outdated
  | 'failed' // Network request failed
  | 'unableToDecode' // We could not decode the response
  | 'missingParam' // Missing some of the required params
  | 'invalidProperty' // Received invalid property data
  | 'encodingFailed' // Parameters encoding failed
  | 'missingURL' // Request url is nil
  | 'pendingPurchase'; // Android purchase not finalised yet

/**
 * @private
 * Parses Native SDK errors
 */
interface NativeError {
  code: number;
  adaptyCode: number;
  localizedDescription?: string;
}

export class AdaptyError {
  public adaptyCode: AdaptyErrorCode;
  public code: number;
  public localizedDescription: string;

  constructor({
    adaptyCode,
    localizedDescription,
    code,
  }: {
    adaptyCode: AdaptyErrorCode;
    localizedDescription: string | undefined;
    code: number;
  }) {
    this.adaptyCode = adaptyCode;
    this.localizedDescription = localizedDescription || 'Unknown Adapty Error';
    this.code = code;
  }
}

export function attemptToDecodeError(
  error: NativeError | unknown | Record<string, any>,
): AdaptyError {
  if (typeof error !== 'object' || !error?.hasOwnProperty('message')) {
    console.warn('[Adapty RN SDK]: Failed to parse Adapty error\n');
    return new AdaptyError({
      adaptyCode: 'unknown',
      code: 400,
      localizedDescription: JSON.stringify(error),
    });
  }

  const message: NativeError | undefined = JSON.parse((error as any).message);

  if (message) {
    return new AdaptyError({
      adaptyCode: mapAdaptyErrorCode(message.adaptyCode),
      code: message.code,
      localizedDescription: message.localizedDescription,
    });
  }

  console.warn('[Adapty RN SDK]: Failed to parse Adapty error\n');
  return new AdaptyError({
    adaptyCode: 'unknown',
    code: 400,
    localizedDescription: undefined,
  });
}

/** @throws AdaptyError */
export function isSdkAuthorized(isAuthorized: boolean): void {
  if (!isAuthorized) {
    throw new AdaptyError({
      adaptyCode: 'sdkNotActive',
      code: 403,
      localizedDescription: 'Adapty SDK was not initialized',
    });
  }
}

function mapAdaptyErrorCode(code: number): AdaptyErrorCode {
  switch (code) {
    case -1:
      return 'none';
    case 0:
      return 'unknown';
    case 1:
      return 'clientInvalid';
    case 2:
      return 'paymentCancelled';
    case 3:
      return 'paymentInvalid';
    case 4:
      return 'paymentNotAllowed';
    case 5:
      return 'storeProductNotAvailable';
    case 6:
      return 'cloudServicePermissionDenied';
    case 7:
      return 'cloudServiceNetworkConnectionFailed';
    case 8:
      return 'cloudServiceRevoked';
    case 9:
      return 'privacyAcknowledgementRequired';
    case 10:
      return 'unauthorizedRequestData';
    case 11:
      return 'invalidOfferIdentifier';
    case 12:
      return 'invalidSignature';
    case 13:
      return 'missingOfferParams';
    case 14:
      return 'invalidOfferPrice';
    case 25:
      return 'pendingPurchase';
    case 1000:
      return 'noProductIDsFound';
    case 1001:
      return 'noProductsFound';
    case 1002:
      return 'productRequestFailed';
    case 1003:
      return 'cantMakePayments';
    case 1004:
      return 'noPurchasesToRestore';
    case 1005:
      return 'cantReadReceipt';
    case 1006:
      return 'productPurchaseFailed';
    case 1007:
      return 'missingOfferSigningParams';
    case 1008:
      return 'fallbackPaywallsNotRequired';
    case 2000:
      return 'emptyResponse';
    case 2001:
      return 'emptyData';
    case 2002:
      return 'authenticationError';
    case 2003:
      return 'badRequest';
    case 2004:
      return 'outdated';
    case 2006:
      return 'failed';
    case 2007:
      return 'missingParam';
    case 2008:
      return 'invalidProperty';
    case 2009:
      return 'encodingFailed';
    case 2010:
      return 'missingURL';
    default:
      console.warn(`[Adapty RN SDK]: unknown error code: ${code}.\n`);
      return 'unknown';
  }
}
