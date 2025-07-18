import { AdaptyError } from '@/adapty-error';
import {
  AdaptyPaywallProduct,
  AdaptyProfile,
  AdaptyPurchaseResult,
} from '@/types';
import { FileLocation } from '@/types/inputs';

/**
 * @internal
 */
export type ArgType<T> = T extends () => any
  ? void
  : T extends (arg: infer U) => any
  ? U
  : void;

/**
 * EventHandler callback should not return a promise,
 * because using `await` may postpone closing a paywall view.
 *
 * We don't want to block the UI thread.
 */
export type EventHandlerResult = boolean | void;

/**
 * Hashmap of possible events to their callbacks
 *
 * @see {@link https://docs.adapty.io/docs/react-native-handling-events | [DOC] Handling View Events}
 */
export interface EventHandlers {
  /**
   * Called when a user taps the close button on the paywall view
   *
   * If you return `true`, the paywall view will be closed.
   * We strongly recommend to return `true` in this case.
   * @default true
   */
  onCloseButtonPress: () => EventHandlerResult;
  /**
   * Called when a user navigates back on Android
   *
   * If you return `true`, the paywall view will be closed.
   * We strongly recommend to return `true` in this case.
   * @default true
   */
  onAndroidSystemBack: () => EventHandlerResult;
  /**
   * Called when a user taps the product in the paywall view
   *
   * If you return `true` from this callback, the paywall view will be closed.
   */
  onProductSelected: (productId: string) => EventHandlerResult;
  /**
   * Called when a user taps the purchase button in the paywall view
   *
   * If you return `true` from this callback, the paywall view will be closed.
   */
  onPurchaseStarted: (product: AdaptyPaywallProduct) => EventHandlerResult;
  /**
   * Called when the purchase succeeds, the user cancels their purchase, or the purchase appears to be pending
   *
   * If you return `true` from this callback, the paywall view will be closed.
   * We strongly recommend returning `purchaseResult.type !== 'user_cancelled'` in this case.
   * @default `purchaseResult.type !== 'user_cancelled'`
   *
   * @param {AdaptyPurchaseResult} purchaseResult - object, which provides details about the purchase.
   * If the result is `'success'`, it also includes the updated user's profile.
   */
  onPurchaseCompleted: (
    purchaseResult: AdaptyPurchaseResult,
    product: AdaptyPaywallProduct,
  ) => EventHandlerResult;
  /**
   * Called if a purchase fails after a user taps the purchase button
   *
   * If you return `true` from this callback, the paywall view will be closed.
   *
   * @param {AdaptyError} error - AdaptyError object with error code and message
   */
  onPurchaseFailed: (
    error: AdaptyError,
    product: AdaptyPaywallProduct,
  ) => EventHandlerResult;
  /**
   * Called when a user taps the restore button in the paywall view
   *
   * If you return `true` from this callback, the paywall view will be closed.
   */
  onRestoreStarted: () => EventHandlerResult;

  onPaywallClosed: () => EventHandlerResult;

  onPaywallShown: () => EventHandlerResult;

  onWebPaymentNavigationFinished: (
    product?: AdaptyPaywallProduct,
    error?: AdaptyError,
  ) => EventHandlerResult;
  /**
   * Called when a purchase is completed
   *
   * If you return `true` from this callback, the paywall view will be closed.
   * We strongly recommend to return `true` in this case.
   * @default true
   *
   * @param {AdaptyProfile} profile - updated user profile
   */
  onRestoreCompleted: (profile: AdaptyProfile) => EventHandlerResult;
  /**
   * Called if a restore fails after a user taps the restore button
   *
   * If you return `true` from this callback, the paywall view will be closed.
   *
   * @param {AdaptyError} error - AdaptyError object with error code and message
   */
  onRestoreFailed: (error: AdaptyError) => EventHandlerResult;
  /**
   * Called if a paywall view fails to render.
   * This  should not ever happen, but if it does, feel free to report it to us.
   *
   * If you return `true` from this callback, the paywall view will be closed.
   *
   * @param {AdaptyError} error - AdaptyError object with error code and message
   */
  onRenderingFailed: (error: AdaptyError) => EventHandlerResult;
  /**
   * Called if a product list fails to load on a presented view,
   * for example, if there is no internet connection
   *
   * If you return `true` from this callback, the paywall view will be closed.
   *
   * @param {AdaptyError} error - AdaptyError object with error code and message
   */
  onLoadingProductsFailed: (error: AdaptyError) => EventHandlerResult;
  onCustomAction: (actionId: string) => EventHandlerResult;
  onUrlPress: (url: string) => EventHandlerResult;
}

export interface OnboardingEventHandlers {
  onClose: (
    actionId: string,
    meta: AdaptyUiOnboardingMeta,
  ) => EventHandlerResult;
  onCustom: (
    actionId: string,
    meta: AdaptyUiOnboardingMeta,
  ) => EventHandlerResult;
  onPaywall: (
    actionId: string,
    meta: AdaptyUiOnboardingMeta,
  ) => EventHandlerResult;
  onStateUpdated: (
    action: OnboardingStateUpdatedAction,
    meta: AdaptyUiOnboardingMeta,
  ) => EventHandlerResult;
  onFinishedLoading: (meta: AdaptyUiOnboardingMeta) => EventHandlerResult;
  onAnalytics: (
    event: {
      name: OnboardingAnalyticsEventName;
      element_id?: string;
      reply?: string;
    },
    meta: AdaptyUiOnboardingMeta,
  ) => EventHandlerResult;
  onError: (error: AdaptyError) => EventHandlerResult;
}

