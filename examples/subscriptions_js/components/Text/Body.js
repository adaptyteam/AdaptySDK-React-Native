import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {colors} from '../Colors';

/*
 * Body component displays a text with basic formatting
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
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
