"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPaywallView = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const adapty_paywall_1 = require("../coders/adapty-paywall");
const coders_1 = require("../coders");
const generate_id_1 = require("../utils/generate-id");
const utils_1 = require("../utils");
const create_paywall_event_handlers_1 = require("./create-paywall-event-handlers");
const view_controller_1 = require("./view-controller");
const AdaptyPaywallView_mock_1 = require("./AdaptyPaywallView.mock");
const NativeAdaptyPaywallView = (0, utils_1.shouldEnableMock)()
    ? AdaptyPaywallView_mock_1.AdaptyPaywallViewMock
    : (0, react_native_1.requireNativeComponent)('AdaptyPaywallView');
const AdaptyPaywallViewComponent = (_a) => {
    var { paywall, params, onCloseButtonPress, onAndroidSystemBack, onProductSelected, onPurchaseStarted, onPurchaseCompleted, onPurchaseFailed, onRestoreStarted, onPaywallClosed, onPaywallShown, onWebPaymentNavigationFinished, onRestoreCompleted, onRestoreFailed, onRenderingFailed, onLoadingProductsFailed, onCustomAction, onUrlPress } = _a, rest = tslib_1.__rest(_a, ["paywall", "params", "onCloseButtonPress", "onAndroidSystemBack", "onProductSelected", "onPurchaseStarted", "onPurchaseCompleted", "onPurchaseFailed", "onRestoreStarted", "onPaywallClosed", "onPaywallShown", "onWebPaymentNavigationFinished", "onRestoreCompleted", "onRestoreFailed", "onRenderingFailed", "onLoadingProductsFailed", "onCustomAction", "onUrlPress"]);
    const uniqueViewId = (0, react_1.useMemo)(() => `${paywall.id}_${(0, generate_id_1.generateId)()}`, [paywall.id]);
    const paywallJson = (0, react_1.useMemo)(() => {
        const encodedPaywall = new adapty_paywall_1.AdaptyPaywallCoder().encode(paywall);
        const paramsWithDefaults = Object.assign(Object.assign({}, view_controller_1.DEFAULT_PARAMS), params);
        const encodedParams = new coders_1.AdaptyUICreatePaywallViewParamsCoder().encode(paramsWithDefaults);
        return JSON.stringify(Object.assign({ paywall: encodedPaywall }, encodedParams));
    }, [paywall, params]);
    const eventHandlers = (0, react_1.useMemo)(() => {
        const handlers = {};
        if (onCloseButtonPress)
            handlers.onCloseButtonPress = onCloseButtonPress;
        if (onAndroidSystemBack)
            handlers.onAndroidSystemBack = onAndroidSystemBack;
        if (onProductSelected)
            handlers.onProductSelected = onProductSelected;
        if (onPurchaseStarted)
            handlers.onPurchaseStarted = onPurchaseStarted;
        if (onPurchaseCompleted)
            handlers.onPurchaseCompleted = onPurchaseCompleted;
        if (onPurchaseFailed)
            handlers.onPurchaseFailed = onPurchaseFailed;
        if (onRestoreStarted)
            handlers.onRestoreStarted = onRestoreStarted;
        if (onPaywallClosed)
            handlers.onPaywallClosed = onPaywallClosed;
        if (onPaywallShown)
            handlers.onPaywallShown = onPaywallShown;
        if (onWebPaymentNavigationFinished)
            handlers.onWebPaymentNavigationFinished = onWebPaymentNavigationFinished;
        if (onRestoreCompleted)
            handlers.onRestoreCompleted = onRestoreCompleted;
        if (onRestoreFailed)
            handlers.onRestoreFailed = onRestoreFailed;
        if (onRenderingFailed)
            handlers.onRenderingFailed = onRenderingFailed;
        if (onLoadingProductsFailed)
            handlers.onLoadingProductsFailed = onLoadingProductsFailed;
        if (onCustomAction)
            handlers.onCustomAction = onCustomAction;
        if (onUrlPress)
            handlers.onUrlPress = onUrlPress;
        return handlers;
    }, [
        onCloseButtonPress,
        onAndroidSystemBack,
        onProductSelected,
        onPurchaseStarted,
        onPurchaseCompleted,
        onPurchaseFailed,
        onRestoreStarted,
        onPaywallClosed,
        onPaywallShown,
        onWebPaymentNavigationFinished,
        onRestoreCompleted,
        onRestoreFailed,
        onRenderingFailed,
        onLoadingProductsFailed,
        onCustomAction,
        onUrlPress,
    ]);
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, create_paywall_event_handlers_1.createPaywallEventHandlers)(eventHandlers, uniqueViewId);
        return unsubscribe;
    }, [uniqueViewId, eventHandlers]);
    return (<NativeAdaptyPaywallView {...rest} viewId={uniqueViewId} paywallJson={paywallJson}/>);
};
exports.AdaptyPaywallView = (0, react_1.memo)(AdaptyPaywallViewComponent);
//# sourceMappingURL=AdaptyPaywallView.js.map