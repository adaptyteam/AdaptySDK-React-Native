import React from "react";
import { Text, StyleSheet, View } from "react-native";

/*
 * SectionEmoji component displays a view with a huge emoji and description
 *
 * This code does not provide any useful knowledge
 * about Adapty SDK
 */
export const SectionEmoji = ({ emoji, children }) => {
  return (
    <View style={styles.emojiContainer}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.emojiDesc}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emojiContainer: { marginTop: 8, marginBottom: 40, alignItems: "center" },
  emoji: { fontSize: 100, textAlign: "center" },
  emojiDesc: {
    opacity: 0.3,
    fontSize: 15,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },
});
