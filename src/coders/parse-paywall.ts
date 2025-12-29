import { AdaptyError } from '@/adapty-error';
import { LogContext } from '../logger';
import { ErrorConverter } from './error-coder';
import type { Converter } from './types';
import { AdaptyNativeErrorCoder } from './adapty-native-error';
import { AdaptyPaywallProductCoder } from './adapty-paywall-product';
import { AdaptyProfileCoder } from './adapty-profile';
import { AdaptyPurchaseResultCoder } from './adapty-purchase-result';
import type {
  AdaptyPaywallProduct,
  AdaptyProfile,
  AdaptyPurchaseResult,
} from '@/types';
import {
  PaywallEventId,
  type PaywallEventView,
  type ParsedPaywallEvent,
} from '@/types/paywall-events';

// Re-export types for convenience
export {
  PaywallEventId,
  type PaywallEventIdType,
  type PaywallEventView,
  type PaywallDidAppearEvent,
  type PaywallDidDisappearEvent,
  type PaywallDidPerformActionEvent,
  type PaywallDidSelectProductEvent,
  type PaywallDidStartPurchaseEvent,
  type PaywallDidFinishPurchaseEvent,
  type PaywallDidFailPurchaseEvent,
  type PaywallDidStartRestoreEvent,
  type PaywallDidFinishRestoreEvent,
  type PaywallDidFailRestoreEvent,
  type PaywallDidFailRenderingEvent,
  type PaywallDidFailLoadingProductsEvent,
  type PaywallDidFinishWebPaymentNavigationEvent,
  type ParsedPaywallEvent,
} from '@/types/paywall-events';

// Parser
export function parsePaywallEvent(
  input: string,
  ctx?: LogContext,
): ParsedPaywallEvent | null {
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(input);
  } catch (error) {
    throw AdaptyError.failedToDecode(
      `Failed to decode event: ${(error as Error)?.message}`,
    );
  }

  const eventId = obj['id'] as string | undefined;
  if (!eventId?.startsWith('paywall_view_')) {
    return null;
  }

  const viewObj = obj['view'] as Record<string, unknown>;
  const view: PaywallEventView = {
    id: viewObj['id'] as string,
    placementId: viewObj['placement_id'] as string | undefined,
    variationId: viewObj['variation_id'] as string | undefined,
  };

  switch (eventId) {
    case PaywallEventId.DidAppear:
      return {
        id: eventId,
        view,
      };

    case PaywallEventId.DidDisappear:
      return {
        id: eventId,
        view,
      };

    case PaywallEventId.DidPerformAction: {
      const actionObj = obj['action'] as Record<string, unknown>;
      return {
        id: eventId,
        view,
        action: {
          type: actionObj['type'] as 'close' | 'system_back' | 'open_url' | 'custom',
          value: actionObj['value'] as string | undefined,
        },
      };
    }

    case PaywallEventId.DidSelectProduct:
      return {
        id: eventId,
        view,
        productId: (obj['product_id'] as string) ?? '',
      };

    case PaywallEventId.DidStartPurchase:
      return {
        id: eventId,
        view,
        product: getPaywallCoder('product', ctx)!.decode(
          obj['product'],
        ) as AdaptyPaywallProduct,
      };

    case PaywallEventId.DidFinishPurchase:
      return {
        id: eventId,
        view,
        purchaseResult: getPaywallCoder('purchaseResult', ctx)!.decode(
          obj['purchased_result'],
        ) as AdaptyPurchaseResult,
        product: getPaywallCoder('product', ctx)!.decode(
          obj['product'],
        ) as AdaptyPaywallProduct,
      };

    case PaywallEventId.DidFailPurchase: {
      const errorCoder = getPaywallCoder(
        'error',
        ctx,
      ) as ErrorConverter<any>;
      const decodedError = errorCoder.decode(obj['error']);
      return {
        id: eventId,
        view,
        error: errorCoder.getError(decodedError),
        product: getPaywallCoder('product', ctx)!.decode(
          obj['product'],
        ) as AdaptyPaywallProduct,
      };
    }

    case PaywallEventId.DidStartRestore:
      return {
        id: eventId,
        view,
      };

    case PaywallEventId.DidFinishRestore:
      return {
        id: eventId,
        view,
        profile: getPaywallCoder('profile', ctx)!.decode(
          obj['profile'],
        ) as AdaptyProfile,
      };

    case PaywallEventId.DidFailRestore: {
      const errorCoder = getPaywallCoder(
        'error',
        ctx,
      ) as ErrorConverter<any>;
      const decodedError = errorCoder.decode(obj['error']);
      return {
        id: eventId,
        view,
        error: errorCoder.getError(decodedError),
      };
    }

    case PaywallEventId.DidFailRendering: {
      const errorCoder = getPaywallCoder(
        'error',
        ctx,
      ) as ErrorConverter<any>;
      const decodedError = errorCoder.decode(obj['error']);
      return {
        id: eventId,
        view,
        error: errorCoder.getError(decodedError),
      };
    }

    case PaywallEventId.DidFailLoadingProducts: {
      const errorCoder = getPaywallCoder(
        'error',
        ctx,
      ) as ErrorConverter<any>;
      const decodedError = errorCoder.decode(obj['error']);
      return {
        id: eventId,
        view,
        error: errorCoder.getError(decodedError),
      };
    }

    case PaywallEventId.DidFinishWebPaymentNavigation:
      return {
        id: eventId,
        view,
        product: obj['product']
          ? (getPaywallCoder('product', ctx)!.decode(
              obj['product'],
            ) as AdaptyPaywallProduct)
          : undefined,
        error: obj['error']
          ? (() => {
              const errorCoder = getPaywallCoder(
                'error',
                ctx,
              ) as ErrorConverter<any>;
              const decodedError = errorCoder.decode(obj['error']);
              return errorCoder.getError(decodedError);
            })()
          : undefined,
      };

    default:
      return null;
  }
}

type PaywallCoderType = 'product' | 'profile' | 'purchaseResult' | 'error';

function getPaywallCoder(
  type: PaywallCoderType,
  _ctx?: LogContext,
): Converter<any, any> | ErrorConverter<any> {
  switch (type) {
    case 'product':
      return new AdaptyPaywallProductCoder();
    case 'profile':
      return new AdaptyProfileCoder();
    case 'purchaseResult':
      return new AdaptyPurchaseResultCoder();
    case 'error':
      return new AdaptyNativeErrorCoder();
  }
}

