import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Body, H3} from '../Text';

export const Section = ({title, children}) => {
  return (
    <View>
      {title && <H3>{title}</H3>}
      <Body style={styles.bodyText}>{children}</Body>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyText: {
    color: '#222',
  },
});
