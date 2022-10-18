import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {colors} from '../Colors';

export const Body = ({children, style}) => {
  return <Text style={[styles.body, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  body: {
    color: colors.black,
    fontSize: 15,
    lineHeight: 22,
  },
});
