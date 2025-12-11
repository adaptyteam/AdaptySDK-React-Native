import { LogContext } from '../logger';
declare const AdaptyTypes: readonly ["AdaptyError", "AdaptyProfile", "AdaptyPurchaseResult", "AdaptyPaywall", "AdaptyPaywallProduct", "AdaptyOnboarding", "AdaptyRemoteConfig", "AdaptyPaywallBuilder", "AdaptyInstallationStatus", "AdaptyInstallationDetails", "AdaptyUiView", "AdaptyUiDialogActionType", "AdaptyUiOnboardingMeta", "AdaptyUiOnboardingStateParams", "AdaptyUiOnboardingStateUpdatedAction", "Array<AdaptyPaywallProduct>", "BridgeError", "String", "Boolean", "Void"];
export type AdaptyType = (typeof AdaptyTypes)[number];
export declare function parseMethodResult<T>(input: string, resultType: AdaptyType, ctx?: LogContext): T;
export declare function parseCommonEvent(event: string, input: string, ctx?: LogContext): any;
export declare function parsePaywallEvent(input: string, ctx?: LogContext): Record<string, any>;
export {};
//# sourceMappingURL=parse.d.ts.map