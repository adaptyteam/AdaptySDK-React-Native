import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SectionEmoji} from '../../components/SectionEmoji';
import {Section} from '../../components/Section';
import {Link} from '../../components/Link';

/*
 * ScreenInvalidActivation displays an error message,
 * that you need to fix something in your Adapty dashboard
 *
 * This code should not be used inside your application, because
 * in your app credentials are static
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const ScreenInvalidActivation = () => {
  return (
    <View style={styles.container}>
      <SectionEmoji emoji="📈">Adapty activation</SectionEmoji>
      <Section title="Activation proccess">
        In order Adapty to work properly, you need to provide:
        {'\n\u2022'} Your Adapty token
        {'\n\u2022'} iOS Bundle ID
        {'\n\u2022'} Android AppID
      </Section>
      <Link
        href="https://docs.adapty.io/docs/quickstart"
        style={{marginBottom: 24}}>
        Where can I get my token?
      </Link>

      <Section title="Getting an error">
        You have probably forgotten to set Bundle ID/App ID or you have probably
        provided invalid token
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 32, justifyContent: 'center'},
  center: {justifyContent: 'center', textAlign: 'center'},
  textCenter: {textAlign: 'center', paddingHorizontal: 16, paddingBottom: 16},
});
