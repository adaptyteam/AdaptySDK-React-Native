"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyOnboardingView = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const factory_1 = require("../coders/factory");
const utils_1 = require("../utils");
const create_onboarding_event_handlers_1 = require("./create-onboarding-event-handlers");
const onboarding_view_controller_1 = require("./onboarding-view-controller");
const AdaptyOnboardingView_mock_1 = require("./AdaptyOnboardingView.mock");
const core_1 = require("@adapty/core");
const NativeAdaptyOnboardingView = (0, utils_1.shouldEnableMock)()
    ? AdaptyOnboardingView_mock_1.AdaptyOnboardingViewMock
    : (0, react_native_1.requireNativeComponent)('AdaptyOnboardingView');
const AdaptyOnboardingViewComponent = (_a) => {
    var { onboarding, externalUrlsPresentation = onboarding_view_controller_1.DEFAULT_ONBOARDING_PARAMS.externalUrlsPresentation, eventHandlers, onClose, onCustom, onPaywall, onStateUpdated, onFinishedLoading, onAnalytics, onError } = _a, rest = tslib_1.__rest(_a, ["onboarding", "externalUrlsPresentation", "eventHandlers", "onClose", "onCustom", "onPaywall", "onStateUpdated", "onFinishedLoading", "onAnalytics", "onError"]);
    const uniqueViewId = (0, react_1.useMemo)(() => `${onboarding.id}_${(0, utils_1.generateId)()}`, [onboarding.id]);
    const onboardingJson = (0, react_1.useMemo)(() => {
        const encodedOnboarding = factory_1.coderFactory
            .createOnboardingCoder()
            .encode(onboarding);
        const encodedParams = factory_1.coderFactory
            .createUiCreateOnboardingViewParamsCoder()
            .encode({
            externalUrlsPresentation,
        });
        return JSON.stringify(Object.assign({ onboarding: encodedOnboarding }, encodedParams));
    }, [onboarding, externalUrlsPresentation]);
    const combinedEventHandlers = (0, react_1.useMemo)(() => {
        // Merge legacy eventHandlers with individual props (individual props take priority)
        return Object.assign(Object.assign({}, eventHandlers), (0, core_1.filterUndefined)({
            onClose,
            onCustom,
            onPaywall,
            onStateUpdated,
            onFinishedLoading,
            onAnalytics,
            onError,
        }));
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
        const unsubscribe = (0, create_onboarding_event_handlers_1.createOnboardingEventHandlers)(combinedEventHandlers, uniqueViewId);
        return unsubscribe;
    }, [uniqueViewId, combinedEventHandlers]);
    return (<NativeAdaptyOnboardingView {...rest} viewId={uniqueViewId} onboardingJson={onboardingJson}/>);
};
/**
 * React component that renders a native onboarding view.
 *
 * @remarks
 * Accepts an onboarding object and optional event handler props.
 * Under the hood, it creates a native view and subscribes to onboarding events.
 *
 * @see {@link AdaptyOnboardingViewProps} for available props
 * @public
 */
exports.AdaptyOnboardingView = (0, react_1.memo)(AdaptyOnboardingViewComponent);
//# sourceMappingURL=AdaptyOnboardingView.js.map