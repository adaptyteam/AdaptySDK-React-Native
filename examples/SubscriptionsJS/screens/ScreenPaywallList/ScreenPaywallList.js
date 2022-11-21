import React, {useEffect, useState} from 'react';
import {TouchableHighlight, Text, View, Button, StyleSheet} from 'react-native';

import {adapty} from 'react-native-adapty';

import {colors} from '../../components/Colors';
import {Link} from '../../components/Link';
import {Modal} from '../../components/Progress/Modal';
import {Section} from '../../components/Section';
import {SectionEmoji} from '../../components/SectionEmoji';
import {H3} from '../../components/Text';
import {ScreenPaywall} from '../ScreenPaywall/ScreenPaywall';

export const ScreenPaywallList = () => {
  // A list of paywalls, that you can open
  // In your app you probably want to introduce more advanced logic, such as
  // displaying one exact paywall for a specific user
  const [paywalls, setPaywalls] = useState([]);
  // A fetching error, if fetching paywalls failed,
  // you can inform user about it
  const [error, setError] = useState(null);
  // A loading flag, display while paywalls are fetching
  const [isLoading, setIsLoading] = useState(true);
  // A developer ID of a paywall, that you want to open in a modal
  const [visiblePaywallId, setVisiblePaywallId] = useState(null);

  async function fetchPaywalls() {
    setIsLoading(true);

    try {
      console.info('[ADAPTY] Fetching paywalls...');

      const fetchedPaywalls = await adapty.paywalls.getPaywalls();
      setPaywalls(fetchedPaywalls.paywalls);
    } catch (adaptyError) {
      console.warn('[ADAPTY] Failed to fetch paywall list', adaptyError);
      setError(adaptyError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPaywalls(); // Fetch paywalls on mount
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionEmoji emoji="⏱️">Loading paywalls...</SectionEmoji>
      </View>
    );
  }

  // Adapty provides convinient error messages for a user
  // and error codes for developers
  if (error) {
    return (
      <View style={styles.container}>
        <Section title={`Failed to fetch paywall list (#${error.code})`}>
          {error.localizedDescription || 'Unknown error'}
        </Section>
        <Button title="Refetch" onPress={fetchPaywalls} />
      </View>
    );
  }

  if (paywalls.length === 0) {
    return (
      <View style={styles.container}>
        <SectionEmoji emoji="💩">Paywall list is empty</SectionEmoji>
        <Link
          href="https://docs.adapty.io/docs/paywall"
          style={styles.centerText}>
          How to add a paywall?
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <H3>Paywalls</H3>
      {paywalls.map(paywall => (
        <React.Fragment key={paywall.developerId}>
          <TouchableHighlight
            style={styles.paywallContainer}
            underlayColor={colors.primary10}
            activeOpacity={0.5}
            onPress={() => setVisiblePaywallId(paywall.developerId)}>
            <Text style={styles.paywallNameText}>
              {paywall.name} ({paywall.products.length} products)
            </Text>
          </TouchableHighlight>

          {/*
           * I don't think that creating many modals
           * is an appropriate code design for a production app
           *
           * In demonstration purposes, I'm creating a 'linked' modal for every paywall
           */}
          <Modal
            visible={visiblePaywallId === paywall.developerId}
            onRequestClose={() => setVisiblePaywallId(null)}
            onSuccess={() => {
              setVisiblePaywallId(null);
              // Updating subscription status in this
              // example is performed via a global listener
              // So, we don't need to do anything here
            }}>
            <ScreenPaywall paywall={paywall} />
          </Modal>
        </React.Fragment>
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
});
