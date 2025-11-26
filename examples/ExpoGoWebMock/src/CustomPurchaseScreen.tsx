import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adapty } from 'react-native-adapty';
import type {
  AdaptyPaywall,
  AdaptyPaywallProduct,
  AdaptyProfile,
} from 'react-native-adapty';
import { styles } from './styles';

interface CustomPurchaseScreenProps {
  paywall: AdaptyPaywall;
  onSuccess: (profile: AdaptyProfile) => void;
  onClose: () => void;
}

export default function CustomPurchaseScreen({
  paywall,
  onSuccess,
  onClose,
}: CustomPurchaseScreenProps) {
  const [products, setProducts] = useState<AdaptyPaywallProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const paywallProducts = await adapty.getPaywallProducts(paywall);
      setProducts(paywallProducts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (product: AdaptyPaywallProduct) => {
    try {
      setIsPurchasing(true);
      setError(null);

      const result = await adapty.makePurchase(product);

      if (result.type === 'success') {
        // Purchase successful - update profile and close
        onSuccess(result.profile);
      } else if (result.type === 'user_cancelled') {
        setError('Purchase was cancelled');
      } else if (result.type === 'pending') {
        setError('Purchase is pending');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to complete purchase';
      setError(errorMessage);
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatPrice = (product: AdaptyPaywallProduct): string => {
    return product.price?.localizedString || 'N/A';
  };

  const getProductPeriod = (product: AdaptyPaywallProduct): string => {
    const period = product.subscription?.subscriptionPeriod;
    if (!period) return '';
    
    const { numberOfUnits, unit } = period;
    const unitMap: Record<string, string> = {
      day: numberOfUnits === 1 ? 'day' : 'days',
      week: numberOfUnits === 1 ? 'week' : 'weeks',
      month: numberOfUnits === 1 ? 'month' : 'months',
      year: numberOfUnits === 1 ? 'year' : 'years',
    };
    
    return `/ ${numberOfUnits} ${unitMap[unit] || unit}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Get Premium</Text>
          <Text style={styles.purchaseSubtitle}>
            Unlock all premium recipes
          </Text>
        </View>

        {/* Error display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Products list */}
        <View style={styles.section}>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>No products available</Text>
          ) : (
            products.map((product, index) => (
              <TouchableOpacity
                key={product.vendorProductId}
                style={styles.productCard}
                onPress={() => handlePurchase(product)}
                disabled={isPurchasing}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle}>
                    {product.localizedTitle}
                  </Text>
                  <Text style={styles.productDescription}>
                    {product.localizedDescription}
                  </Text>
                </View>
                <View style={styles.productPrice}>
                  <Text style={styles.priceAmount}>{formatPrice(product)}</Text>
                  <Text style={styles.pricePeriod}>
                    {getProductPeriod(product)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.purchaseActions}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isPurchasing}
          >
            <Text style={styles.closeButtonText}>
              {isPurchasing ? 'Processing...' : 'Maybe Later'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