export type OnboardingAnalyticsEventName =
  | 'onboarding_started'
  | 'screen_presented'
  | 'screen_completed'
  | 'second_screen_presented'
  | 'registration_screen_presented'
  | 'products_screen_presented'
  | 'user_email_collected'
  | 'onboarding_completed'
  | (string & {});

export type AdaptyUiOnboardingMeta = {
  onboardingId: string;
  screenClientId: string;
  screenIndex: number;
  totalScreens: number;
};

export type AdaptyUiOnboardingStateParams = {
  id: string;
  value: string;
  label: string;
};

export type OnboardingStateUpdatedAction =
  | {
      elementId: string;
      elementType: 'select';
      value: AdaptyUiOnboardingStateParams;
    }
  | {
      elementId: string;
      elementType: 'multi_select';
      value: AdaptyUiOnboardingStateParams[];
    }
  | {
      elementId: string;
      elementType: 'input';
      value:
        | { type: 'text' | 'email'; value: string }
        | { type: 'number'; value: number };
    }
  | {
      elementId: string;
      elementType: 'date_picker';
      value: {
        day?: number;
        month?: number;
        year?: number;
      };
    };

/**
 * Additional options for creating a paywall view
 *
 * @see {@link https://docs.adapty.io/docs/paywall-builder-fetching | [DOC] Creating Paywall View}
 */
export interface CreatePaywallViewParamsInput {
  /**
   * `true` if you want to prefetch products before presenting a paywall view.
   */
  prefetchProducts?: boolean;
  /**
   * This value limits the timeout (in milliseconds) for this method.
   */
  loadTimeoutMs?: number;
  /**
   * If you are going to use custom tags functionality, pass an object with tags and corresponding replacement values
   *
   * ```
   * {
   *   'USERNAME': 'Bruce',
   *   'CITY': 'Philadelphia'
   * }
   * ```
   */
  customTags?: Record<string, string>;
  /**
   * If you are going to use custom timer functionality, pass an object with timer ids and corresponding dates the timers should end at
   */
  customTimers?: Record<string, Date>;

  customAssets?: Record<string, AdaptyCustomAsset>;
}

export interface AdaptyUiView {
  id: string;
}

export interface AdaptyUiMediaCache {
  memoryStorageTotalCostLimit?: number;
  memoryStorageCountLimit?: number;
  diskStorageSizeLimit?: number;
}

export interface AdaptyUiDialogConfig {
  /**
   * The action title to display as part of the dialog. If you provide two actions,
   * be sure `primaryAction` cancels the operation and leaves things unchanged.
   */
  primaryActionTitle: string;
  /**
   * The secondary action title to display as part of the dialog.
   */
  secondaryActionTitle?: string;
  /**
   * The title of the dialog.
   */
  title?: string;
  /**
   * Descriptive text that provides additional details about the reason for the dialog.
   */
  content?: string;
}

export const AdaptyUiDialogActionType = Object.freeze({
  primary: 'primary',
  secondary: 'secondary',
});
export type AdaptyUiDialogActionType =
  (typeof AdaptyUiDialogActionType)[keyof typeof AdaptyUiDialogActionType];

/**
 * @internal
 */
export const DEFAULT_EVENT_HANDLERS: Partial<EventHandlers> = {
  onCloseButtonPress: () => true,
  onAndroidSystemBack: () => true,
  onRestoreCompleted: () => true,
  onPurchaseCompleted: (purchaseResult: AdaptyPurchaseResult) =>
    purchaseResult.type !== 'user_cancelled',
};

/**
 * @internal
 */
export const DEFAULT_ONBOARDING_EVENT_HANDLERS: Partial<OnboardingEventHandlers> =
  {
    onClose: () => true,
  };

export type AdaptyCustomAsset =
  | AdaptyCustomImageAsset
  | AdaptyCustomVideoAsset
  | AdaptyCustomColorAsset
  | AdaptyCustomGradientAsset;

export type AdaptyCustomImageAsset =
  | { type: 'image'; base64: string }
  | { type: 'image'; relativeAssetPath: string } // shorthand: uses same path for both iOS fileName and Android relativeAssetPath
  | { type: 'image'; fileLocation: FileLocation }; // full control for platform-specific paths

export type AdaptyCustomVideoAsset =
  | { type: 'video'; relativeAssetPath: string } // shorthand: uses same path for both iOS fileName and Android relativeAssetPath
  | { type: 'video'; fileLocation: FileLocation }; // full control for platform-specific paths

export type AdaptyCustomColorAsset =
  | { type: 'color'; argb: number /* e.g. 0xFFFF0000 (opaque red) */ }
  | { type: 'color'; rgb: number /* e.g. 0xFF0000 (red) */ }
  | { type: 'color'; rgba: number /* e.g. 0xFF0000FF (opaque red) */ };

export type AdaptyCustomGradientAsset = {
  type: 'linear-gradient';
  values: (
    | { p: number; argb: number }
    | { p: number; rgb: number }
    | { p: number; rgba: number }
  )[];
  points?: { x0?: number; y0?: number; x1?: number; y1?: number };
};
