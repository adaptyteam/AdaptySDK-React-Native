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
export const ScreenInvalidUserFetch = () => {
  return (
    <View style={styles.container}>
      <SectionEmoji emoji="🥷">Fetching user status</SectionEmoji>
      <Section title="Purchaser fetching">
        In order Adapty to fetch user status properly, you need to configure
        your Adapty dashboard for your current platform
      </Section>
      <Link
        href="https://docs.adapty.io/v1.0/docs/quickstart#configuring-platforms"
        style={{marginBottom: 24}}>
        How do I configure Adapty for iOS/Android?
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
