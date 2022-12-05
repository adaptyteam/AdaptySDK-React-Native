import React from "react";
import { StyleSheet, Text } from "react-native";

import { colors } from "../Colors";

/*
 * H1 component displays a text with basic formatting
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const H1 = ({ children, style }) => {
  return <Text style={[styles.h1, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  h1: {
    color: colors.black,
    fontSize: 40,
    fontWeight: "700",
  },
});
