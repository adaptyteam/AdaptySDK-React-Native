import React, { useState } from 'react';
import { Alert, Linking } from 'react-native';
import { createPaywallView } from 'react-native-adapty/dist/ui';
import { ViewController } from 'react-native-adapty/dist/ui/view-controller';
import {
  adapty,
  AdaptyError,
  AdaptyPaywall,
  AdaptyPaywallProduct,
  GetPlacementForDefaultAudienceParamsInput,
} from 'react-native-adapty';

import { Group } from './Group';
import { LineButton } from './LineButton';
import { LineParam } from './LineParam';
import { Bool } from './Bool';
import { readPlacementId } from '../helpers';

interface Props {
  placementId?: string;
}

export const PaywallSection: React.FC<Props> = ({
  placementId,
}) => {
  const [paywall, setPaywall] = useState<AdaptyPaywall | null>(null);
  const [products, setProducts] = useState<AdaptyPaywallProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPaywall = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const effectivePlacementId = placementId || readPlacementId();

      console.log(
        '[ADAPTY]: Fetching paywall for default audience:',
        effectivePlacementId,
      );

      const params: GetPlacementForDefaultAudienceParamsInput = {
        fetchPolicy: 'reload_revalidating_cache_data',
      };

      const paywall_ = await adapty.getPaywallForDefaultAudience(
        effectivePlacementId,
        undefined,
        params,
      );
      setPaywall(paywall_);

      // Log paywall show event
      await adapty.logShowPaywall(paywall_);

      // Fetch products
      const products_ = await adapty.getPaywallProducts(paywall_);
      setProducts(products_);

      console.log('[ADAPTY] Paywall loaded successfully:', paywall_.name);
    } catch (error: any) {
      console.log('[ADAPTY] Error getting paywall:', error.message);
      if (error instanceof AdaptyError) {
        Alert.alert(
          `Error fetching paywall #${error.adaptyCode}`,
          error.localizedDescription,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const presentPaywall = async () => {
    if (!paywall) {
      Alert.alert('Error', 'Paywall not loaded. Please load paywall first.');
      return;
    }

    let view: ViewController | null = null;

    try {
      // Create paywall view
      view = await createPaywallView(paywall, {
        customTags: {
          USERNAME: 'User',
          CITY: 'React Native',
        },
      });

      console.log('[ADAPTY] Paywall view created successfully');
    } catch (error: any) {
      console.log('[ADAPTY] Failed to create paywall view:', error.message);
      if (error instanceof AdaptyError) {
        Alert.alert('Failed to create paywall view', error.message);
      }
      return;
    }

    if (!view) {
      Alert.alert('Error', 'Failed to create paywall view');
      return;
    }

    // Register event handlers
    view.setEventHandlers({
      onCloseButtonPress() {
        console.log('[ADAPTY]: Close button pressed');
        return true;
      },
      onAndroidSystemBack() {
        console.log('[ADAPTY]: Android system back');
        return true;
      },
      onProductSelected(productId) {
        console.log('[ADAPTY]: Product selected', productId);
        return false;
      },
      onLoadingProductsFailed(error) {
        console.log('[ADAPTY]: Loading products failed', error);
        return false;
      },
      onPurchaseCompleted(purchaseResult, product) {
        console.log(
          '[ADAPTY]: Purchase completed. Result:',
          purchaseResult,
          'Product:',
          product,
        );

        switch (purchaseResult.type) {
          case 'success':
            console.log('Access levels:', purchaseResult.profile.accessLevels);
            const isSubscribed =
              purchaseResult.profile?.accessLevels?.['premium']?.isActive;
            console.log('Is subscribed:', isSubscribed);
            break;
          case 'user_cancelled':
            console.log('User cancelled purchase');
            break;
          case 'pending':
            console.log('Purchase is pending');
            break;
        }

        return purchaseResult.type !== 'user_cancelled';
      },
      onPurchaseFailed(error, product) {
        console.log(
          '[ADAPTY]: Purchase failed. Error:',
          error,
          'Product:',
          product,
        );
        return false;
      },
      onPurchaseStarted(product) {
        console.log('[ADAPTY]: Purchase started', product);
        return false;
      },
      onRenderingFailed(error) {
        console.log('[ADAPTY]: Rendering failed', error);
        Alert.alert('Rendering failed', error.message);
        return false;
      },
      onRestoreStarted() {
        console.log('[ADAPTY]: Restore started');
        return false;
      },
      onRestoreCompleted(profile) {
        console.log('[ADAPTY]: Restore completed', profile);
        return true;
      },
      onRestoreFailed(error) {
        console.log('[ADAPTY]: Restore failed', error);
        return false;
      },
      onCustomAction(actionId) {
        console.log('[ADAPTY]: Custom action', actionId);
        return false;
      },
      onUrlPress(url) {
        console.log('[ADAPTY]: URL press', url);
        Linking.openURL(url);
        return false;
      },
      onWebPaymentNavigationFinished(product, error) {
        console.log(
          '[ADAPTY]: Web payment navigation finished',
          product || error,
        );
        return false;
      },
      onPaywallShown() {
        console.log('[ADAPTY]: Paywall shown');
        return false;
      },
      onPaywallClosed() {
        console.log('[ADAPTY]: Paywall closed');
        return false;
      },
    });

    try {
      // Present paywall; for iOS you can choose a presentation style
      // Available options: 'full_screen' (default) or 'page_sheet'
      await view.present({ iosPresentationStyle: 'page_sheet' });
      console.log('[ADAPTY] Paywall presented successfully');
    } catch (error: any) {
      console.log('[ADAPTY] Failed to present paywall:', error.message);
      if (error instanceof AdaptyError) {
        Alert.alert('Failed to present paywall', error.message);
      }
    }
  };

  const renderPaywallInfo = () => {
    if (!paywall) return null;

    return (
      <>
        <LineParam label="Paywall ID" value={paywall.name} bordered />
        <LineParam label="Variation ID" value={paywall.variationId} bordered />
        <LineParam
          label="Revision"
          value={paywall.placement.revision.toString()}
          bordered
        />
        <LineParam
          label="Has Remote Config"
          value={<Bool value={!!paywall.remoteConfig} />}
          bordered
        />
        <LineParam
          label="Has Paywall Builder"
          value={<Bool value={!!paywall.paywallBuilder} />}
          bordered
        />
        <LineParam
          label="Products Count"
          value={products.length.toString()}
          bordered={products.length > 0}
        />

        {products.map((product, index) => (
          <LineParam
            key={product.vendorProductId}
            label={`  ${product.localizedTitle}`}
            value={product.price?.localizedString || 'N/A'}
            bordered={index < products.length - 1}
          />
        ))}
      </>
    );
  };

  return (
    <Group title="Paywall" postfix="Default Audience">
      <LineButton
        text={paywall ? 'Refresh Paywall' : 'Load Paywall'}
        bordered
        topRadius
        loading={isLoading}
        onPress={fetchPaywall}
      />

      <LineButton
        text="Present Paywall"
        bordered={!!paywall}
        bottomRadius={!paywall}
        disabled={!paywall}
        onPress={presentPaywall}
      />

      {renderPaywallInfo()}
    </Group>
  );
};
