"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyOnboardingView = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const adapty_onboarding_1 = require("../coders/adapty-onboarding");
const generate_id_1 = require("../utils/generate-id");
const utils_1 = require("../utils");
const onboarding_view_controller_1 = require("./onboarding-view-controller");
const AdaptyOnboardingView_mock_1 = require("./AdaptyOnboardingView.mock");
const NativeAdaptyOnboardingView = (0, utils_1.shouldEnableMock)()
    ? AdaptyOnboardingView_mock_1.AdaptyOnboardingViewMock
    : (0, react_native_1.requireNativeComponent)('AdaptyOnboardingView');
const AdaptyOnboardingViewComponent = (_a) => {
    var { onboarding, eventHandlers, onClose, onCustom, onPaywall, onStateUpdated, onFinishedLoading, onAnalytics, onError } = _a, rest = tslib_1.__rest(_a, ["onboarding", "eventHandlers", "onClose", "onCustom", "onPaywall", "onStateUpdated", "onFinishedLoading", "onAnalytics", "onError"]);
    const uniqueViewId = (0, react_1.useMemo)(() => `${onboarding.id}_${(0, generate_id_1.generateId)()}`, [onboarding.id]);
    const onboardingJson = (0, react_1.useMemo)(() => JSON.stringify(new adapty_onboarding_1.AdaptyOnboardingCoder().encode(onboarding)), [onboarding]);
    const combinedEventHandlers = (0, react_1.useMemo)(() => {
        const individualHandlers = {};
        if (onClose)
            individualHandlers.onClose = onClose;
        if (onCustom)
            individualHandlers.onCustom = onCustom;
        if (onPaywall)
            individualHandlers.onPaywall = onPaywall;
        if (onStateUpdated)
            individualHandlers.onStateUpdated = onStateUpdated;
        if (onFinishedLoading)
            individualHandlers.onFinishedLoading = onFinishedLoading;
        if (onAnalytics)
            individualHandlers.onAnalytics = onAnalytics;
        if (onError)
            individualHandlers.onError = onError;
        // Merge legacy eventHandlers with individual props (individual props take priority)
        return Object.assign(Object.assign({}, eventHandlers), individualHandlers);
    }, [
        onClose,
        onCustom,
        onPaywall,
        onStateUpdated,
        onFinishedLoading,
        onAnalytics,
        onError,
        eventHandlers,
    ]);
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, onboarding_view_controller_1.setEventHandlers)(combinedEventHandlers, uniqueViewId);
        return unsubscribe;
    }, [uniqueViewId, combinedEventHandlers]);
    return (<NativeAdaptyOnboardingView {...rest} viewId={uniqueViewId} onboardingJson={onboardingJson}/>);
};
exports.AdaptyOnboardingView = (0, react_1.memo)(AdaptyOnboardingViewComponent);
//# sourceMappingURL=AdaptyOnboardingView.js.map