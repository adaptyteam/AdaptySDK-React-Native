/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {createPaywallView} from '@adapty/react-native-ui/dist/index';
import {Group} from '../Group';
import {LineInput} from '../LineInput';
import {LineParam} from '../LineParam';
import {
  AdaptyError,
  AndroidSubscriptionUpdateProrationMode,
  adapty,
} from 'react-native-adapty';
import {LineButton} from '../LineButton';
import {Alert} from 'react-native';

export const GroupPaywall = ({paywallId, postfix}) => {
  const [paywall, setPaywall] = useState(null);
  const [locale, setLocale] = useState('');
  const [products, setProducts] = useState([]);
  const [id, setId] = useState(paywallId || '');

  const fetchPaywall = async () => {
    try {
      console.log('[ADAPTY]: Fetching paywall:', id);
      const paywall_ = await adapty.getPaywall(id, locale || undefined);
      setPaywall(paywall_);
      console.log('paywall', JSON.stringify(paywall_));
      await adapty.logShowPaywall(paywall_);

      const products_ = await adapty.getPaywallProducts(paywall_);
      setProducts(products_);
    } catch (error) {
      console.log('[ADAPTY] Error getting paywall:', error.message);

      if (error instanceof AdaptyError) {
        Alert.alert(
          `Error fetching paywall #${error.adaptyCode}`,
          error.localizedDescription,
        );
      }
    }
  };

  useEffect(() => {
    if (paywallId) {
      fetchPaywall();
    }
  }, [paywallId]);

  const renderPaywall = () => {
    if (!paywall) {
      return null;
    }

    return (
      <>
        <LineParam label="Variation" value={paywall.variationId} bordered />
        <LineParam label="Revision" value={paywall.revision} bordered />

        {products.map(product => (
          <LineParam
            rightHeavy
            key={product.vendorProductId}
            label={product.localizedTitle}
            value={product.localizedPrice}
            onPress={async () => {
              try {
                console.log('[ADAPTY] Purchasing product: ', product);
                await adapty.makePurchase(product, {
                  android: {
                    oldSubVendorProductId: 'monthly.premium.999',
                    prorationMode:
                      AndroidSubscriptionUpdateProrationMode.ImmediateAndChargeProratedPrice,
                  },
                });
                console.log('[ADAPTY] Purchase successful');
                // success, profile event should be triggered
              } catch (error) {
                console.log('[ADAPTY] Error:', error.message);
                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error purchasing product #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
            bordered
          />
        ))}
      </>
    );
  };

  return (
    <Group title="Paywall" postfix={postfix}>
      <LineInput
        placeholder="Paywall ID"
        value={id}
        onChange={setId}
        editable={!paywallId}
        bordered
      />
      <LineInput
        placeholder="Locale"
        value={locale}
        onChange={setLocale}
        bordered
      />
      {renderPaywall()}
      <LineButton
        text={paywall ? 'Refresh' : 'Load'}
        bordered
        onPress={async () => {
          try {
            console.log('[ADAPTY] Fetching paywall with ID: ', paywallId);

            await fetchPaywall();
          } catch (error) {
            console.log('[ADAPTY] Error:', error.message);
          }
        }}
      />

      <LineButton
        text={'Present'}
        disabled={!paywall}
        bottomRadius
        onPress={async () => {
          const view = await createPaywallView(paywall);
          const unsub = view.registerEventHandlers({
            onCloseButtonPress() {
              console.log('close button press');
              // view.dismiss();
              return true;
            },
            onProductSelected() {
              console.log('product selected');
            },
            onLoadingProductsFailed(error) {
              console.log('loading products failed', error);
            },
            onPurchaseCancelled() {
              console.log('purchase cancelled');
            },
            onPurchaseCompleted(profile) {
              console.log('purchase completed ', profile);
              return true;
            },
            onPurchaseFailed(error) {
              console.log('purchase error ', error);
            },
            onPurchaseStarted() {
              console.log('purchase started');
            },
            onRenderingFailed(error) {
              console.log('error rendering ', error);
            },
            onRestoreCompleted(profile) {
              console.log('restore completed ', profile);
              return true;
            },
            onRestoreFailed(error) {
              console.log('restore failed', error);
            },
          });
          await view.present();
          // try {
          //   console.log('[ADAPTY] Presenting paywall with ID: ', paywallId);
          //   adapty.addPaywallViewListener('onCloseButtonPress', () => {
          //     console.log('[ADAPTY] Paywall closed');
          //   });
          //   adapty.addPaywallViewListener('onLoadingProductsFail', error => {
          //     console.log(
          //       '[ADAPTY] Paywall failed to load products',
          //       error.message,
          //     );
          //   });
          //   adapty.addPaywallViewListener('onPurchaseFinish', profile => {
          //     console.log('[ADAPTY] Purchase successful', profile);
          //   });
          //   adapty.addPaywallViewListener('onPurchaseFail', error => {
          //     console.log('[ADAPTY] Purchase failed', error.message);
          //   });
          //   adapty.addPaywallViewListener('onRestoreFinish', profile => {
          //     console.log('[ADAPTY] Restore successful', profile);
          //   });
          //   adapty.addPaywallViewListener('onRestoreFail', error => {
          //     console.log('[ADAPTY] Restore failed', error.message);
          //   });
          //   adapty.addPaywallViewListener('onProductSelect', () => {
          //     console.log('[ADAPTY] Product selected');
          //   });
          //   adapty.addPaywallViewListener('onPurchaseCancel', () => {
          //     console.log('[ADAPTY] Purchase cancelled');
          //   });
          //   await adapty.presentView(paywall);
          // } catch (error) {
          //   console.log('[ADAPTY] Error:', error.message);
          // }
        }}
      />
    </Group>
  );
};
