import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

export const SectionEmoji = ({emoji, children}) => {
  return (
    <View style={styles.emojiContainer}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.emojiDesc}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emojiContainer: {
    marginTop: 30,
    marginBottom: 54,
    flex: 1,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 100,
    textAlign: 'center',
  },
  emojiDesc: {
    opacity: 0.3,
    fontSize: 15,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});
