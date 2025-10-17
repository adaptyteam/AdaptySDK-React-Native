import { NativeRequestHandler } from './native-request-handler';
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
export declare const $bridge: NativeRequestHandler<"activate" | "adapty_ui_activate" | "adapty_ui_create_paywall_view" | "adapty_ui_dismiss_paywall_view" | "adapty_ui_present_paywall_view" | "adapty_ui_show_dialog" | "adapty_ui_create_onboarding_view" | "adapty_ui_dismiss_onboarding_view" | "adapty_ui_present_onboarding_view" | "create_web_paywall_url" | "get_current_installation_status" | "is_activated" | "get_paywall" | "get_paywall_for_default_audience" | "get_paywall_products" | "get_onboarding" | "get_onboarding_for_default_audience" | "get_profile" | "identify" | "log_show_onboarding" | "log_show_paywall" | "logout" | "make_purchase" | "open_web_paywall" | "present_code_redemption_sheet" | "report_transaction" | "restore_purchases" | "set_fallback" | "set_integration_identifiers" | "set_log_level" | "update_attribution_data" | "update_collecting_refund_data_consent" | "update_profile" | "update_refund_preference", string>;
//# sourceMappingURL=bridge.d.ts.map