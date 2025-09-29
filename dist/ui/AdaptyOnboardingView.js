"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyOnboardingView = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const adapty_onboarding_1 = require("../coders/adapty-onboarding");
const NativeAdaptyOnboardingView = (0, react_native_1.requireNativeComponent)('AdaptyOnboardingView');
const AdaptyOnboardingView = (_a) => {
    var { onboarding, eventHandlers } = _a, rest = tslib_1.__rest(_a, ["onboarding", "eventHandlers"]);
    const coder = new adapty_onboarding_1.AdaptyOnboardingCoder();
    const uniqueViewId = (0, react_1.useMemo)(() => {
        const instanceId = `${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 7)}`;
        return `${onboarding.id}_${instanceId}`;
    }, [onboarding.id]);
    const handleEvent = (e) => {
        if (!eventHandlers)
            return;
        const { eventId, eventData } = e.nativeEvent;
        let parsedData = {};
        try {
            parsedData = JSON.parse(eventData);
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Failed to parse event data:', error);
            return;
        }
        const handlerName = getHandlerNameForEvent(eventId);
        if (!handlerName) {
            return;
        }
        const callbackArgs = extractOnboardingCallbackArgs(handlerName, parsedData);
        const handler = eventHandlers[handlerName];
        if (handler) {
            handler(...callbackArgs);
        }
    };
    const getHandlerNameForEvent = (eventId) => {
        switch (eventId) {
            case 'onboarding_on_close_action':
                return 'onClose';
            case 'onboarding_on_custom_action':
                return 'onCustom';
            case 'onboarding_on_paywall_action':
                return 'onPaywall';
            case 'onboarding_on_state_updated_action':
                return 'onStateUpdated';
            case 'onboarding_did_finish_loading':
                return 'onFinishedLoading';
            case 'onboarding_on_analytics_action':
                return 'onAnalytics';
            case 'onboarding_did_fail_with_error':
                return 'onError';
            default:
                return null;
        }
    };
    const extractOnboardingCallbackArgs = (handlerName, eventArg) => {
        const actionId = eventArg['id'] || '';
        const meta = eventArg['meta'] || {};
        const event = eventArg['event'] || {};
        const action = eventArg['action'] || {};
        switch (handlerName) {
            case 'onClose':
            case 'onCustom':
            case 'onPaywall':
                return [actionId, meta];
            case 'onStateUpdated':
                return [action, meta];
            case 'onFinishedLoading':
                return [meta];
            case 'onAnalytics':
                return [event, meta];
            case 'onError':
                return [eventArg['error']];
            default:
                return [];
        }
    };
    return (<NativeAdaptyOnboardingView {...rest} viewId={uniqueViewId} onboardingJson={JSON.stringify(coder.encode(onboarding))} onEvent={handleEvent}/>);
};
exports.AdaptyOnboardingView = AdaptyOnboardingView;
//# sourceMappingURL=AdaptyOnboardingView.js.map