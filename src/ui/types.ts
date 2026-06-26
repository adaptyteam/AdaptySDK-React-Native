// Re-export all shared UI types from @adapty/core
export type {
  EventHandlerResult,
  ProductPurchaseParams,
  FlowEventHandlers,
  OnboardingEventHandlers,
  OnboardingAnalyticsEventName,
  AdaptyUiOnboardingMeta,
  AdaptyUiOnboardingStateParams,
  OnboardingStateUpdatedAction,
  FlowPermissionResponse,
  FlowPermissionStatus,
  AdaptyPermission,
  CreateFlowViewParamsInput,
  CreateOnboardingViewParamsInput,
  AdaptyUiView,
  AdaptyUiMediaCache,
  AdaptyUiDialogConfig,
  AdaptyCustomAsset,
  AdaptyCustomImageAsset,
  AdaptyCustomVideoAsset,
  AdaptyCustomColorAsset,
  AdaptyCustomGradientAsset,
  AdaptyIOSPresentationStyle,
} from '@adapty/core';

export { AdaptyUiDialogActionType } from '@adapty/core';

// RN-specific: Default event handlers
import type { ViewProps } from 'react-native';
import { adapty } from '@/adapty-instance';
import { Log } from '@/logger';
import type {
  FlowEventHandlers,
  OnboardingEventHandlers,
  AdaptyPurchaseResult,
} from '@adapty/core';

/**
 * @internal
 */
export const DEFAULT_FLOW_EVENT_HANDLERS: FlowEventHandlers = {
  onCloseButtonPress: () => true,
  onAndroidSystemBack: () => false,
  // Delegate to the handler method, which opens the URL natively honoring
  // `open_in` (`browser_out_app` → external browser, `browser_in_app` → in-app
  // browser). Override this handler to open URLs yourself instead.
  onUrlPress: (url, openIn) => {
    void adapty
      .openWebUrl(url, openIn)
      .catch(error =>
        Log.warn('onUrlPress', () => `Failed to open url via native: ${error}`),
      );

    return false; // Keep paywall open
  },
  onCustomAction: () => false,
  onProductSelected: () => false,
  onPurchaseStarted: () => false,
  onPurchaseCompleted: (purchaseResult: AdaptyPurchaseResult) =>
    purchaseResult.type !== 'user_cancelled',
  onPurchaseFailed: () => false,
  onRestoreStarted: () => false,
  onRestoreCompleted: () => true,
  onRestoreFailed: () => false,
  onAppeared: () => false,
  onDisappeared: () => false,
  onError: () => true,
  onLoadingProductsFailed: () => false,
  onWebPaymentNavigationFinished: () => false,
  // Delegate to the handler method, which shows the platform app-review prompt
  // natively (`SKStoreReviewController` on iOS, In-App Review on Android).
  // Override this handler to control the prompt yourself instead.
  onRequestAppReview: () => {
    void adapty
      .requestAppReview()
      .catch(error =>
        Log.warn(
          'onRequestAppReview',
          () => `Failed to request app review via native: ${error}`,
        ),
      );

    return false; // Keep paywall open
  },
  onAnalytics: () => false,
  // Reply `unavailable` by default so native always gets a correlated answer.
  onRequestPermission: async () => ({ status: 'unavailable' as const }),
  // Observer mode: no-op by default. If you enable observer mode and present a
  // flow view, provide these handlers to drive purchase/restore yourself.
  onObserverPurchaseInitiated: () => false,
  onObserverRestoreInitiated: () => false,
};

/**
 * @internal
 */
export const DEFAULT_ONBOARDING_EVENT_HANDLERS: Partial<OnboardingEventHandlers> =
  {
    onClose: () => true,
  };

export type NativeAdaptyFlowViewProps = ViewProps & {
  viewId: string;
  flowJson: string;
};

export type NativeAdaptyOnboardingViewProps = ViewProps & {
  viewId: string;
  onboardingJson: string;
};
