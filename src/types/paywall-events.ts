import { AdaptyError } from '@/adapty-error';
import type {
  AdaptyPaywallProduct,
  AdaptyProfile,
  AdaptyPurchaseResult,
} from '@/types';

// Paywall Event IDs
export const PaywallEventId = {
  DidAppear: 'paywall_view_did_appear',
  DidDisappear: 'paywall_view_did_disappear',
  DidPerformAction: 'paywall_view_did_perform_action',
  DidSelectProduct: 'paywall_view_did_select_product',
  DidStartPurchase: 'paywall_view_did_start_purchase',
  DidFinishPurchase: 'paywall_view_did_finish_purchase',
  DidFailPurchase: 'paywall_view_did_fail_purchase',
  DidStartRestore: 'paywall_view_did_start_restore',
  DidFinishRestore: 'paywall_view_did_finish_restore',
  DidFailRestore: 'paywall_view_did_fail_restore',
  DidFailRendering: 'paywall_view_did_fail_rendering',
  DidFailLoadingProducts: 'paywall_view_did_fail_loading_products',
  DidFinishWebPaymentNavigation:
    'paywall_view_did_finish_web_payment_navigation',
} as const;

export type PaywallEventIdType =
  (typeof PaywallEventId)[keyof typeof PaywallEventId];

// Event View
export interface PaywallEventView {
  id: string;
  placementId?: string;
  variationId?: string;
}

// Base Event
interface BasePaywallEvent {
  id: PaywallEventIdType;
  view: PaywallEventView;
}

// Event Types
export interface PaywallDidAppearEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidAppear;
}

export interface PaywallDidDisappearEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidDisappear;
}

export interface PaywallDidPerformActionEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidPerformAction;
  action: {
    type: 'close' | 'system_back' | 'open_url' | 'custom';
    value?: string; // for open_url and custom
  };
}

export interface PaywallDidSelectProductEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidSelectProduct;
  productId: string;
}

export interface PaywallDidStartPurchaseEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidStartPurchase;
  product: AdaptyPaywallProduct;
}

export interface PaywallDidFinishPurchaseEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidFinishPurchase;
  purchaseResult: AdaptyPurchaseResult;
  product: AdaptyPaywallProduct;
}

export interface PaywallDidFailPurchaseEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidFailPurchase;
  error: AdaptyError;
  product: AdaptyPaywallProduct;
}

export interface PaywallDidStartRestoreEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidStartRestore;
}

export interface PaywallDidFinishRestoreEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidFinishRestore;
  profile: AdaptyProfile;
}

export interface PaywallDidFailRestoreEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidFailRestore;
  error: AdaptyError;
}

export interface PaywallDidFailRenderingEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidFailRendering;
  error: AdaptyError;
}

export interface PaywallDidFailLoadingProductsEvent extends BasePaywallEvent {
  id: typeof PaywallEventId.DidFailLoadingProducts;
  error: AdaptyError;
}

export interface PaywallDidFinishWebPaymentNavigationEvent
  extends BasePaywallEvent {
  id: typeof PaywallEventId.DidFinishWebPaymentNavigation;
  product?: AdaptyPaywallProduct;
  error?: AdaptyError;
}

export type ParsedPaywallEvent =
  | PaywallDidAppearEvent
  | PaywallDidDisappearEvent
  | PaywallDidPerformActionEvent
  | PaywallDidSelectProductEvent
  | PaywallDidStartPurchaseEvent
  | PaywallDidFinishPurchaseEvent
  | PaywallDidFailPurchaseEvent
  | PaywallDidStartRestoreEvent
  | PaywallDidFinishRestoreEvent
  | PaywallDidFailRestoreEvent
  | PaywallDidFailRenderingEvent
  | PaywallDidFailLoadingProductsEvent
  | PaywallDidFinishWebPaymentNavigationEvent;
