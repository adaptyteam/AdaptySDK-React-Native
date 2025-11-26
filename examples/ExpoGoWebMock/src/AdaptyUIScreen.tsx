import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPaywallView } from 'react-native-adapty';
import type {
  AdaptyPaywall,
  AdaptyPaywallProduct,
  AdaptyProfile,
  AdaptyPurchaseResult,
} from 'react-native-adapty';
import { styles } from './styles';

interface AdaptyUIScreenProps {
  paywall: AdaptyPaywall;
  onSuccess: (profile: AdaptyProfile) => void;
  onClose: () => void;
}

export default function AdaptyUIScreen({
  paywall,
  onSuccess,
  onClose,
}: AdaptyUIScreenProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isPresented, setIsPresented] = React.useState(false);

  React.useEffect(() => {
    showPaywall();
  }, []);

  const showPaywall = async () => {
    if (!paywall.hasViewConfiguration) {
      setError('Paywall does not have Paywall Builder configuration.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create paywall view
      const view = await createPaywallView(paywall);

      // Set up event handlers
      await view.setEventHandlers({
        onPurchaseCompleted: (
          purchaseResult: AdaptyPurchaseResult,
          _product: AdaptyPaywallProduct,
        ) => {
          // Purchase completed successfully
          if (purchaseResult.type === 'success') {
            // Update profile to reflect new access level
            onSuccess(purchaseResult.profile);
            // Close paywall by returning true
            return true;
          }
          // Don't close for cancelled or pending purchases
          return false;
        },
        onCloseButtonPress: () => {
          onClose();
          return true;
        },
      });

      // Present the paywall
      await view.present();
      
      setIsLoading(false);
      setIsPresented(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to show paywall';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading Adapty UI...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If paywall is presented, show info screen (native UI won't show in mock mode)
  if (isPresented) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.adaptyUIInfo}>
            <Text style={styles.adaptyUIInfoTitle}>
              Adapty Paywall Builder UI
            </Text>
            <Text style={styles.adaptyUIInfoText}>
              The native Adapty paywall was not displayed because mock mode is enabled.
            </Text>
            <Text style={styles.adaptyUIInfoText}>
              In production, this would show a native paywall UI configured in the Adapty Dashboard.
            </Text>
            <Text style={styles.adaptyUIInfoNote}>
              💡 To see the real Adapty UI, run this app on a native build (iOS/Android) without mock mode.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
          >
            <Text style={styles.backButtonText}>← Back to Recipes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

