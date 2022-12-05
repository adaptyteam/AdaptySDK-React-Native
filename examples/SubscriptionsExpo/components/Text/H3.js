import React from "react";
import { StyleSheet, Text } from "react-native";

import { colors } from "../Colors";

/*
 * H3 component displays a text with basic formatting
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const H3 = ({ children, style }) => {
  return <Text style={[styles.h3, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  h3: {
    color: colors.black,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
});
