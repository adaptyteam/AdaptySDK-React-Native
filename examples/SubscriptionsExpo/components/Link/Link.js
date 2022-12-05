import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import openURLInBrowser from "react-native/Libraries/Core/Devtools/openURLInBrowser";

import { colors } from "../Colors";

import { Body } from "../Text";

/*
 * Link component displays a touchable text,
 * that will try to open a link in a browser
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const Link = ({ href, style, textStyle, children }) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => openURLInBrowser(href)}
      style={[styles.container, style]}
    >
      <Body style={[styles.bodyText, textStyle]}>{children}</Body>
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
