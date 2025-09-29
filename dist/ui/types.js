"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ONBOARDING_EVENT_HANDLERS = exports.DEFAULT_EVENT_HANDLERS = exports.AdaptyUiDialogActionType = void 0;
const react_native_1 = require("react-native");
exports.AdaptyUiDialogActionType = Object.freeze({
    primary: 'primary',
    secondary: 'secondary',
});
/**
 * @internal
 */
exports.DEFAULT_EVENT_HANDLERS = {
    onCloseButtonPress: () => true,
    onAndroidSystemBack: () => true,
    onRestoreCompleted: () => true,
    onPurchaseCompleted: (purchaseResult) => purchaseResult.type !== 'user_cancelled',
    onUrlPress: url => {
        react_native_1.Linking.openURL(url);
        return false; // Keep paywall open
    },
};
/**
 * @internal
 */
exports.DEFAULT_ONBOARDING_EVENT_HANDLERS = {
    onClose: () => true,
};
//# sourceMappingURL=types.js.map