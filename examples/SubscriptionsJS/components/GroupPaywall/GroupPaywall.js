/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {Group} from '../Group';
import {LineInput} from '../LineInput';
import {LineParam} from '../LineParam';
import {AdaptyError, adapty} from 'react-native-adapty';
import {LineButton} from '../LineButton';
import {Alert} from 'react-native';
import {readCredentials} from '../../helpers';

export const GroupPaywall = ({paywallId, postfix}) => {
  const [paywall, setPaywall] = useState(null);
  const [products, setProducts] = useState([]);
  const [id, setId] = useState(paywallId || '');

  const fetchPaywall = async () => {
    try {
      // Just to wait for the SDK to be initialized
      const token = await readCredentials();
      await adapty.activate(token);
    } catch {}

    const paywall_ = await adapty.getPaywall(id);
    setPaywall(paywall_);

    await adapty.logShowPaywall(paywall_);

    const products_ = await adapty.getPaywallProducts(paywall_);
    setProducts(products_);
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
            key={product.vendorProductId}
            label={product.localizedTitle}
            value={product.localizedPrice}
            onPress={async () => {
              try {
                console.log('[ADAPTY] Purchasing product: ', product);
                await adapty.makePurchase(product);
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
      {renderPaywall()}
      <LineButton
        text={paywall ? 'Refresh' : 'Load'}
        bottomRadius
        onPress={async () => {
          try {
            console.log('[ADAPTY] Fetching paywall with ID: ', paywallId);

            await fetchPaywall();
          } catch (error) {
            console.log('[ADAPTY] Error:', error.message);
          }
        }}
      />
    </Group>
  );
};
