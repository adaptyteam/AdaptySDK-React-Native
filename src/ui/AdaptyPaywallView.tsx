import React, { useMemo } from 'react';
import {
  requireNativeComponent,
  ViewProps,
  NativeSyntheticEvent,
} from 'react-native';
import { AdaptyPaywall } from '@/types';
import { AdaptyPaywallCoder } from '@/coders/adapty-paywall';
import { AdaptyError } from '@/adapty-error';

export interface PaywallViewEventHandlers {
  onCloseButtonPress?: () => void;
  onAndroidSystemBack?: () => void;
  onProductSelected?: (productId: string) => void;
  onPurchaseStarted?: (product: any) => void; // AdaptyPaywallProduct
  onPurchaseCompleted?: (purchaseResult: any, product: any) => void;
  onPurchaseFailed?: (error: AdaptyError, product: any) => void;
  onRestoreStarted?: () => void;
  onPaywallClosed?: () => void;
  onPaywallShown?: () => void;
  onWebPaymentNavigationFinished?: (product?: any, error?: AdaptyError) => void;
  onRestoreCompleted?: (profile: any) => void; // AdaptyProfile
  onRestoreFailed?: (error: AdaptyError) => void;
  onRenderingFailed?: (error: AdaptyError) => void;
  onLoadingProductsFailed?: (error: AdaptyError) => void;
  onCustomAction?: (actionId: string) => void;
  onUrlPress?: (url: string) => void;
}

export type AdaptyPaywallNativeEvent = {
  eventId: string;
  eventData: string;
};

export type Props = ViewProps & {
  paywall: AdaptyPaywall;
  eventHandlers?: Partial<PaywallViewEventHandlers>;
};

const extractPaywallCallbackArgs = (
  handlerName: keyof PaywallViewEventHandlers,
  eventArg: Record<string, any>,
): any[] => {
  const productId = eventArg['productId'] || '';
  const product = eventArg['product'] || {};
  const purchaseResult = eventArg['purchaseResult'] || {};
  const error = eventArg['error'] || {};
  const profile = eventArg['profile'] || {};
  const actionId = eventArg['actionId'] || '';
  const url = eventArg['url'] || '';

  switch (handlerName) {
    case 'onCloseButtonPress':
    case 'onAndroidSystemBack':
    case 'onRestoreStarted':
    case 'onPaywallClosed':
    case 'onPaywallShown':
      return [];
    case 'onProductSelected':
      return [productId];
    case 'onPurchaseStarted':
      return [product];
    case 'onPurchaseCompleted':
      return [purchaseResult, product];
    case 'onPurchaseFailed':
    case 'onRestoreFailed':
    case 'onRenderingFailed':
    case 'onLoadingProductsFailed':
      return [error, product || undefined];
    case 'onWebPaymentNavigationFinished':
      return [product || undefined, error || undefined];
    case 'onRestoreCompleted':
      return [profile];
    case 'onCustomAction':
      return [actionId];
    case 'onUrlPress':
      return [url];
    default:
      return [];
  }
};


const getHandlerNameForEvent = (
  eventId: string,
): keyof PaywallViewEventHandlers | null => {
  switch (eventId) {
    case 'paywall_on_close_button_press':
      return 'onCloseButtonPress';
    case 'paywall_on_android_system_back':
      return 'onAndroidSystemBack';
    case 'paywall_on_product_selected':
      return 'onProductSelected';
    case 'paywall_on_purchase_started':
      return 'onPurchaseStarted';
    case 'paywall_on_purchase_completed':
      return 'onPurchaseCompleted';
    case 'paywall_on_purchase_failed':
      return 'onPurchaseFailed';
    case 'paywall_on_restore_started':
      return 'onRestoreStarted';
    case 'paywall_on_paywall_closed':
      return 'onPaywallClosed';
    case 'paywall_on_paywall_shown':
      return 'onPaywallShown';
    case 'paywall_on_web_payment_navigation_finished':
      return 'onWebPaymentNavigationFinished';
    case 'paywall_on_restore_completed':
      return 'onRestoreCompleted';
    case 'paywall_on_restore_failed':
      return 'onRestoreFailed';
    case 'paywall_on_rendering_failed':
      return 'onRenderingFailed';
    case 'paywall_on_loading_products_failed':
      return 'onLoadingProductsFailed';
    case 'paywall_on_custom_action':
      return 'onCustomAction';
    case 'paywall_on_url_press':
      return 'onUrlPress';
    default:
      return null;
  }
};
//todo add default handlers
const NativeAdaptyPaywallView =
  requireNativeComponent<any>('AdaptyPaywallView');

export const AdaptyPaywallView: React.FC<Props> = ({
  paywall,
  eventHandlers,
  ...rest
}) => {
  const coder = new AdaptyPaywallCoder();

  const uniqueViewId = useMemo(() => {
    const instanceId = `${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    return `${paywall.id}_${instanceId}`;
  }, [paywall.id]);

  const handleEvent = (e: NativeSyntheticEvent<AdaptyPaywallNativeEvent>) => {
    if (!eventHandlers) return;

    const { eventId, eventData } = e.nativeEvent;
    let parsedData: any = {};

    try {
      parsedData = JSON.parse(eventData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse event data:', error);
      return;
    }

    const handlerName = getHandlerNameForEvent(eventId);
    if (!handlerName) {
      return;
    }

    const callbackArgs = extractPaywallCallbackArgs(handlerName, parsedData);

    const handler = eventHandlers[handlerName];

    if (handler) {
      (handler as any)(...callbackArgs);
    }
  };

  return (
    <NativeAdaptyPaywallView
      {...rest}
      viewId={uniqueViewId}
      paywallJson={JSON.stringify(coder.encode(paywall))}
      onEvent={handleEvent}
    />
  );
};
