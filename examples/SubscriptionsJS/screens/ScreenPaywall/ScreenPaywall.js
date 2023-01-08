/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';

import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import {adapty} from 'react-native-adapty';
import {colors} from '../../components/Colors';
import {SectionEmoji} from '../../components/SectionEmoji';
import {Body, H3} from '../../components/Text';

export const ScreenPaywall = ({paywall, onSuccess = () => undefined}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paywall) {
      return;
    }

    console.log(`[ADAPTY] Paywall "${paywall.name}" opened.`);
    fetchProducts();
  }, [paywall?.id]);

  async function fetchProducts() {
    setIsLoading(true);
    setError(null);

    console.log(`[ADAPTY] Fetching products for paywall "${paywall.name}"`);
    try {
      await adapty.logShowPaywall(paywall);
      console.log('[ADAPTY] Paywall shown logged successfully');
      const products_ = await adapty.getPaywallProducts(paywall);
      console.log('[ADAPTY] Paywall products fetched success: ', products_);
      setProducts(products_);
    } catch (error_) {
      console.error(
        '[ADAPTY] Error fetching paywall products: ',
        JSON.stringify(error_),
      );
      setError(error_);
    } finally {
      setIsLoading(false);
    }
  }

  /*
   * I don't think, that handling logic such as purchase
   * should be performed this deep in the component tree in your production app
   *
   * Yet, as a simpliest example, you can perform purchases inside this component
   * And handle it with a listener
   */
  async function purchase(product) {
    setIsProcessing(true);

    try {
      console.info('[ADAPTY] Purchasing product...', product);
      const profile = await adapty.makePurchase(product);
      console.log('[ADAPTY] Purchase result: SUCCESS');
      onSuccess(profile);
    } catch (error_) {
      console.error('[ADAPTY] Error fetching paywall products: ', error_);
      setError(error_);
    } finally {
      setIsProcessing(false);
    }
  }

  const renderProducts = () => {
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View style={styles.container}>
          <SectionEmoji emoji="🙊">No products in this paywall</SectionEmoji>
        </View>
      );
    }

    return (
      <>
        {products.map(product => (
          <View key={product.vendorProductId} style={styles.productContainer}>
            <TouchableOpacity
              activeOpacity={0.2}
              style={styles.productPressableContainer}
              disabled={isProcessing}
              onPress={() => purchase(product)}>
              <Text style={styles.productNameText}>
                {product.localizedTitle}
              </Text>
              {product.localizedDescription && (
                <Body>{product.localizedDescription}</Body>
              )}
              <Body style={styles.productPriceText}>
                {product.localizedPrice} / {product.localizedSubscriptionPeriod}
              </Body>
            </TouchableOpacity>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator style={styles.loadingIndicator} />
              </View>
            )}
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <H3>{paywall.name}</H3>
      {renderProducts()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  paywallContainer: {
    paddingVertical: 10,
  },
  paywallNameText: {
    fontSize: 17,
  },
  centerText: {
    alignItems: 'center',
  },
  productContainer: {
    margin: 8,
    borderRadius: 8,
    backgroundColor: colors.primary10,
  },
  productPressableContainer: {
    padding: 8,
    alignItems: 'center',
  },
  productPriceText: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.8,
  },
  loadingIndicator: {
    flexGrow: 0,
    padding: 8,
    backgroundColor: colors.primary10,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
