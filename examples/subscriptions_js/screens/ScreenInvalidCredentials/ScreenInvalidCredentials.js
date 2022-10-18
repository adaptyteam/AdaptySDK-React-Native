import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SectionEmoji} from '../../components/SectionEmoji';
import {Section} from '../../components/Section';
import {Link} from '../../components/Link';

export const ScreenInvalidCredentials = () => {
  return (
    <View style={styles.container}>
      <SectionEmoji emoji="🗿">Provide your credentials</SectionEmoji>
      <Section>
        It seems, you have forgotten to set up your credentials. Follow the
        instructions in the example README.md file to proceed.
      </Section>
      <Link href="https://docs.adapty.io/docs/quickstart">
        Where can I get my token?
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 24},
});
