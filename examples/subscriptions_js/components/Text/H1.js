import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {colors} from '../Colors';

export const H1 = ({children, style}) => {
  return <Text style={[styles.h1, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  h1: {
    color: colors.black,
    fontSize: 40,
    fontWeight: '700',
  },
});
