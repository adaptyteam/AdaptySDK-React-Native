"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyPaywallViewMock = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const mock_styles_1 = require("./mock-styles");
/**
 * Mock implementation of AdaptyPaywallView component.
 *
 * This component is used in environments where native modules are not available:
 * - Expo Go
 * - Web browsers
 *
 * In builds with native dependencies (Expo EAS or dev-client), the actual native
 * AdaptyPaywallView component will be used instead, which renders the real paywall
 * UI configured in the Adapty Dashboard.
 *
 * @see {@link https://docs.adapty.io/docs/paywall-builder-getting-started Adapty Paywall Builder Documentation}
 */
const AdaptyPaywallViewMock = props => {
    (0, react_1.useEffect)(() => {
        console.info('[Adapty Mock] AdaptyPaywallView mounted');
        return () => {
            console.info('[Adapty Mock] AdaptyPaywallView unmounted');
        };
    }, []);
    return (<react_native_1.View {...props} style={[mock_styles_1.mockStyles.container, props.style]}>
      <react_native_1.View style={mock_styles_1.mockStyles.content}>
        <react_native_1.View style={mock_styles_1.mockStyles.iconContainer}>
          <react_native_1.Text style={mock_styles_1.mockStyles.icon}>📦</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.Text style={mock_styles_1.mockStyles.title}>AdaptyPaywallView</react_native_1.Text>
        <react_native_1.View style={mock_styles_1.mockStyles.infoBox}>
          <react_native_1.Text style={mock_styles_1.mockStyles.infoText}>
            This is a mock component. The real Adapty paywall will be displayed in builds with native dependencies (Expo EAS or dev-client).
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={mock_styles_1.mockStyles.noteBox}>
          <react_native_1.Text style={mock_styles_1.mockStyles.noteText}>
            💡 Running on: Expo Go, Web.
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.AdaptyPaywallViewMock = AdaptyPaywallViewMock;
//# sourceMappingURL=AdaptyPaywallView.mock.js.map