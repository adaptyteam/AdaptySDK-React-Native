import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NativeAdaptyPaywallViewProps } from './types';
import { mockStyles } from './mock-styles';

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
export const AdaptyPaywallViewMock: React.FC<
  NativeAdaptyPaywallViewProps
> = props => {
  useEffect(() => {
    console.info('[Adapty Mock] AdaptyPaywallView mounted');
    return () => {
      console.info('[Adapty Mock] AdaptyPaywallView unmounted');
    };
  }, []);

  return (
    <View {...props} style={[mockStyles.container, props.style]}>
      <View style={mockStyles.content}>
        <View style={mockStyles.iconContainer}>
          <Text style={mockStyles.icon}>📦</Text>
        </View>
        <Text style={mockStyles.title}>AdaptyPaywallView</Text>
        <View style={mockStyles.infoBox}>
          <Text style={mockStyles.infoText}>
            This is a mock component. The real Adapty paywall will be displayed
            in builds with native dependencies (Expo EAS or dev-client).
          </Text>
        </View>
        <View style={mockStyles.noteBox}>
          <Text style={mockStyles.noteText}>💡 Running on: Expo Go, Web.</Text>
        </View>
      </View>
    </View>
  );
};
