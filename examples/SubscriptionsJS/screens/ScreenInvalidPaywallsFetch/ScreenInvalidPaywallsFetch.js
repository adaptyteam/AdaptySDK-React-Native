import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SectionEmoji} from '../../components/SectionEmoji';
import {Section} from '../../components/Section';
import {Link} from '../../components/Link';

/*
 * ScreenInvalidUserFetch displays an error message,
 * that you need to fix something in your Adapty dashboard
 *
 * This code should not be used inside your application, because
 * in your app credentials are static
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const ScreenInvalidPaywallsFetch = () => {
  return (
    <View style={styles.container}>
      <SectionEmoji emoji="🧱">Fetching paywalls</SectionEmoji>
      <Section title="Paywalls fetching & listing">
        If you have successfully configured Adapty for your app, you only need
        to create a paywall in your Adapty dashboard and fill it with products
      </Section>
      <Link
        href="https://docs.adapty.io/v1.0/docs/quickstart#creating-a-product"
        style={{marginBottom: 24}}>
        How do I create a product in Adapty dashboard?
      </Link>

      <Section title="Getting an error">
        If you are sure, you have configured Adapty correctly, contact us, so we
        can help you
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 32, justifyContent: 'center'},
  center: {justifyContent: 'center', textAlign: 'center'},
  textCenter: {textAlign: 'center', paddingHorizontal: 16, paddingBottom: 16},
});
