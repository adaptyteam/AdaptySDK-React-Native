"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPaywallView = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const factory_1 = require("../coders/factory");
const utils_1 = require("../utils");
const create_paywall_event_handlers_1 = require("./create-paywall-event-handlers");
const view_controller_1 = require("./view-controller");
const AdaptyPaywallView_mock_1 = require("./AdaptyPaywallView.mock");
const core_1 = require("@adapty/core");
const NativeAdaptyPaywallView = (0, utils_1.shouldEnableMock)()
    ? AdaptyPaywallView_mock_1.AdaptyPaywallViewMock
    : (0, react_native_1.requireNativeComponent)('AdaptyPaywallView');
const AdaptyPaywallViewComponent = (_a) => {
    var { paywall, params, onCloseButtonPress, onProductSelected, onPurchaseStarted, onPurchaseCompleted, onPurchaseFailed, onRestoreStarted, onPaywallShown, onWebPaymentNavigationFinished, onRestoreCompleted, onRestoreFailed, onRenderingFailed, onLoadingProductsFailed, onCustomAction, onUrlPress } = _a, rest = tslib_1.__rest(_a, ["paywall", "params", "onCloseButtonPress", "onProductSelected", "onPurchaseStarted", "onPurchaseCompleted", "onPurchaseFailed", "onRestoreStarted", "onPaywallShown", "onWebPaymentNavigationFinished", "onRestoreCompleted", "onRestoreFailed", "onRenderingFailed", "onLoadingProductsFailed", "onCustomAction", "onUrlPress"]);
    const uniqueViewId = (0, react_1.useMemo)(() => `${paywall.id}_${(0, utils_1.generateId)()}`, [paywall.id]);
    const paywallJson = (0, react_1.useMemo)(() => {
        const encodedPaywall = factory_1.coderFactory.createPaywallCoder().encode(paywall);
        const paramsWithDefaults = Object.assign(Object.assign({}, view_controller_1.DEFAULT_PARAMS), params);
        const encodedParams = factory_1.coderFactory
            .createUiCreatePaywallViewParamsCoder()
            .encode(paramsWithDefaults);
        return JSON.stringify(Object.assign({ paywall: encodedPaywall }, encodedParams));
    }, [paywall, params]);
    const eventHandlers = (0, react_1.useMemo)(() => (0, core_1.filterUndefined)({
        onCloseButtonPress,
        onProductSelected,
        onPurchaseStarted,
        onPurchaseCompleted,
        onPurchaseFailed,
        onRestoreStarted,
        onPaywallShown,
        onWebPaymentNavigationFinished,
        onRestoreCompleted,
        onRestoreFailed,
        onRenderingFailed,
        onLoadingProductsFailed,
        onCustomAction,
        onUrlPress,
    }), [
        onCloseButtonPress,
        onProductSelected,
        onPurchaseStarted,
        onPurchaseCompleted,
        onPurchaseFailed,
        onRestoreStarted,
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
/**
 * React component that renders a native paywall view.
 *
 * @remarks
 * Accepts a paywall object and optional event handler props.
 * Under the hood, it creates a native view and subscribes to paywall events.
 *
 * @see {@link AdaptyPaywallViewProps} for available props
 * @public
 */
exports.AdaptyPaywallView = (0, react_1.memo)(AdaptyPaywallViewComponent);
//# sourceMappingURL=AdaptyPaywallView.js.map