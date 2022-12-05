import React from "react";
import { StyleSheet, View } from "react-native";

import { Body, H3 } from "../Text";

/*
 * Section component displays a view with a title and body text
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const Section = ({ style, textStyle, title, children }) => {
  return (
    <View style={style}>
      {title && <H3 style={textStyle}>{title}</H3>}
      <Body style={[styles.bodyText, textStyle]}>{children}</Body>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyText: {
    color: "#222",
  },
});
