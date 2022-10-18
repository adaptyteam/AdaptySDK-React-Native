import React from 'react';

import {TouchableOpacity, StyleSheet} from 'react-native';
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';
import {colors} from '../Colors';

import {Body} from '../Text';

export const Link = ({href, style, children}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => openURLInBrowser(href)}
      style={[styles.container, style]}>
      <Body style={styles.bodyText}>{children}</Body>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  bodyText: {
    color: colors.blue40,
  },
});
