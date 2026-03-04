"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ONBOARDING_EVENT_HANDLERS = exports.DEFAULT_EVENT_HANDLERS = exports.AdaptyUiDialogActionType = void 0;
var core_1 = require("@adapty/core");
Object.defineProperty(exports, "AdaptyUiDialogActionType", { enumerable: true, get: function () { return core_1.AdaptyUiDialogActionType; } });
// RN-specific: Default event handlers
const react_native_1 = require("react-native");
/**
 * @internal
 */
exports.DEFAULT_EVENT_HANDLERS = {
    onCloseButtonPress: () => true,
    onAndroidSystemBack: () => true,
    onRestoreCompleted: () => true,
    onRenderingFailed: () => true,
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