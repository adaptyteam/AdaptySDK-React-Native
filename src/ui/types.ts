// Re-export all shared UI types from @adapty/core
export type {
  EventHandlerResult,
  ProductPurchaseParams,
  EventHandlers,
  OnboardingEventHandlers,
  OnboardingAnalyticsEventName,
  AdaptyUiOnboardingMeta,
  AdaptyUiOnboardingStateParams,
  OnboardingStateUpdatedAction,
  CreatePaywallViewParamsInput,
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
import { Linking } from 'react-native';
import type { ViewProps } from 'react-native';
import { Log } from '@/logger';
import type {
  EventHandlers,
  OnboardingEventHandlers,
  AdaptyPurchaseResult,
} from '@adapty/core';

/**
 * @internal
 */
export const DEFAULT_EVENT_HANDLERS: EventHandlers = {
  onCloseButtonPress: () => true,
  onAndroidSystemBack: () => true,
  // `Linking.openURL` always opens an external browser (i.e. `browser_out_app`).
  // To honor `browser_in_app`, override this handler
  onUrlPress: (url, openIn) => {
    if (openIn === 'browser_in_app') {
      Log.warn(
        'onUrlPress',
        () =>
          'open_in=browser_in_app is not supported by the default onUrlPress handler. Override onUrlPress to support an in-app browser.',
      );
    }
    Linking.openURL(url);
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
  onRenderingFailed: () => true,
  onLoadingProductsFailed: () => false,
  onWebPaymentNavigationFinished: () => false,
};

/**
 * @internal
 */
export const DEFAULT_ONBOARDING_EVENT_HANDLERS: Partial<OnboardingEventHandlers> =
  {
    onClose: () => true,
  };

export type NativeAdaptyPaywallViewProps = ViewProps & {
  viewId: string;
  paywallJson: string;
};

export type NativeAdaptyOnboardingViewProps = ViewProps & {
  viewId: string;
  onboardingJson: string;
};
