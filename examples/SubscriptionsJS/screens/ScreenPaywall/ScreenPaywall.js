import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';

import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import {adapty} from 'react-native-adapty';
import {colors} from '../../components/Colors';
import {SectionEmoji} from '../../components/SectionEmoji';
import {Body, H3} from '../../components/Text';

export const ScreenPaywall = ({paywall, onSuccess = () => undefined}) => {
  // You should inform user, that purchase is in progress
  // and disable UI until purchase is finished
  const [isLoading, setIsLoading] = useState(false);

  // Save log of paywall being shown
  useEffect(() => {
    console.info(
      `[ADAPTY] User opened '${paywall.variationId}' paywall. Log saved`,
    );
    adapty.paywalls.logShow(paywall.variationId);
  }, [paywall.variationId]);

  /*
   * I don't think, that handling logic such as purchase
   * should be performed this deep in the component tree in your production app
   *
   * Yet, as a simpliest example, you can perform purchases inside this component
   * And handle it with a listener
   */
  async function purchase(product) {
    setIsLoading(true);

    try {
      console.info('[ADAPTY] Purchasing product: ', product.vendorProductId);
      await adapty.purchases.makePurchase(product);

      console.log('[ADAPTY] Purchase result: SUCCESS');
      onSuccess();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  if (paywall.products.length === 0) {
    return (
      <View style={styles.container}>
        <H3>{paywall.name}</H3>
        <SectionEmoji emoji="🙊">No products in this paywall</SectionEmoji>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <H3>{paywall.name}</H3>
      {paywall.products.map(product => (
        <View key={product.vendorProductId} style={styles.productContainer}>
          <TouchableOpacity
            activeOpacity={0.2}
            style={styles.productPressableContainer}
            disabled={isLoading}
            onPress={() => purchase(product)}>
            <Text style={styles.productNameText}>{product.localizedTitle}</Text>
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
