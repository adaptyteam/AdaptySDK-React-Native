import { EmitterSubscription } from 'react-native';
import { NativeRequestHandler } from './native-request-handler';
import { MockRequestHandler } from './mock';
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
 * Check if bridge has been initialized
 * @returns true if bridge is initialized, false otherwise
 */
export declare function isBridgeInitialized(): boolean;
/**
 * Bridge handler - automatically initializes with native handler if not yet initialized
 * For mock mode, call initBridge(true) in activate() before using
 */
export declare const $bridge: {
    readonly request: (<T>(method: "activate" | "is_activated" | "get_profile" | "get_paywall" | "get_paywall_for_default_audience" | "get_paywall_products" | "get_onboarding" | "get_onboarding_for_default_audience" | "make_purchase" | "restore_purchases" | "identify" | "logout" | "update_profile" | "log_show_paywall" | "set_log_level" | "update_attribution_data" | "set_fallback" | "set_integration_identifiers" | "report_transaction" | "present_code_redemption_sheet" | "update_collecting_refund_data_consent" | "update_refund_preference" | "open_web_paywall" | "create_web_paywall_url" | "get_current_installation_status" | "adapty_ui_create_paywall_view" | "adapty_ui_create_onboarding_view" | "adapty_ui_present_paywall_view" | "adapty_ui_present_onboarding_view" | "adapty_ui_dismiss_paywall_view" | "adapty_ui_dismiss_onboarding_view" | "adapty_ui_activate" | "adapty_ui_show_dialog", params: string, resultType: "AdaptyError" | "AdaptyProfile" | "AdaptyPurchaseResult" | "AdaptyPaywall" | "AdaptyPaywallProduct" | "AdaptyOnboarding" | "AdaptyRemoteConfig" | "AdaptyPaywallBuilder" | "AdaptyInstallationStatus" | "AdaptyInstallationDetails" | "AdaptyUiView" | "AdaptyUiDialogActionType" | "AdaptyUiOnboardingMeta" | "AdaptyUiOnboardingStateParams" | "AdaptyUiOnboardingStateUpdatedAction" | "Array<AdaptyPaywallProduct>" | "BridgeError" | "String" | "Boolean" | "Void", ctx?: import("@adapty/core").LogContext | undefined) => Promise<T>) | (<T_1>(method: "activate" | "is_activated" | "get_profile" | "get_paywall" | "get_paywall_for_default_audience" | "get_paywall_products" | "get_onboarding" | "get_onboarding_for_default_audience" | "make_purchase" | "restore_purchases" | "identify" | "logout" | "update_profile" | "log_show_paywall" | "set_log_level" | "update_attribution_data" | "set_fallback" | "set_integration_identifiers" | "report_transaction" | "present_code_redemption_sheet" | "update_collecting_refund_data_consent" | "update_refund_preference" | "open_web_paywall" | "create_web_paywall_url" | "get_current_installation_status" | "adapty_ui_create_paywall_view" | "adapty_ui_create_onboarding_view" | "adapty_ui_present_paywall_view" | "adapty_ui_present_onboarding_view" | "adapty_ui_dismiss_paywall_view" | "adapty_ui_dismiss_onboarding_view" | "adapty_ui_activate" | "adapty_ui_show_dialog", params: string, _resultType: "AdaptyError" | "AdaptyProfile" | "AdaptyPurchaseResult" | "AdaptyPaywall" | "AdaptyPaywallProduct" | "AdaptyOnboarding" | "AdaptyRemoteConfig" | "AdaptyPaywallBuilder" | "AdaptyInstallationStatus" | "AdaptyInstallationDetails" | "AdaptyUiView" | "AdaptyUiDialogActionType" | "AdaptyUiOnboardingMeta" | "AdaptyUiOnboardingStateParams" | "AdaptyUiOnboardingStateUpdatedAction" | "Array<AdaptyPaywallProduct>" | "BridgeError" | "String" | "Boolean" | "Void", ctx?: import("@adapty/core").LogContext | undefined) => Promise<T_1>);
    addEventListener<Event_1 extends string, CallbackData>(event: Event_1, cb: (this: {
        rawValue: any;
    }, data: CallbackData) => void | Promise<void>): EmitterSubscription;
    addRawEventListener<Event_2 extends string, Cb extends (event: any) => void | Promise<void>>(event: Event_2, cb: Cb): EmitterSubscription;
    removeAllEventListeners(): void;
    /**
     * Provides access to internal bridge for testing purposes only
     * @internal
     */
    readonly testBridge: NativeRequestHandler<"activate" | "is_activated" | "get_profile" | "get_paywall" | "get_paywall_for_default_audience" | "get_paywall_products" | "get_onboarding" | "get_onboarding_for_default_audience" | "make_purchase" | "restore_purchases" | "identify" | "logout" | "update_profile" | "log_show_paywall" | "set_log_level" | "update_attribution_data" | "set_fallback" | "set_integration_identifiers" | "report_transaction" | "present_code_redemption_sheet" | "update_collecting_refund_data_consent" | "update_refund_preference" | "open_web_paywall" | "create_web_paywall_url" | "get_current_installation_status" | "adapty_ui_create_paywall_view" | "adapty_ui_create_onboarding_view" | "adapty_ui_present_paywall_view" | "adapty_ui_present_onboarding_view" | "adapty_ui_dismiss_paywall_view" | "adapty_ui_dismiss_onboarding_view" | "adapty_ui_activate" | "adapty_ui_show_dialog", string> | MockRequestHandler<"activate" | "is_activated" | "get_profile" | "get_paywall" | "get_paywall_for_default_audience" | "get_paywall_products" | "get_onboarding" | "get_onboarding_for_default_audience" | "make_purchase" | "restore_purchases" | "identify" | "logout" | "update_profile" | "log_show_paywall" | "set_log_level" | "update_attribution_data" | "set_fallback" | "set_integration_identifiers" | "report_transaction" | "present_code_redemption_sheet" | "update_collecting_refund_data_consent" | "update_refund_preference" | "open_web_paywall" | "create_web_paywall_url" | "get_current_installation_status" | "adapty_ui_create_paywall_view" | "adapty_ui_create_onboarding_view" | "adapty_ui_present_paywall_view" | "adapty_ui_present_onboarding_view" | "adapty_ui_dismiss_paywall_view" | "adapty_ui_dismiss_onboarding_view" | "adapty_ui_activate" | "adapty_ui_show_dialog", string> | null;
};
//# sourceMappingURL=bridge.d.ts.map