import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {SFSymbol} from 'react-native-sfsymbols';

export const Bool = ({value}) => {
  if (value) {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' ? (
          <SFSymbol
            name="checkmark.circle"
            scale="medium"
            color="#34C759"
            size={16}
            resizeMode="center"
            style={styles.icon}
          />
        ) : (
          <Text style={styles.icon}>✅</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <SFSymbol
          name="xmark.circle"
          scale="medium"
          color="red"
          size={16}
          resizeMode="center"
          style={styles.icon}
        />
      ) : (
        <Text style={styles.icon}>❌</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 12,
  },
  icon: {
    position: 'absolute',
    width: 16,
    height: 16,
    top: 1,
    right: 0,
  },
});
