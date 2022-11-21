import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {colors} from '../Colors';

/*
 * H3 component displays a text with basic formatting
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const H4 = ({children, style}) => {
  return <Text style={[styles.h4, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  h4: {
    color: colors.black60,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
    marginTop: 4,
  },
});
