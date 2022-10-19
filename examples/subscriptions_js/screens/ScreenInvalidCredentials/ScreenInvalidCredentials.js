import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SectionEmoji} from '../../components/SectionEmoji';
import {Section} from '../../components/Section';
import {Link} from '../../components/Link';

/*
 * ScreenInvalidCredentials displays an error message,
 * that you need to provide valid credentials
 *
 * This code should not be used inside your application, because
 * in your app credentials are static
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const ScreenInvalidCredentials = () => {
  return (
    <View style={styles.container}>
      <SectionEmoji emoji="🗿">Provide your credentials</SectionEmoji>
      <Section style={styles.center} textStyle={styles.textCenter}>
        It seems, you have forgotten to set up your credentials. Follow the
        instructions in the example README.md file to proceed.
      </Section>
      <Link
        href="https://docs.adapty.io/docs/quickstart"
        style={styles.center}
        textStyle={styles.textCenter}>
        Where can I get my token?
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 24, justifyContent: 'center'},
  center: {justifyContent: 'center', textAlign: 'center'},
  textCenter: {textAlign: 'center'},
});
