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
import { $bridge } from '@/bridge';
import { Log, LogContext } from '@/logger';
import type { Req } from '@/types/schema';
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
  onAndroidSystemBack: () => true,
  // Delegate to native, which opens the URL honoring `open_in`
  // (`browser_out_app` → external browser, `browser_in_app` → in-app browser).
  // Override this handler to open URLs yourself instead.
  onUrlPress: (url, openIn) => {
    const ctx = new LogContext();
    const body = JSON.stringify({
      method: 'adapty_ui_open_url',
      url,
      open_in: openIn,
    } satisfies Req['AdaptyUIOpenUrl.Request']);

    void $bridge
      .request('adapty_ui_open_url', body, 'Void', ctx)
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
  // Delegate to native, which shows the platform app-review prompt
  // (`SKStoreReviewController` on iOS, In-App Review on Android).
  // Override this handler to control the prompt yourself instead.
  onRequestAppReview: () => {
    const ctx = new LogContext();
    const body = JSON.stringify({
      method: 'adapty_ui_request_app_review',
    } satisfies Req['AdaptyUIRequestAppReview.Request']);

    void $bridge
      .request('adapty_ui_request_app_review', body, 'Void', ctx)
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
