import { EmitterSubscription } from 'react-native';
import type { AdaptyMockConfig } from './mock/types';
/**
 * Name of bridge package
 * React Native looks for a module with provided name
 * via NativeModules API
 *
 * Must be the same as string:
 * - iOS: RNAdapty.m & RNAdapty.swift. Also match in RCT_EXTERN_MODULE
 * - Android: AdaptyReactModule.kt (getName)
 */
export declare const MODULE_NAME = "RNAdapty";
/**
 * Initialize bridge with either native or mock handler
 * @param enableMock - Whether to use mock mode
 * @param mockConfig - Configuration for mock mode
 */
export declare function initBridge(enableMock?: boolean, mockConfig?: AdaptyMockConfig): void;
/**
 * Bridge handler - automatically initializes with native handler if not yet initialized
 * For mock mode, call initBridge(true) in activate() before using
 */
export declare const $bridge: {
    readonly request: (<T>(method: "activate" | "adapty_ui_activate" | "adapty_ui_create_paywall_view" | "adapty_ui_dismiss_paywall_view" | "adapty_ui_present_paywall_view" | "adapty_ui_show_dialog" | "adapty_ui_create_onboarding_view" | "adapty_ui_dismiss_onboarding_view" | "adapty_ui_present_onboarding_view" | "create_web_paywall_url" | "get_current_installation_status" | "is_activated" | "get_paywall" | "get_paywall_for_default_audience" | "get_paywall_products" | "get_onboarding" | "get_onboarding_for_default_audience" | "get_profile" | "identify" | "log_show_paywall" | "logout" | "make_purchase" | "open_web_paywall" | "present_code_redemption_sheet" | "report_transaction" | "restore_purchases" | "set_fallback" | "set_integration_identifiers" | "set_log_level" | "update_attribution_data" | "update_collecting_refund_data_consent" | "update_profile" | "update_refund_preference", params: string, resultType: "AdaptyError" | "AdaptyPaywall" | "AdaptyRemoteConfig" | "AdaptyProfile" | "AdaptyPurchaseResult" | "AdaptyOnboarding" | "AdaptyInstallationStatus" | "AdaptyInstallationDetails" | "AdaptyPaywallProduct" | "AdaptyPaywallBuilder" | "AdaptyUiView" | "AdaptyUiDialogActionType" | "AdaptyUiOnboardingMeta" | "AdaptyUiOnboardingStateParams" | "AdaptyUiOnboardingStateUpdatedAction" | "Array<AdaptyPaywallProduct>" | "BridgeError" | "String" | "Boolean" | "Void", ctx?: import("./logger").LogContext | undefined) => Promise<T>) | (<T_1>(method: "activate" | "adapty_ui_activate" | "adapty_ui_create_paywall_view" | "adapty_ui_dismiss_paywall_view" | "adapty_ui_present_paywall_view" | "adapty_ui_show_dialog" | "adapty_ui_create_onboarding_view" | "adapty_ui_dismiss_onboarding_view" | "adapty_ui_present_onboarding_view" | "create_web_paywall_url" | "get_current_installation_status" | "is_activated" | "get_paywall" | "get_paywall_for_default_audience" | "get_paywall_products" | "get_onboarding" | "get_onboarding_for_default_audience" | "get_profile" | "identify" | "log_show_paywall" | "logout" | "make_purchase" | "open_web_paywall" | "present_code_redemption_sheet" | "report_transaction" | "restore_purchases" | "set_fallback" | "set_integration_identifiers" | "set_log_level" | "update_attribution_data" | "update_collecting_refund_data_consent" | "update_profile" | "update_refund_preference", params: string, _resultType: "AdaptyError" | "AdaptyPaywall" | "AdaptyRemoteConfig" | "AdaptyProfile" | "AdaptyPurchaseResult" | "AdaptyOnboarding" | "AdaptyInstallationStatus" | "AdaptyInstallationDetails" | "AdaptyPaywallProduct" | "AdaptyPaywallBuilder" | "AdaptyUiView" | "AdaptyUiDialogActionType" | "AdaptyUiOnboardingMeta" | "AdaptyUiOnboardingStateParams" | "AdaptyUiOnboardingStateUpdatedAction" | "Array<AdaptyPaywallProduct>" | "BridgeError" | "String" | "Boolean" | "Void", ctx?: import("./logger").LogContext | undefined) => Promise<T_1>);
    addEventListener<Event_1 extends string, CallbackData>(event: Event_1, cb: (this: {
        rawValue: any;
    }, data: CallbackData) => void | Promise<void>): EmitterSubscription;
    addRawEventListener<Event_2 extends string, Cb extends (event: any) => void | Promise<void>>(event: Event_2, cb: Cb): EmitterSubscription;
    removeAllEventListeners(): void;
};
//# sourceMappingURL=bridge.d.ts.map