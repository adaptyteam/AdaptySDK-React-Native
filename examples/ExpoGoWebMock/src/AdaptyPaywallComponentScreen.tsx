import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdaptyPaywallView } from 'react-native-adapty';
import type {
  AdaptyPaywall,
  AdaptyPaywallProduct,
  AdaptyProfile,
  AdaptyPurchaseResult,
} from 'react-native-adapty';
import { styles } from './styles';

interface AdaptyPaywallComponentScreenProps {
  paywall: AdaptyPaywall;
  onSuccess: (profile: AdaptyProfile) => void;
  onClose: () => void;
}

export default function AdaptyPaywallComponentScreen({
  paywall,
  onSuccess,
  onClose,
}: AdaptyPaywallComponentScreenProps) {
  const [error, setError] = useState<string | null>(null);

  const handlePurchaseCompleted = (
    purchaseResult: AdaptyPurchaseResult,
    _product: AdaptyPaywallProduct,
  ): boolean => {
    // Purchase completed successfully
    if (purchaseResult.type === 'success') {
      // Update profile to reflect new access level
      onSuccess(purchaseResult.profile);
      // Close paywall by returning true
      return true;
    }
    // Don't close for cancelled or pending purchases
    return false;
  };

  const handleRenderingFailed = (error: Error) => {
    setError(error.message);
  };

  const handleLoadingProductsFailed = (error: Error) => {
    setError(error.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={componentStyles.header}>
        <TouchableOpacity
          style={componentStyles.closeButton}
          onPress={onClose}
        >
          <Text style={componentStyles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={componentStyles.headerTitle}>Adapty RN Component</Text>
        <View style={componentStyles.placeholder} />
      </View>

      {/* Error display */}
      {error ? (
        <View style={componentStyles.errorWrapper}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <Text style={componentStyles.errorNote}>
            The paywall component failed to render. This can happen in mock mode if the paywall doesn't have a view configuration.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
          >
            <Text style={styles.backButtonText}>← Back to Recipes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Adapty Paywall View Component
        <View style={componentStyles.paywallContainer}>
          <AdaptyPaywallView
            paywall={paywall}
            onPurchaseCompleted={handlePurchaseCompleted}
            onRenderingFailed={handleRenderingFailed}
            onLoadingProductsFailed={handleLoadingProductsFailed}
            onCloseButtonPress={onClose}
            style={componentStyles.paywallView}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const componentStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  placeholder: {
    width: 32,
  },
  paywallContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paywallView: {
    flex: 1,
    width: '100%',
  },
  errorWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  errorNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 20,
  },
});

